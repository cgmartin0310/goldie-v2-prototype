import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Shield, Zap, AlertTriangle, CheckCircle, Brain, Activity, ChevronRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import riskScores from '@/data/risk-scores.json';
import { buildMockDartAssessment, getRiskColor, getRiskBadgeStyle } from '@/lib/dart-scoring';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  riskScore: number;
  aiRiskScore: number;
  riskLevel: string;
}

interface DartPanelProps {
  patient: Patient;
  onGeneratePlan?: () => void;
}

function AnimatedScore({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 30);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.round(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{current}</span>;
}

export default function DartPanel({ patient, onGeneratePlan }: DartPanelProps) {
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const assessment = buildMockDartAssessment(patient.id, riskScores as Record<string, unknown>);

  const radarData = [
    { subject: 'Overdose', value: assessment.riskVector.overdoseRisk },
    { subject: 'Relapse', value: assessment.riskVector.relapseRisk },
    { subject: 'Tx Dropout', value: assessment.riskVector.treatmentDropout },
    { subject: 'Housing', value: assessment.riskVector.housingCrisis },
    { subject: 'Medical', value: assessment.riskVector.medicalComplication },
    { subject: 'Crisis', value: assessment.riskVector.crisisRisk },
  ];

  const handleRunAssessment = async () => {
    setRunning(true);
    await new Promise(r => setTimeout(r, 1800));
    setComplete(true);
    setRunning(false);
    await new Promise(r => setTimeout(r, 600));
    setShowAI(true);
  };

  const riskColor = getRiskColor(patient.riskLevel);

  // Show prompt to run assessment if no data for this patient
  const hasAssessmentData = assessment.rubric.factors.length > 0;

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#D4A843]" />
            DART™ Risk Assessment
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Dual-track: Clinical Rubric + AI Pattern Analysis</p>
        </div>
        {!complete && !running && (
          <Button onClick={handleRunAssessment} className="gap-2">
            <Brain className="w-4 h-4" />
            Run Full Assessment
          </Button>
        )}
        {running && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-4 h-4 border-2 border-[#D4A843]/30 border-t-[#D4A843] rounded-full animate-spin" />
            Analyzing patient data...
          </div>
        )}
        {complete && (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Assessment Complete
          </div>
        )}
      </div>

      {/* Red flags */}
      {hasAssessmentData && assessment.rubric.redFlags.length > 0 && (
        <div className="mb-5 space-y-2">
          {assessment.rubric.redFlags.map((flag, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
              flag.severity === 'critical' ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'
            }`}>
              <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${flag.severity === 'critical' ? 'text-red-500' : 'text-orange-500'}`} />
              <div>
                <div className="text-sm font-semibold text-slate-800">{flag.flag}</div>
                <div className="text-xs text-slate-600 mt-0.5">Action: {flag.action} · Deadline: <span className="font-medium text-red-600">{flag.deadline}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* Rubric Score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Rubric Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-3">
              <div className="text-5xl font-bold" style={{ color: riskColor }}>
                {complete ? <AnimatedScore target={patient.riskScore} /> : patient.riskScore}
              </div>
              <div className="text-slate-400 text-sm mb-1">/100</div>
              <div className={`ml-auto px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${getRiskBadgeStyle(patient.riskLevel)}`}>
                {patient.riskLevel}
              </div>
            </div>

            {hasAssessmentData && (
              <div className="space-y-2">
                {assessment.rubric.factors.map((factor, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-600 truncate">{factor.factor}</div>
                    </div>
                    <div className={`text-xs font-bold w-10 text-right flex-shrink-0 ${
                      factor.points < 0 ? 'text-green-600' : factor.severity === 'critical' ? 'text-red-600' : 'text-orange-500'
                    }`}>
                      {factor.points > 0 ? '+' : ''}{factor.points}
                    </div>
                  </div>
                ))}

                <div className="pt-2 mt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Total Score</span>
                    <span className="text-sm font-bold" style={{ color: riskColor }}>{patient.riskScore}/100</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Score */}
        <Card className={`transition-opacity duration-500 ${showAI || hasAssessmentData ? 'opacity-100' : 'opacity-50'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              AI Analysis
              <span className="text-[9px] bg-[#D4A843]/10 text-[#D4A843] px-1.5 py-0.5 rounded-full font-semibold ml-1">
                Claude-powered
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-3">
              <div className="text-5xl font-bold text-slate-800">
                {showAI || hasAssessmentData ? <AnimatedScore target={patient.aiRiskScore} /> : '—'}
              </div>
              <div className="text-slate-400 text-sm mb-1">/100</div>
              {(showAI || hasAssessmentData) && (
                <div className="ml-auto text-right">
                  <div className="text-xs text-slate-400">Confidence</div>
                  <div className="text-sm font-bold text-slate-700">{Math.round((assessment.ai.confidence || 0.91) * 100)}%</div>
                </div>
              )}
            </div>

            {(showAI || hasAssessmentData) && (
              <>
                {assessment.ai.patternMatch && (
                  <div className="p-2.5 bg-slate-50 rounded-lg mb-3 text-xs text-slate-600 italic leading-relaxed">
                    "{assessment.ai.patternMatch}"
                  </div>
                )}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Key AI Signals</div>
                  {assessment.ai.insights.slice(0, 3).map((insight, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <span className="text-[#D4A843] mt-0.5 flex-shrink-0">•</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!showAI && !hasAssessmentData && (
              <p className="text-xs text-slate-400 text-center py-4">Run assessment to see AI analysis</p>
            )}
          </CardContent>
        </Card>

        {/* Risk Vector Radar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Risk Vector
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasAssessmentData ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Radar
                      dataKey="value"
                      stroke="#D4A843"
                      fill="#D4A843"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-1">
                  {radarData.map((d) => (
                    <div key={d.subject} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-20 flex-shrink-0">{d.subject}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${d.value}%`, background: d.value >= 75 ? '#ef4444' : d.value >= 50 ? '#f97316' : '#D4A843' }}
                        />
                      </div>
                      <span className="text-xs font-semibold w-8 text-right" style={{ color: d.value >= 75 ? '#ef4444' : d.value >= 50 ? '#f97316' : '#D4A843' }}>
                        {d.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-40 text-xs text-slate-400">
                Run assessment to see risk vector
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* DART Rubric breakdown — investor deck Slide 7 */}
      <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-[#D4A843]" />
          <span className="text-sm font-bold text-slate-800">DART™ Rubric — 100-Point Scoring Breakdown</span>
          <span className="text-[10px] bg-[#D4A843]/10 text-[#D4A843] px-2 py-0.5 rounded-full font-semibold ml-auto">Investor Deck · Slide 7</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { category: 'Recent Overdose (30d)', max: 30, color: '#ef4444' },
            { category: 'Lifetime OD History', max: 20, color: '#f97316' },
            { category: 'High-Risk Substance Use', max: 20, color: '#f59e0b' },
            { category: 'Recent Incarceration/Tx Release', max: 15, color: '#8b5cf6' },
            { category: 'Naloxone Access', max: 10, color: '#3b82f6' },
            { category: 'Housing Stability', max: 5, color: '#22c55e' },
          ].map(item => (
            <div key={item.category} className="bg-white rounded-lg p-2.5 border border-slate-100">
              <div className="text-xs text-slate-600 leading-tight mb-1">{item.category}</div>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                  <div className="h-full rounded-full" style={{ width: '100%', background: item.color }} />
                </div>
                <span className="text-xs font-bold flex-shrink-0" style={{ color: item.color }}>{item.max} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Response SLA table */}
      <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Response Time SLAs by Risk Level</span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-4 py-2 text-left text-slate-400 font-medium">Risk Level</th>
              <th className="px-4 py-2 text-left text-slate-400 font-medium">Score Range</th>
              <th className="px-4 py-2 text-left text-slate-400 font-medium">Response Time</th>
              <th className="px-4 py-2 text-left text-slate-400 font-medium">Encounter Freq.</th>
            </tr>
          </thead>
          <tbody>
            {[
              { level: 'Critical', range: '75–100', response: '4 hours', freq: 'Weekly', color: '#ef4444', bg: '#fef2f2' },
              { level: 'High',     range: '50–74',  response: '12 hours', freq: 'Monthly', color: '#f97316', bg: '#fff7ed' },
              { level: 'Moderate', range: '25–49',  response: '24 hours', freq: 'Bi-monthly', color: '#f59e0b', bg: '#fffbeb' },
              { level: 'Low',      range: '0–24',   response: '72 hours', freq: 'As needed', color: '#22c55e', bg: '#f0fdf4' },
            ].map(row => {
              const isCurrent = (
                (row.level === 'Critical' && patient.riskLevel === 'critical') ||
                (row.level === 'High' && patient.riskLevel === 'high') ||
                (row.level === 'Moderate' && patient.riskLevel === 'moderate') ||
                (row.level === 'Low' && patient.riskLevel === 'low')
              );
              return (
                <tr key={row.level} className={`border-b border-slate-50 ${isCurrent ? 'font-semibold' : ''}`}
                  style={isCurrent ? { background: row.bg } : {}}>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold" style={{ background: row.color }}>
                      {row.level}
                    </span>
                    {isCurrent && <span className="ml-2 text-[10px] text-slate-500">← this patient</span>}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{row.range}</td>
                  <td className="px-4 py-2.5 font-medium" style={{ color: isCurrent ? row.color : '#64748b' }}>{row.response}</td>
                  <td className="px-4 py-2.5 text-slate-600">{row.freq}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Generate Plan CTA */}
      {(complete || hasAssessmentData) && (
        <div className="mt-5 p-4 bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-xl flex items-center justify-between animate-fade-in">
          <div>
            <div className="font-semibold text-sm text-slate-900">Ready to generate service plan</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Based on DART risk vector + ASAM criteria + available provider capacity in Catawba County
            </div>
          </div>
          <Button onClick={onGeneratePlan} className="gap-2">
            Generate Service Plan
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
