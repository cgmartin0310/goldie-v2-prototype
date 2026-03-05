import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowRight, MapPin, Clock, Building2, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import patients from '@/data/patients.json';

const DEMO_COUNTY = 'Catawba';

const RISK_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  critical: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-400' },
  moderate: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-400' },
  low: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
};

const SLA: Record<string, string> = {
  critical: '4h response',
  high: '12h response',
  moderate: '24h response',
  low: '72h response',
};

export default function Patients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  // County-tenant: only show patients in the logged-in county
  const countyPatients = patients.filter(p => p.county === DEMO_COUNTY);

  const filtered = countyPatients
    .filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterRisk !== 'all' && p.riskLevel !== filterRisk) return false;
      return true;
    })
    .sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Patients</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
            <Building2 className="w-3.5 h-3.5 text-[#D4A843]" />
            <span className="font-medium text-slate-700">Catawba County</span>
            <span className="text-slate-300">·</span>
            <span>{countyPatients.length} patients</span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400 ml-1 px-2 py-0.5 bg-slate-100 rounded-full">
              <Lock className="w-2.5 h-2.5" />
              County-only view
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4A843] focus:border-[#D4A843]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {['all', 'critical', 'high', 'moderate', 'low'].map(risk => (
            <button
              key={risk}
              onClick={() => setFilterRisk(risk)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filterRisk === risk ? 'bg-[#1a1a2e] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {risk === 'all'
                ? `All (${countyPatients.length})`
                : `${risk.charAt(0).toUpperCase() + risk.slice(1)} (${countyPatients.filter(p => p.riskLevel === risk).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-3 gap-3">
        {filtered.map((patient) => {
          const rc = RISK_COLORS[patient.riskLevel] || RISK_COLORS.low;
          return (
            <Card
              key={patient.id}
              className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
              onClick={() => navigate(`/patients/${patient.id}`)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: patient.riskLevel === 'critical' ? '#ef4444' : patient.riskLevel === 'high' ? '#f97316' : patient.riskLevel === 'moderate' ? '#f59e0b' : '#22c55e' }}>
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">{patient.name}</div>
                      <div className="text-xs text-slate-400">{patient.age}y {patient.gender} · {patient.race}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${rc.bg} ${rc.text}`}>
                    {patient.riskLevel}
                  </span>
                </div>

                {/* Risk bar */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${patient.riskScore}%`, background: patient.riskLevel === 'critical' ? '#ef4444' : patient.riskLevel === 'high' ? '#f97316' : '#f59e0b' }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{patient.riskScore}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{patient.housing?.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span className="capitalize">{patient.lastEventType?.replace(/_/g, ' ')}</span>
                  </div>
                  {patient.diagnoses && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {patient.diagnoses.slice(0, 2).map(d => (
                        <span key={d} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px]">{d}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
                    <span className="text-xs text-slate-400">{patient.status?.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-slate-300">·</span>
                    <span className="text-[10px] text-slate-400">{SLA[patient.riskLevel]}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
