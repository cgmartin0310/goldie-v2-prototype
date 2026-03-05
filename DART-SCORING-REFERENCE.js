import crypto from "crypto";
import { jsonrepair } from "jsonrepair";
import { buildUserPrompt, SYSTEM_PROMPT } from "./prompt.js";
import { callClaude } from "./anthropic.js";
import { withCarenetTransaction } from "../db.js";
import { config } from "../config.js";

const QUESTION_IDS = {
  recentOverdose: "0190c567-7f22-7f92-a8d4-e8d9bb47e56e",
  lifetimeOverdose: "019092b8-1aae-7d02-858e-d5ce1575fdec",
  substances: "019092b8-1aae-79a5-8fb3-4710a23c033c",
  recentReleasePast30: "019092c0-f18b-7411-99bd-c4768a935da7",
  recentReleaseSinceLast: "0190c567-7f22-7e5f-b43f-3ffc266152ee",
  naloxoneServices: "019092c0-f18a-7e26-bebc-dfaec19f19ae",
  housing: "019092b8-1aae-7f0e-8496-244ec6c49848",
};

const SUBSTANCE_CODES = {
  fentanyl: "019092b8-1aae-7b59-81ab-0d0a25ef3c0b",
  heroin: "019092b8-1aae-7496-9876-c7c805133423",
  rxOpioids: "019092b8-1aae-7c87-8658-5b2246f3b6ec",
  benzodiazepines: "019092b8-1aae-7a26-95ba-63e4cb5155e3",
  xylazine: "019092b8-1aae-7765-8005-09211e8743fd",
  methamphetamine: "019092b8-1aae-752b-ad0a-80b9a5f9b164",
  cocaine: "019092b8-1aae-7e08-8a65-7a2a6d002f00",
};

const NALOXONE_CODE = "019092c0-f18a-7195-b140-8d53289545fc";

const HOUSING_SEVERE = [
  "019092b8-1aae-725c-aedb-22e20f037cc4",
  "019092b8-1aae-7d92-8c03-c8e45a16fe42",
  "019092b8-1aae-73fa-ab5e-f41880327acb",
];

function normalizeDate(value) {
  return value ? new Date(value).getTime() : 0;
}

function getLatestAssessment(assessments, predicate) {
  const sorted = [...assessments].sort(
    (a, b) =>
      normalizeDate(b.submitted_at) ||
      normalizeDate(b.created_at) ||
      normalizeDate(b.updated_at) -
        (normalizeDate(a.submitted_at) ||
          normalizeDate(a.created_at) ||
          normalizeDate(a.updated_at))
  );

  for (const assessment of sorted) {
    if (!predicate || predicate(assessment)) {
      return assessment;
    }
  }
  return null;
}

function getLatestAnswersForQuestion(assessments, questionId, predicate, answerFilter) {
  const assessment = getLatestAssessment(assessments, (item) => {
    if (predicate && !predicate(item)) {
      return false;
    }
    return Array.isArray(item.answers)
      ? item.answers.some(
          (answer) =>
            answer.question_id === questionId &&
            (!answerFilter || answerFilter(answer))
        )
      : false;
  });

  if (!assessment?.answers) {
    return [];
  }

  return assessment.answers.filter(
    (answer) =>
      answer.question_id === questionId &&
      (!answerFilter || answerFilter(answer))
  );
}

function getAllAnswersForQuestion(assessments, questionId, predicate, answerFilter) {
  const results = [];
  for (const assessment of assessments) {
    if (predicate && !predicate(assessment)) {
      continue;
    }
    if (!Array.isArray(assessment.answers)) {
      continue;
    }
    for (const answer of assessment.answers) {
      if (answer.question_id !== questionId) {
        continue;
      }
      if (answerFilter && !answerFilter(answer)) {
        continue;
      }
      results.push(answer);
    }
  }
  return results;
}
function extractAnswerValues(answers) {
  return answers
    .map((answer) => answer.option ?? answer.value ?? null)
    .filter((value) => value !== null)
    .map((value) => String(value))
    .filter((value) => value.toLowerCase() !== "none");
}

function answerIsYes(answer) {
  const value = String(answer.option ?? answer.value ?? "").toLowerCase();
  return value === "yes" || value === "true";
}

function scoreRecentOverdose(count) {
  return count >= 1 ? 30 : 0;
}

