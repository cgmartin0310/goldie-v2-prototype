import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, Clock, AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ACTIVE_CASES = [
  {
    id: 'case-001',
    patientId: 'patient-001',
    patientName: 'Marcus Johnson',
    riskLevel: 'critical',
    opened: '2026-03-05',
    status: 'active',
    specialist: 'Tanya Williams',
    interventions: [
      { title: 'Naloxone Kit Distribution', status: 'completed', time: '3:15 PM today' },
      { title: 'MAT Initiation — Buprenorphine', status: 'in_progress', time: 'In progress' },
      { title: 'Peer Specialist Assignment', status: 'scheduled', time: 'Tomorrow 9 AM' },
      { title: 'Housing Navigation', status: 'pending', time: 'Pending' },
    ],
    lastOutcome: 'Naloxone kit issued in ED. MAT induction underway.',
  },
  {
    id: 'case-002',
    patientId: 'patient-009',
    patientName: 'Carlos Mendez',
    riskLevel: 'critical',
    opened: '2026-03-05',
    status: 'active',
    specialist: 'James Parker',
    interventions: [
      { title: 'ED Crisis Assessment', status: 'completed', time: '11:45 AM today' },
      { title: 'MAT Referral', status: 'in_progress', time: 'Pending pickup' },
      { title: 'Psychiatric Consult', status: 'scheduled', time: 'Tomorrow 2 PM' },
    ],
    lastOutcome: 'ED assessment complete. Psychiatric consult scheduled.',
  },
  {
    id: 'case-003',
    patientId: 'patient-002',
    patientName: 'Sarah Mitchell',
    riskLevel: 'high',
    opened: '2026-03-04',
    status: 'active',
    specialist: 'Maria Rodriguez',
    interventions: [
      { title: 'Outreach Contact', status: 'completed', time: '3/4 2 PM' },
      { title: 'Housing Assessment', status: 'in_progress', time: 'In progress' },
      { title: 'MAT Referral', status: 'pending', time: 'Waiting on patient' },
    ],
    lastOutcome: 'Patient engaged by outreach. Exploring MAT options.',
  },
  {
    id: 'case-004',
    patientId: 'patient-004',
    patientName: 'Amanda Chen',
    riskLevel: 'low',
    opened: '2025-11-15',
    status: 'closed',
    specialist: 'Tanya Williams',
    interventions: [
      { title: 'MAT Enrollment', status: 'completed', time: '11/15' },
      { title: 'Counseling Referral', status: 'completed', time: '11/20' },
      { title: '90-day Check-in', status: 'completed', time: '2/15' },
    ],
    lastOutcome: 'Patient stable on MAT. No ODs in 6 months. Case closed — monitoring phase.',
    closedDate: '2026-02-28',
  },
];

const STATUS_CONFIG = {
  completed: { color: '#22c55e', bg: 'bg-green-50', icon: CheckCircle, text: 'Completed' },
  in_progress: { color: '#3b82f6', bg: 'bg-blue-50', icon: Activity, text: 'In Progress' },
  scheduled: { color: '#D4A843', bg: 'bg-amber-50', icon: Clock, text: 'Scheduled' },
  pending: { color: '#94a3b8', bg: 'bg-slate-50', icon: Clock, text: 'Pending' },
};

export default function Cases() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('active');
  const filtered = ACTIVE_CASES.filter(c => filter === 'all' || c.status === filter);

  return (
    <div className="p-6 max-w-screen-xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Active Cases</h1>
          <p className="text-sm text-slate-500 mt-0.5">Closed-loop care management — every touch point feeds back to CARESTREAM™</p>
        </div>
        <div className="flex gap-2">
          {['active', 'all', 'closed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as 'all' | 'active' | 'closed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filter === f ? 'bg-[#1a1a2e] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f === 'active' ? `Active (${ACTIVE_CASES.filter(c => c.status === 'active').length})` : f === 'closed' ? `Closed (${ACTIVE_CASES.filter(c => c.status === 'closed').length})` : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Closed loop explanation */}
      <div className="mb-5 p-4 rounded-xl border border-[#D4A843]/20 bg-[#D4A843]/5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-[#D4A843] flex items-center justify-center">
            <span className="text-[#1a1a2e] text-xs font-bold">↺</span>
          </div>
          <span className="text-sm font-semibold text-slate-800">Closed Loop Architecture</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Every completed intervention is written back as a HEAP event. Care plan outcomes → CARESTREAM timeline → updated risk score → refined next intervention. 
          Each touch point makes the next prediction more accurate.
        </p>
      </div>

      <div className="space-y-4">
        {filtered.map(caseItem => (
          <Card key={caseItem.id} className={`${caseItem.status === 'closed' ? 'opacity-75' : ''}`}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                {/* Patient info */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                    caseItem.riskLevel === 'critical' ? 'bg-red-500' :
                    caseItem.riskLevel === 'high' ? 'bg-orange-400' :
                    caseItem.riskLevel === 'moderate' ? 'bg-amber-400' : 'bg-green-500'
                  }`}>
                    {caseItem.patientName.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900">{caseItem.patientName}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      caseItem.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                      caseItem.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>{caseItem.riskLevel}</span>
                    {caseItem.status === 'closed' && (
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-medium">Closed</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mb-3">
                    Assigned to {caseItem.specialist} · Opened {caseItem.opened}
                    {caseItem.closedDate && ` · Closed ${caseItem.closedDate}`}
                  </div>

                  {/* Intervention pipeline */}
                  <div className="flex items-center gap-1 flex-wrap mb-3">
                    {caseItem.interventions.map((intervention, i) => {
                      const sc = STATUS_CONFIG[intervention.status as keyof typeof STATUS_CONFIG];
                      const Icon = sc.icon;
                      return (
                        <React.Fragment key={i}>
                          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${sc.bg}`}
                            style={{ color: sc.color }}>
                            <Icon className="w-3 h-3" />
                            <span>{intervention.title}</span>
                          </div>
                          {i < caseItem.interventions.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div className="text-xs text-slate-500 italic">
                    Latest: {caseItem.lastOutcome}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 text-xs font-medium text-[#D4A843] border border-[#D4A843]/30 rounded-lg hover:bg-[#D4A843]/5 transition-colors"
                    onClick={() => navigate(`/patients/${caseItem.patientId}`)}
                  >
                    View Profile
                  </button>
                </div>
              </div>

              {/* Closed loop visual */}
              {caseItem.status === 'active' && caseItem.interventions.some(i => i.status === 'completed') && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>Outcomes flowing to CARESTREAM™ →</span>
                    <span className="text-green-600 font-medium">
                      {caseItem.interventions.filter(i => i.status === 'completed').length} events logged
                    </span>
                    <span>· Risk score updating</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
