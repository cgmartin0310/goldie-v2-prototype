import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `
You are a clinical decision support assistant specializing in substance use disorder care.
Analyze patient data and provide evidence-based risk assessments and treatment recommendations
to peer support specialists.

Guidelines:
1. Base recommendations on ASAM criteria and SAMHSA guidelines
2. Consider social determinants of health
3. Identify immediate safety concerns
4. Recommend evidence-based interventions
5. Be specific and actionable

Output format: return ONLY valid JSON with this structure.
No trailing commas. No markdown fences. No commentary.
{
  "patient_summary": "2-3 sentence clinical summary",
  "clinical_narrative": "optional longer narrative",
  "key_insights": ["insight1", "insight2"],
  "overdose_risk": {
    "score": 1-10,
    "level": "low|moderate|high|critical",
    "factors": [ { "factor": "text", "severity": "low|moderate|high|critical" } ]
  },
  "relapse_risk": { "score": 1-10, "level": "low|moderate|high|critical", "factors": [] },
  "treatment_dropout_risk": { "score": 1-10, "level": "low|moderate|high|critical", "factors": [] },
  "crisis_risk": { "score": 1-10, "level": "low|moderate|high|critical", "factors": [] },
  "social_risk_factors": [],
  "medical_risk_factors": [],
  "recommendations": [
    {
      "type": "medication|therapy|referral|social_support|follow_up|crisis_intervention",
      "category": "immediate|urgent|short_term|long_term",
      "priority": 1,
      "title": "Brief title",
      "description": "Detailed recommendation",
      "rationale": "Clinical reasoning",
      "timeline": "when to implement"
    }
  ],
  "red_flags": [
    {
      "severity": "critical|high|moderate",
      "flag": "description",
      "action_required": "what to do",
      "deadline": "when"
    }
  ],
  "peer_specialist_actions": [
    {
      "action": "specific action",
      "priority": 1,
      "reason": "why this matters"
    }
  ],
  "confidence_score": 0.0-1.0
}
`.trim();

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Goldie DART Assessment API' });
});

app.post('/api/assess', async (req, res) => {
  const { patientData } = req.body;

  if (!patientData) {
    return res.status(400).json({ error: 'patientData required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Return mock response for demo without API key
    return res.json({
      assessment: {
        patient_summary: `${patientData.name || 'Patient'} presents with high-risk substance use disorder pattern. Multiple prior overdoses with poly-substance involvement (fentanyl + benzodiazepines). Recent incarceration release significantly elevates current risk window.`,
        clinical_narrative: "This patient demonstrates a classic high-risk post-incarceration presentation with accelerating overdose frequency. The combination of reduced opioid tolerance post-incarceration, poly-substance use pattern, and lack of MAT bridge prescription represents an immediately dangerous clinical situation.",
        key_insights: [
          "OD frequency is accelerating — critical pattern indicating disease progression",
          "Post-incarceration period (days 1-30) represents highest risk window — no MAT bridge was provided",
          "Fentanyl + benzodiazepine combination significantly complicates naloxone reversal",
          "Prior MAT engagement (2x) demonstrates motivation but reveals structural barriers",
          "Hepatitis C progression without treatment adds medical urgency"
        ],
        overdose_risk: { score: 9, level: "critical", factors: [
          { factor: "4th overdose — accelerating frequency", severity: "critical" },
          { factor: "Poly-substance fentanyl + benzo", severity: "critical" },
          { factor: "Post-incarceration tolerance gap", severity: "critical" }
        ]},
        relapse_risk: { score: 8, level: "high", factors: [] },
        treatment_dropout_risk: { score: 7, level: "high", factors: [] },
        crisis_risk: { score: 6, level: "moderate", factors: [] },
        social_risk_factors: ["Emergency shelter — unstable", "Recent incarceration", "No social support network identified"],
        medical_risk_factors: ["Hepatitis C with elevated liver enzymes", "Poly-substance overdose complications"],
        recommendations: [
          {
            type: "medication",
            category: "immediate",
            priority: 1,
            title: "ED-Based Buprenorphine Induction",
            description: "Initiate buprenorphine (Suboxone) in the ED. Start with 4mg, titrate. Bridge prescription for 7 days.",
            rationale: "ED-MOUD initiation shown to increase 30-day treatment engagement 3.5x vs. referral only. Critical window — patient is in withdrawal now.",
            timeline: "Today — before ED discharge"
          },
          {
            type: "crisis_intervention",
            category: "immediate",
            priority: 1,
            title: "Naloxone Kit + Bystander Training",
            description: "Issue 2x 4mg intranasal Narcan. Train patient and shelter staff. Due to benzo co-use, higher doses may be needed.",
            rationale: "Benzo co-use delays naloxone reversal. Multiple doses + trained bystanders is critical safety net.",
            timeline: "Today — before ED discharge"
          }
        ],
        red_flags: [
          {
            severity: "critical",
            flag: "4th OD with accelerating frequency — 73% probability of repeat within 60 days without intervention",
            action_required: "ED-based MAT induction + peer specialist warm handoff",
            deadline: "Today"
          }
        ],
        peer_specialist_actions: [
          {
            action: "Bedside visit in ED — prior relationship with Tanya Williams is key asset",
            priority: 1,
            reason: "Motivational window peaks in acute care setting. Warm handoff to MAT program significantly increases engagement."
          }
        ],
        confidence_score: 0.91
      },
      model: "mock-demo",
      note: "Set ANTHROPIC_API_KEY env var for live Claude assessment"
    });
  }

  try {
    const client = new Anthropic({ apiKey });
    const startTime = Date.now();

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analyze this patient and provide a comprehensive risk assessment.\n\nPATIENT DATA:\n${JSON.stringify(patientData, null, 2)}\n\nProvide your analysis in the JSON format specified.`
        }
      ]
    });

    const processingTime = Date.now() - startTime;
    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON from response
    let assessment;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      assessment = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawText);
    } catch {
      assessment = { raw: rawText, parse_error: true };
    }

    res.json({
      assessment,
      model: message.model,
      usage: message.usage,
      processingTimeMs: processingTime,
    });

  } catch (error: unknown) {
    console.error('Assessment error:', error);
    res.status(500).json({ error: 'Assessment failed', details: error instanceof Error ? error.message : String(error) });
  }
});

app.post('/api/generate-plan', async (req, res) => {
  const { patientData, riskAssessment } = req.body;

  // For demo, return structured mock service plan
  res.json({
    plan: {
      generated: new Date().toISOString(),
      patient: patientData?.name || 'Patient',
      interventions: [
        { priority: 'immediate', title: 'Naloxone Kit', status: 'recommended' },
        { priority: 'immediate', title: 'MAT Induction', status: 'recommended' },
        { priority: 'urgent', title: 'Peer Specialist', status: 'recommended' },
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log(`Goldie DART API running on port ${PORT}`);
});

export default app;