function scoreLifetimeOverdose(count) {
  if (count >= 3) return 20;
  if (count === 2) return 15;
  if (count === 1) return 10;
  return 0;
}

function scoreSubstanceUse(substances) {
  if (substances.includes(SUBSTANCE_CODES.fentanyl)) return 20;
  if (substances.includes(SUBSTANCE_CODES.heroin)) return 15;
  if (substances.includes(SUBSTANCE_CODES.rxOpioids)) return 12;
  return 0;
}

function identifyDangerousCombinations(substances) {
  const flags = [];
  const opioidCodes = [
    SUBSTANCE_CODES.fentanyl,
    SUBSTANCE_CODES.heroin,
    SUBSTANCE_CODES.rxOpioids,
  ];
  const stimulants = [SUBSTANCE_CODES.methamphetamine, SUBSTANCE_CODES.cocaine];
  const hasOpioids = substances.some((code) => opioidCodes.includes(code));

  if (hasOpioids && substances.includes(SUBSTANCE_CODES.benzodiazepines)) {
    flags.push(
      "CRITICAL: Opioid + Benzodiazepine combination (5x increased overdose risk per CDC)"
    );
  }

  if (substances.includes(SUBSTANCE_CODES.xylazine)) {
    flags.push("CRITICAL: Xylazine (Tranq) use - naloxone may not be effective");
  }

  if (hasOpioids && substances.some((code) => stimulants.includes(code))) {
    flags.push("WARNING: Speedball use (opioid + stimulant) increases overdose risk");
  }

  return flags;
}

function scoreRecentRelease(recentRelease, sinceLast) {
  if (recentRelease || sinceLast) return 15;
  return 0;
}

function scoreNaloxone(harmReductionServices, usesOpioids) {
  const hasNaloxone = harmReductionServices.includes(NALOXONE_CODE);
  if (usesOpioids && !hasNaloxone) return 10;
  return 0;
}

function scoreHousing(housingOptions) {
  if (housingOptions.some((option) => HOUSING_SEVERE.includes(option))) {
    return 5;
  }
  return 0;
}

