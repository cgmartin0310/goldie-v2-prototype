import React, { useState } from 'react';
import {
  Search, Filter, CheckCircle, MapPin, Clock, User,
  ChevronDown, X, Phone,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ALL_REFERRALS = [
  {
    id: 'R-2847', name: 'James Mitchell', age: 34, county: 'Catawba', risk: 'critical', riskScore: 91,
    referredBy: 'Catawba Co. Health Dept.', date: '2026-03-04', status: 'pending',
    summary: 'Recent ED visit for OD. Expressed willingness to engage treatment. High social determinant burden (housing unstable).',
    riskFactors: ['Recent overdose', 'Unstable housing', 'Unemployed', 'Prior treatment dropout'],
    recommended: 'Intensive outpatient + MAT (buprenorphine)',
    contact: 'Sarah T. — (828) 555-0142',
  },
  {
    id: 'R-2846', name: 'Tanya Lawson', age: 29, county: 'Burke', risk: 'high', riskScore: 78,
    referredBy: 'Burke Co. Health Dept.', date: '2026-03-04', status: 'accepted',
    summary: 'Multiple prior ED encounters. Currently enrolled in crisis stabilization. Ready for step-down to outpatient.',
    riskFactors: ['Multiple prior ED visits', 'Co-occurring depression', 'Family system instability'],
    recommended: 'Outpatient therapy + peer support',
    contact: 'Marcus R. — (828) 555-0201',
  },
  {
    id: 'R-2845', name: 'Marcus Parker', age: 42, county: 'Rowan', risk: 'high', riskScore: 74,
    referredBy: 'Rowan Co. Health Dept.', date: '2026-03-03', status: 'scheduled',
    summary: 'Long-term OUD with prior treatment attempts. Motivated post-incarceration release. Medicaid eligible.',
    riskFactors: ['Long-term OUD', 'Recent incarceration', 'Prior treatment attempts x3'],
    recommended: 'MAT + case management + peer recovery coaching',
    contact: 'Linda K. — (704) 555-0388',
  },
  {
    id: 'R-2844', name: 'Diana Harris', age: 51, county: 'Caldwell', risk: 'moderate', riskScore: 61,
    referredBy: 'Caldwell Co. Health Dept.', date: '2026-03-03', status: 'active',
    summary: 'Chronic pain patient with emerging OUD. Primary care referral. High motivation, good family support.',
    riskFactors: ['Chronic pain', 'Emerging OUD', 'Prescription opioid misuse'],
    recommended: 'Outpatient + pain management coordination',
    contact: 'James W. — (828) 555-0097',
  },
  {
    id: 'R-2843', name: 'Samuel Johnson', age: 23, county: 'Catawba', risk: 'critical', riskScore: 88,
    referredBy: 'Catawba Co. Health Dept.', date: '2026-03-02', status: 'pending',
    summary: 'Young adult with rapid escalation. Two overdoses in 60 days. Unstable living situation. Peer outreach made contact.',
    riskFactors: ['Two ODs in 60 days', 'Young adult (high risk)', 'Unhoused', 'Polysubstance use'],
    recommended: 'Residential treatment + MAT',
    contact: 'Sarah T. — (828) 555-0142',
  },
  {
    id: 'R-2842', name: 'Rhonda Williams', age: 38, county: 'Surry', risk: 'high', riskScore: 69,
    referredBy: 'Surry Co. Health Dept.', date: '2026-03-02', status: 'completed',
    summary: 'Successfully completed 6-month program. Transitioned to sustained recovery support. Outcome: Excellent.',
    riskFactors: ['Prior OUD', 'Single parent', 'Employment barrier'],
    recommended: 'Alumni support group + ongoing peer coaching',
    contact: 'Derek M. — (336) 555-0415',
  },
  {
    id: 'R-2841', name: 'Anthony Greene', age: 45, county: 'Cleveland', risk: 'high', riskScore: 71,
    referredBy: 'Cleveland Co. Health Dept.', date: '2026-03-01', status: 'accepted',
    summary: 'Referred from county jail diversion program. Medicaid-eligible. Ready to engage.',
    riskFactors: ['Criminal justice involvement', 'OUD', 'Unemployment'],
    recommended: 'Intensive outpatient + legal advocacy support',
    contact: 'Angela B. — (980) 555-0554',
  },
  {
    id: 'R-2840', name: 'Patricia Moore', age: 56, county: 'Alexander', risk: 'moderate', riskScore: 55,
    referredBy: 'Alexander Co. Health Dept.', date: '2026-02-28', status: 'scheduled',
    summary: 'Older adult, poly-pharmacy risk. Primary care coordination needed alongside SUD treatment.',
    riskFactors: ['Poly-pharmacy risk', 'Isolated social support', 'Transportation barrier'],
    recommended: 'Telehealth outpatient + care coordination',
    contact: 'Tom H. — (828) 555-0611',
  },
];

const RISK_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-amber-100 text-amber-700',
  moderate: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  accepted: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-purple-100 text-purple-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-slate-100 text-slate-500',
};

