// DART Risk Scoring — ported from DART-SCORING-REFERENCE.js
// Adapted for frontend use with mock data

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface RiskFactor {
  factor: string;
  points: number;
  maxPoints: number;
  description?: string;
  severity: RiskLevel | 'mitigating';
}

export interface RiskVector {
  overdoseRisk: number;
  relapseRisk: number;
  treatmentDropout: number;
  housingCrisis: number;
  medicalComplication: number;
  crisisRisk: number;
}

export interface DartRubricScore {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
  redFlags: Array<{ severity: string; flag: string; action: string; deadline: string }>;
  sectionScores: {
    recentOverdose: number;
    lifetimeOverdose: number;
    highRiskSubstanceUse: number;
    recentRelease: number;
    noRecentNaloxone: number;
    housingInstability: number;
  };
}

export interface DartAiScore {
  score: number;
  level: RiskLevel;
  confidence: number;
  insights: string[];
  patternMatch?: string;
}

export interface DartAssessment {
  rubric: DartRubricScore;
  ai: DartAiScore;
  riskVector: RiskVector;
  combinedScore: number;
  combinedLevel: RiskLevel;
  generatedAt: string;
}

export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'moderate';
  return 'low';
}

export function getRiskColor(level: RiskLevel | string): string {
  const colors: Record<string, string> = {
    critical: '#7f1d1d',
    high: '#ef4444',
    moderate: '#f59e0b',
    low: '#22c55e',
  };
  return colors[level] || '#94a3b8';
}

export function getRiskBgColor(level: RiskLevel | string): string {
  const colors: Record<string, string> = {
    critical: '#fef2f2',
    high: '#fef2f2',
    moderate: '#fffbeb',
    low: '#f0fdf4',
  };
  return colors[level] || '#f8fafc';
}

export function getRiskBadgeStyle(level: RiskLevel | string): string {
  const styles: Record<string, string> = {
    critical: 'bg-red-900 text-white',
    high: 'bg-red-500 text-white',
    moderate: 'bg-amber-500 text-white',
    low: 'bg-green-500 text-white',
  };
  return styles[level] || 'bg-slate-500 text-white';
}

// Mock implementation for demo — uses pre-computed data from risk-scores.json
// In production this would run the actual rubric calculation
export function buildMockDartAssessment(patientId: string, riskScoreData: Record<string, unknown>): DartAssessment {
  const data = riskScoreData[patientId] as {
    rubricScore: number;
    rubricLevel: RiskLevel;
    aiScore: number;
    aiLevel: RiskLevel;
    confidence: number;
    combinedScore: number;
    riskVector: RiskVector;
    rubricFactors: RiskFactor[];
    aiInsights: string[];
    redFlags: Array<{ severity: string; flag: string; action: string; deadline: string }>;
  };
  
  if (!data) {
    return {
      rubric: { score: 0, level: 'low', factors: [], redFlags: [], sectionScores: { recentOverdose: 0, lifetimeOverdose: 0, highRiskSubstanceUse: 0, recentRelease: 0, noRecentNaloxone: 0, housingInstability: 0 } },
      ai: { score: 0, level: 'low', confidence: 0, insights: [] },
      riskVector: { overdoseRisk: 0, relapseRisk: 0, treatmentDropout: 0, housingCrisis: 0, medicalComplication: 0, crisisRisk: 0 },
      combinedScore: 0,
      combinedLevel: 'low',
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    rubric: {
      score: data.rubricScore,
      level: data.rubricLevel,
      factors: data.rubricFactors,
      redFlags: data.redFlags,
      sectionScores: {
        recentOverdose: 30,
        lifetimeOverdose: 20,
        highRiskSubstanceUse: 20,
        recentRelease: 15,
        noRecentNaloxone: 10,
        housingInstability: 5,
      },
    },
    ai: {
      score: data.aiScore,
      level: data.aiLevel,
      confidence: data.confidence,
      insights: data.aiInsights,
      patternMatch: 'Patients with similar profiles (post-incarceration + fentanyl/benzo + 4+ OD history) had 73% probability of repeat OD within 60 days',
    },
    riskVector: data.riskVector,
    combinedScore: data.combinedScore,
    combinedLevel: getRiskLevelFromScore(data.combinedScore),
    generatedAt: new Date().toISOString(),
  };
}