export function calculateOverdoseRiskRubric(patientData) {
  const assessments = Array.isArray(patientData?.recent_assessments)
    ? patientData.recent_assessments
    : [];

  const recentOverdoseAnswers = getLatestAnswersForQuestion(
    assessments,
    QUESTION_IDS.recentOverdose,
    (assessment) => String(assessment.type || "").includes("followup")
  );
  const recentOverdoseCount = Number(recentOverdoseAnswers[0]?.value || 0);

  const lifetimeOverdoseAnswers = getLatestAnswersForQuestion(
    assessments,
    QUESTION_IDS.lifetimeOverdose
  );
  const lifetimeOverdoseCount = Number(lifetimeOverdoseAnswers[0]?.value || 0);

  const substanceAnswers = getAllAnswersForQuestion(
    assessments,
    QUESTION_IDS.substances,
    null,
    (answer) => {
      const value = String(answer.option ?? answer.value ?? "").toLowerCase();
      return value && value !== "none";
    }
  );
  const substanceCodes = extractAnswerValues(substanceAnswers);

  const releasePast30Answers = getLatestAnswersForQuestion(
    assessments,
    QUESTION_IDS.recentReleasePast30
  );
  const releaseSinceLastAnswers = getLatestAnswersForQuestion(
    assessments,
    QUESTION_IDS.recentReleaseSinceLast
  );
  const recentRelease = releasePast30Answers.some(answerIsYes);
  const releaseSinceLast = releaseSinceLastAnswers.some(answerIsYes);

  const naloxoneAnswers = getLatestAnswersForQuestion(
    assessments,
    QUESTION_IDS.naloxoneServices
  );
  const naloxoneCodes = extractAnswerValues(naloxoneAnswers);

  const housingAnswers = getLatestAnswersForQuestion(
    assessments,
    QUESTION_IDS.housing
  );
  const housingCodes = extractAnswerValues(housingAnswers);

  const recentODScore = scoreRecentOverdose(recentOverdoseCount);
  const lifetimeODScore = scoreLifetimeOverdose(lifetimeOverdoseCount);
  const substanceScore = scoreSubstanceUse(substanceCodes);
  const releaseScore = scoreRecentRelease(recentRelease, releaseSinceLast);
  const naloxoneScore = scoreNaloxone(
    naloxoneCodes,
    substanceScore > 0
  );
  const housingScore = scoreHousing(housingCodes);

  const totalScore =
    recentODScore +
    lifetimeODScore +
    substanceScore +
    releaseScore +
    naloxoneScore +
    housingScore;

  let riskLevel = "low";
  if (totalScore >= 75) riskLevel = "critical";
  else if (totalScore >= 50) riskLevel = "high";
  else if (totalScore >= 25) riskLevel = "moderate";

  const factors = [];
  if (recentODScore > 0) {
    factors.push({
      factor: "Recent overdose",
      points: recentODScore,
      max_points: 30,
      description: `Overdosed ${recentOverdoseCount} time(s) since last assessment`,
    });
  }
  if (lifetimeODScore > 0) {
    factors.push({
      factor: "Lifetime overdose history",
      points: lifetimeODScore,
      max_points: 20,
      description: `${lifetimeOverdoseCount} lifetime overdose(s)`,
    });
  }
  if (substanceScore > 0) {
    factors.push({
      factor: "High-risk substance use",
      points: substanceScore,
      max_points: 20,
      description: `High-risk opioids used in last 30 days`,
    });
  }
  if (releaseScore > 0) {
    factors.push({
      factor: "Recent incarceration/treatment release",
      points: releaseScore,
      max_points: 15,
      description: "Released within past 30 days",
    });
  }
  if (naloxoneScore > 0) {
    factors.push({
      factor: "No recent naloxone access",
      points: naloxoneScore,
      max_points: 10,
      description: "Using opioids without naloxone access in past 30 days",
    });
  }
  if (housingScore > 0) {
    factors.push({
      factor: "Housing instability",
      points: housingScore,
      max_points: 5,
      description: "Severe housing instability in past 30 days",
    });
  }

  const redFlags = identifyDangerousCombinations(substanceCodes);

  return {
    score: totalScore,
    level: riskLevel,
    factors,
    red_flags: redFlags,
    section_scores: {
      recent_overdose: recentODScore,
      lifetime_overdose: lifetimeODScore,
      high_risk_substance_use: substanceScore,
      recent_release: releaseScore,
      no_recent_naloxone: naloxoneScore,
      housing_instability: housingScore,
    },
    metadata: {
      recent_overdose_count: recentOverdoseCount,
      lifetime_overdose_count: lifetimeOverdoseCount,
      substances: substanceCodes,
    },
  };
}

function getLatestAnswerRows(rows, questionId, predicate, rowFilter) {
  const relevant = rows.filter(
    (row) =>
      row.question_id === questionId &&
      (!predicate || predicate(row)) &&
      (!rowFilter || rowFilter(row))
  );
  if (relevant.length === 0) {
    return [];
  }
  relevant.sort((a, b) => normalizeDate(b.submitted_at) - normalizeDate(a.submitted_at));
  return relevant.filter((row) => row.submitted_at === relevant[0].submitted_at);
}