export default function ProviderReferrals() {
  const [referrals, setReferrals] = useState(ALL_REFERRALS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selected, setSelected] = useState<typeof ALL_REFERRALS[0] | null>(null);

  const handleAccept = (id: string) => {
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: 'accepted' } : null);
  };

  const filtered = referrals.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.county.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchRisk = filterRisk === 'all' || r.risk === filterRisk;
    return matchSearch && matchStatus && matchRisk;
  });

  const pendingCount = referrals.filter(r => r.status === 'pending').length;

  return (
    <div className="p-6 max-w-screen-xl flex gap-5 h-full">
      {/* Left: list */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Incoming Referrals</h1>
            <p className="text-slate-500 text-sm">
              {pendingCount > 0 && <span className="text-orange-600 font-semibold">{pendingCount} pending · </span>}
              {filtered.length} referrals shown
            </p>
          </div>
          {pendingCount > 0 && (
            <Badge className="bg-orange-100 text-orange-700 text-xs px-3 py-1.5 animate-pulse">
              {pendingCount} Awaiting Action
            </Badge>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or county…"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:border-[#D4A843] focus:outline-none focus:ring-1 focus:ring-[#D4A843] text-slate-800"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:border-[#D4A843] focus:outline-none appearance-none text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="scheduled">Scheduled</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterRisk}
              onChange={e => setFilterRisk(e.target.value)}
              className="pl-3 pr-8 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:border-[#D4A843] focus:outline-none appearance-none text-slate-700"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <Card>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Patient</th>
                  <th className="px-3 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">County</th>
                  <th className="px-3 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Risk</th>
                  <th className="px-3 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Referred By</th>
                  <th className="px-3 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Date</th>
                  <th className="px-3 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ref => (
                  <tr
                    key={ref.id}
                    className={`border-b border-slate-50 hover:bg-amber-50/40 cursor-pointer transition-colors ${selected?.id === ref.id ? 'bg-amber-50' : ''}`}
                    onClick={() => setSelected(ref)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{ref.name}</div>
                      <div className="text-xs text-slate-400">{ref.age}y · {ref.id}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        {ref.county} Co.
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${RISK_COLORS[ref.risk]}`}>{ref.risk}</span>
                        <span className="text-xs text-slate-400">{ref.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-500">{ref.referredBy}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {ref.date}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[ref.status]}`}>{ref.status}</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      {ref.status === 'pending' ? (
                        <Button
                          className="h-7 text-xs px-3"
                          onClick={e => { e.stopPropagation(); handleAccept(ref.id); }}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Accept
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Right: detail panel */}
      {selected && (
        <div className="w-80 flex-shrink-0">
          <Card className="sticky top-0">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{selected.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${RISK_COLORS[selected.risk]}`}>{selected.risk}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {/* DART score */}
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1.5 uppercase tracking-wider">DART Risk Score</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className="h-full rounded-full bg-red-500" style={{ width: `${selected.riskScore}%` }} />
                  </div>
                  <span className="text-sm font-bold text-red-600">{selected.riskScore}</span>
                </div>
              </div>

              {/* Patient summary */}
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1.5 uppercase tracking-wider">Patient Summary</div>
                <p className="text-xs text-slate-600 leading-relaxed">{selected.summary}</p>
              </div>

              {/* Risk factors */}
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1.5 uppercase tracking-wider">Risk Factors</div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.riskFactors.map(f => (
                    <span key={f} className="text-[10px] px-2 py-0.5 bg-red-50 text-red-600 rounded-full border border-red-100">{f}</span>
                  ))}
                </div>
              </div>

              {/* Recommended */}
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1.5 uppercase tracking-wider">Recommended Treatment</div>
                <div className="p-2.5 rounded-lg text-xs text-slate-700" style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)' }}>
                  {selected.recommended}
                </div>
              </div>

              {/* Referring contact */}
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1.5 uppercase tracking-wider">Referring Contact</div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {selected.contact}
                </div>
              </div>

              {/* Action */}
              {selected.status === 'pending' && (
                <Button
                  className="w-full"
                  onClick={() => handleAccept(selected.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Referral
                </Button>
              )}
              {selected.status === 'accepted' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-blue-700 font-medium">Referral accepted. Schedule first appointment.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