function getAllAnswerRows(rows, questionId, predicate, rowFilter) {
  return rows.filter(
    (row) =>
      row.question_id === questionId &&
      (!predicate || predicate(row)) &&
      (!rowFilter || rowFilter(row))
  );
}
export function calculateOverdoseRiskFromAnswerRows(rows) {
  const recentOverdoseRows = getLatestAnswerRows(
    rows,
    QUESTION_IDS.recentOverdose,
    (row) => String(row.assessment_type || "").includes("followup")
  );
  const recentOverdoseCount = Number(recentOverdoseRows[0]?.value || 0);

  const lifetimeOverdoseRows = getLatestAnswerRows(rows, QUESTION_IDS.lifetimeOverdose);
  const lifetimeOverdoseCount = Number(lifetimeOverdoseRows[0]?.value || 0);

  const substanceRows = getAllAnswerRows(
    rows,
    QUESTION_IDS.substances,
    null,
    (row) => {
      const value = String(row.option ?? row.value ?? "").toLowerCase();
      return value && value !== "none";
    }
  );
  const substanceCodes = extractAnswerValues(substanceRows);

  const releasePast30Rows = getLatestAnswerRows(rows, QUESTION_IDS.recentReleasePast30);
  const releaseSinceRows = getLatestAnswerRows(rows, QUESTION_IDS.recentReleaseSinceLast);
  const recentRelease = releasePast30Rows.some(answerIsYes);
  const releaseSinceLast = releaseSinceRows.some(answerIsYes);

  const naloxoneRows = getLatestAnswerRows(rows, QUESTION_IDS.naloxoneServices);
  const naloxoneCodes = extractAnswerValues(naloxoneRows);

  const housingRows = getLatestAnswerRows(rows, QUESTION_IDS.housing);
  const housingCodes = extractAnswerValues(housingRows);

  const recentODScore = scoreRecentOverdose(recentOverdoseCount);
  const lifetimeODScore = scoreLifetimeOverdose(lifetimeOverdoseCount);
  const substanceScore = scoreSubstanceUse(substanceCodes);
  const releaseScore = scoreRecentRelease(recentRelease, releaseSinceLast);
  const naloxoneScore = scoreNaloxone(naloxoneCodes, substanceScore > 0);
  const housingScore = scoreHousing(housingCodes);

  const totalScore =
    recentODScore +
    lifetimeODScore +
    substanceScore +
    releaseScore +
    naloxoneScore +
    housingScore;

  let riskLevel = "low";
  if (totalScore >= 75) riskLevel = "critical";
  else if (totalScore >= 50) riskLevel = "high";
  else if (totalScore >= 25) riskLevel = "moderate";

  return {
    score: totalScore,
    level: riskLevel,
    calculated_at: new Date().toISOString(),
  };
}

function hashSnapshot(payload) {
  return crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function extractJson(text) {
  const trimmed = text.trim();
  const withoutFences = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "");

  const candidates = [];
  if (withoutFences.startsWith("{") && withoutFences.endsWith("}")) {
    candidates.push(withoutFences);
  }

  const start = withoutFences.indexOf("{");
  const end = withoutFences.lastIndexOf("}");
  if (start >= 0 && end > start) {
    candidates.push(withoutFences.slice(start, end + 1));
  }

  if (candidates.length === 0) {
    throw new Error("Claude response did not include JSON");
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      const cleaned = candidate.replace(/,\s*([}\]])/g, "$1");
      try {
        return JSON.parse(cleaned);
      } catch {
        try {
          return JSON.parse(jsonrepair(candidate));
        } catch {
          // continue
        }
      }
    }
  }

  throw new Error("Claude response contained invalid JSON");
}

export async function getPatientData(carenetId, patientId) {
  return withCarenetTransaction(carenetId, async (client) => {
    const result = await client.query(
      "SELECT ai.get_patient_data_for_assessment($1::uuid, $2::uuid) AS data",
      [patientId, carenetId]
    );
    const patientData = result.rows[0]?.data || null;
    if (!patientData) {
      return patientData;
    }

    const encountersResult = await client.query(
      `
      SELECT
        e.id,
        e.date,
        e.type,
        e.encounter_type_id,
        e.status,
        e.format,
        e.duration_in_min,
        e.contact_with_patient,
        e.subjective_note,
        e.objective_note,
        e.assessment_note,
        e.plan_note,
        e.created_at,
        e.completed_at
      FROM public.encounters e
      WHERE e.patient_id = $1::uuid
        AND e.carenet_id = $2::uuid
        AND e.status = 'completed'
      ORDER BY e.created_at DESC
      `,
      [patientId, carenetId]
    );
    patientData.recent_encounters = encountersResult.rows || [];

    const assessmentsResult = await client.query(
      `
      SELECT
        a.id,
        a.type,
        a.submitted_at,
        a.created_at
      FROM public.assessments a
      WHERE a.patient_id = $1::uuid
        AND a.carenet_id = $2::uuid
      ORDER BY a.created_at DESC
      `,
      [patientId, carenetId]
    );

    const assessmentIds = assessmentsResult.rows.map((row) => row.id);
    let answersByAssessment = new Map();
    if (assessmentIds.length > 0) {
      const answersResult = await client.query(
        `
        SELECT
          aa.assessment_id,
          aa.question_id,
          aa.value,
          aa.option
        FROM public.assessment_answers aa
        WHERE aa.carenet_id = $1::uuid
          AND aa.assessment_id = ANY($2::uuid[])
        `,
        [carenetId, assessmentIds]
      );

      answersByAssessment = new Map();
      for (const row of answersResult.rows) {
        if (!answersByAssessment.has(row.assessment_id)) {
          answersByAssessment.set(row.assessment_id, []);
        }
        answersByAssessment.get(row.assessment_id).push({
          question_id: row.question_id,
          value: row.value,
          option: row.option,
        });
      }
    }

    patientData.recent_assessments = assessmentsResult.rows.map((row) => ({
      ...row,
      answers: answersByAssessment.get(row.id) || [],
    }));

    const tasksResult = await client.query(
      `
      SELECT jsonb_build_object(
        'active', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', t.id,
              'type', t.type,
              'status', t.status,
              'due_date', t.due_date,
              'created_at', t.created_at,
              'is_overdue', (t.due_date::timestamptz) < NOW()
            )
          )
          FROM public.tasks t
          WHERE t.patient_id = $1::uuid
            AND t.carenet_id = $2::uuid
            AND t.status IN ('pending', 'in_progress')
        ),
        'completed', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', t.id,
              'type', t.type,
              'status', t.status,
              'due_date', t.due_date,
              'created_at', t.created_at,
              'completed_at', t.completed_at
            )
          )
          FROM public.tasks t
          WHERE t.patient_id = $1::uuid
            AND t.carenet_id = $2::uuid
            AND t.status = 'completed'
        ),
        'completed_count_total', (
          SELECT COUNT(*)
          FROM public.tasks t
          WHERE t.patient_id = $1::uuid
            AND t.carenet_id = $2::uuid
            AND t.status = 'completed'
        ),
        'overdue_count', (
          SELECT COUNT(*)
          FROM public.tasks t
          WHERE t.patient_id = $1::uuid
            AND t.carenet_id = $2::uuid
            AND t.status IN ('pending', 'in_progress')
            AND (t.due_date::timestamptz) < NOW()
        )
      ) AS tasks
      `,
      [patientId, carenetId]
    );
    patientData.tasks = tasksResult.rows[0]?.tasks || null;

    const questionIds = new Set();
    for (const assessment of patientData.recent_assessments) {
      if (!assessment?.answers) {
        continue;
      }
      for (const answer of assessment.answers) {
        if (answer?.question_id) {
          questionIds.add(answer.question_id);
        }
      }
    }

    if (questionIds.size === 0) {
      return patientData;
    }

    const ids = Array.from(questionIds);
    const questionResult = await client.query(
      `
      SELECT id, text
      FROM public.assessment_questions
      WHERE id = ANY($1::uuid[])
      `,
      [ids]
    );

    const questionMap = new Map(
      questionResult.rows.map((row) => [row.id, row.text])
    );

    let optionByQuestion = new Map();
    if (questionIds.size > 0) {
      const optionResult = await client.query(
        `
        SELECT id, question_id, value, text
        FROM public.assessment_question_options
        WHERE question_id = ANY($1::uuid[])
        `,
        [Array.from(questionIds)]
      );

      optionByQuestion = new Map();
      for (const row of optionResult.rows) {
        if (!row.question_id || !row.text) {
          continue;
        }
        if (!optionByQuestion.has(row.question_id)) {
          optionByQuestion.set(row.question_id, new Map());
        }
        const map = optionByQuestion.get(row.question_id);
        if (row.value) {
          map.set(row.value, row.text);
        }
        if (row.id) {
          map.set(row.id, row.text);
        }
      }
    }

    const enrichedAssessments = patientData.recent_assessments.map((assessment) => {
      if (!assessment?.answers) {
        return assessment;
      }
      const answers = assessment.answers.map((answer) => {
        const questionText = questionMap.get(answer.question_id) || null;
        const optionMap = optionByQuestion.get(answer.question_id);
        const decodedOption = optionMap?.get(answer.option) || null;
        const decodedValue = optionMap?.get(answer.value) || null;

        return {
          ...answer,
          question_text: questionText,
          option_text: answer.option_text || decodedOption,
          value_text: answer.value_text || decodedValue,
        };
      });
      return { ...assessment, answers };
    });

    return { ...patientData, recent_assessments: enrichedAssessments };
  });
}

export async function analyzePatient(patientData) {
  const userPrompt = buildUserPrompt(patientData);
  const response = await callClaude({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
  });

  const assessment = extractJson(response.text);
  return { assessment, response };
}

export async function storeAssessment({
  carenetId,
  patientId,
  triggerEvent,
  assessmentType,
  assessment,
  modelName,
  usage,
  processingTimeMs,
  dataSnapshot,
}) {
  const snapshotHash = hashSnapshot(dataSnapshot);
  const tokensUsed =
    (usage?.input_tokens || 0) + (usage?.output_tokens || 0) || null;

  return withCarenetTransaction(carenetId, async (client) => {
    const insertAssessment = await client.query(
      `
      INSERT INTO ai.patient_assessments (
        patient_id,
        carenet_id,
        assessment_type,
        trigger_event,
        patient_summary,
        clinical_narrative,
        key_insights,
        overdose_risk_score,
        overdose_risk_level,
        overdose_risk_factors,
        relapse_risk_score,
        relapse_risk_level,
        relapse_risk_factors,
        treatment_dropout_risk_score,
        treatment_dropout_risk_level,
        treatment_dropout_risk_factors,
        crisis_risk_score,
        crisis_risk_level,
        crisis_risk_factors,
        social_risk_factors,
        medical_risk_factors,
        recommended_interventions,
        red_flags,
        peer_specialist_actions,
        ai_model_name,
        ai_model_version,
        prompt_version,
        confidence_score,
        data_snapshot_hash,
        processing_time_ms,
        tokens_used,
        input_data_summary
      )
      VALUES (
        $1::uuid,
        $2::uuid,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10::jsonb,
        $11,
        $12,
        $13::jsonb,
        $14,
        $15,
        $16::jsonb,
        $17,
        $18,
        $19::jsonb,
        $20::jsonb,
        $21::jsonb,
        $22::jsonb,
        $23::jsonb,
        $24::jsonb,
        $25,
        $26,
        $27,
        $28,
        $29,
        $30,
        $31,
        $32::jsonb
      )
      RETURNING id
      `,
      [
        patientId,
        carenetId,
        assessmentType,
        triggerEvent,
        assessment.patient_summary,
        assessment.clinical_narrative || null,
        assessment.key_insights || [],
        assessment.overdose_risk?.score || null,
        assessment.overdose_risk?.level || null,
        JSON.stringify(assessment.overdose_risk?.factors || []),
        assessment.relapse_risk?.score || null,
        assessment.relapse_risk?.level || null,
        JSON.stringify(assessment.relapse_risk?.factors || []),
        assessment.treatment_dropout_risk?.score || null,
        assessment.treatment_dropout_risk?.level || null,
        JSON.stringify(assessment.treatment_dropout_risk?.factors || []),
        assessment.crisis_risk?.score || null,
        assessment.crisis_risk?.level || null,
        JSON.stringify(assessment.crisis_risk?.factors || []),
        JSON.stringify(assessment.social_risk_factors || []),
        JSON.stringify(assessment.medical_risk_factors || []),
        JSON.stringify(assessment.recommendations || []),
        JSON.stringify(assessment.red_flags || []),
        JSON.stringify(assessment.peer_specialist_actions || []),
        modelName || config.aiModelName,
        null,
        config.promptVersion,
        assessment.confidence_score || null,
        snapshotHash,
        processingTimeMs || null,
        tokensUsed,
        JSON.stringify({ input_size: dataSnapshot ? "full" : "none" }),
      ]
    );

    const assessmentId = insertAssessment.rows[0].id;
    const recommendations = Array.isArray(assessment.recommendations)
      ? assessment.recommendations
      : [];

    for (const rec of recommendations) {
      await client.query(
        `
        INSERT INTO ai.recommendations (
          assessment_id,
          patient_id,
          carenet_id,
          recommendation_type,
          recommendation_category,
          priority,
          title,
          description,
          rationale,
          evidence_base,
          suggested_provider_types,
          suggested_timeline,
          barriers
        )
        VALUES (
          $1::uuid,
          $2::uuid,
          $3::uuid,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11::text[],
          $12,
          $13::jsonb
        )
        `,
        [
          assessmentId,
          patientId,
          carenetId,
          rec.type || "follow_up",
          rec.category || null,
          rec.priority || 3,
          rec.title || "Recommendation",
          rec.description || "",
          rec.rationale || null,
          rec.evidence || null,
          rec.provider_types || null,
          rec.timeline || null,
          JSON.stringify(rec.barriers || []),
        ]
      );
    }

    return { assessmentId };
  });
}
