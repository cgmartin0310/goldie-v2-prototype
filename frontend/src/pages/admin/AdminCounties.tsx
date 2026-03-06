import React from 'react';
import { MapPin, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface County {
  name: string;
  status: 'active';
  patients: number;
  risk: { critical: number; high: number; mod: number; low: number };
  muniRev: number;       // $K annualized
  treatmentRev: number;  // $K annualized
  payerRev: number;      // $K annualized
  engagement: number;
}

// Realistic varied revenue — matches AdminRevenue.tsx data
const COUNTIES: County[] = [
  { name: 'Catawba',    status: 'active', patients: 421, risk: { critical: 12, high: 23, mod: 29, low: 36 }, muniRev: 120, treatmentRev: 348, payerRev: 186, engagement: 79 },
  { name: 'Rowan',      status: 'active', patients: 367, risk: { critical: 10, high: 20, mod: 30, low: 40 }, muniRev: 110, treatmentRev: 275, payerRev: 0,   engagement: 76 },
  { name: 'Burke',      status: 'active', patients: 389, risk: { critical: 11, high: 22, mod: 31, low: 36 }, muniRev: 100, treatmentRev: 180, payerRev: 0,   engagement: 68 },
  { name: 'Caldwell',   status: 'active', patients: 312, risk: { critical: 8, high: 17, mod: 34, low: 41 },  muniRev: 90,  treatmentRev: 82,  payerRev: 54,  engagement: 74 },
  { name: 'Cleveland',  status: 'active', patients: 334, risk: { critical: 9, high: 18, mod: 32, low: 41 },  muniRev: 95,  treatmentRev: 125, payerRev: 0,   engagement: 72 },
  { name: 'Surry',      status: 'active', patients: 301, risk: { critical: 8, high: 16, mod: 33, low: 43 },  muniRev: 85,  treatmentRev: 0,   payerRev: 0,   engagement: 69 },
  { name: 'Alexander',  status: 'active', patients: 247, risk: { critical: 9, high: 19, mod: 33, low: 39 },  muniRev: 80,  treatmentRev: 42,  payerRev: 0,   engagement: 71 },
  { name: 'Carteret',   status: 'active', patients: 278, risk: { critical: 7, high: 15, mod: 35, low: 43 },  muniRev: 78,  treatmentRev: 0,   payerRev: 0,   engagement: 66 },
  { name: 'Jackson',    status: 'active', patients: 198, risk: { critical: 6, high: 14, mod: 36, low: 44 },  muniRev: 75,  treatmentRev: 0,   payerRev: 0,   engagement: 63 },
];

const PIPELINE = [
  { name: 'Johnston',     status: 'RFP Submitted' },
  { name: 'Wake',         status: 'Prospect' },
  { name: 'Durham',       status: 'Prospect' },
  { name: 'Mecklenburg',  status: 'Prospect' },
];

function RiskBar({ risk }: { risk: { critical: number; high: number; mod: number; low: number } }) {
  return (
    <div className="flex h-3 rounded overflow-hidden w-24 gap-px">
      <div style={{ width: `${risk.critical}%`, background: '#ef4444' }} title={`Critical ${risk.critical}%`} />
      <div style={{ width: `${risk.high}%`, background: '#f97316' }} title={`High ${risk.high}%`} />
      <div style={{ width: `${risk.mod}%`, background: '#eab308' }} title={`Moderate ${risk.mod}%`} />
      <div style={{ width: `${risk.low}%`, background: '#22c55e' }} title={`Low ${risk.low}%`} />
    </div>
  );
}

function fmtRev(n: number) {
  if (n === 0) return '—';
  return `$${n}K`;
}

export default function AdminCounties() {
  const totals = COUNTIES.reduce((acc, c) => ({
    patients: acc.patients + c.patients,
    muniRev: acc.muniRev + c.muniRev,
    treatmentRev: acc.treatmentRev + c.treatmentRev,
    payerRev: acc.payerRev + c.payerRev,
  }), { patients: 0, muniRev: 0, treatmentRev: 0, payerRev: 0 });

  const grandTotal = totals.muniRev + totals.treatmentRev + totals.payerRev;

  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-[#D4A843]" />
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">County Network</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Counties</h1>
        <p className="text-slate-500 text-sm mt-0.5">9 active counties · 4 in pipeline</p>
      </div>

      {/* Active counties table */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Active Counties (9)
            </CardTitle>
            <div className="flex items-center gap-4 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500" />Critical</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-orange-500" />High</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-yellow-500" />Moderate</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500" />Low</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['County', 'Status', 'Patients', 'Risk Distribution', 'Municipal', 'Referrals', 'Insurance', 'Total Rev', 'Engagement'].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 pb-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COUNTIES.map((county, i) => {
                  const total = county.muniRev + county.treatmentRev + county.payerRev;
                  return (
                    <tr key={county.name} className={`border-b border-slate-50 hover:bg-slate-50/80 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-800">{county.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-xs text-green-700 font-medium">Active</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-800">{county.patients.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <RiskBar risk={county.risk} />
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          {county.risk.critical}% critical
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-green-700">${county.muniRev}K</td>
                      <td className="px-4 py-3 font-medium text-blue-700">{fmtRev(county.treatmentRev)}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: county.payerRev > 0 ? '#D4A843' : '#cbd5e1' }}>{fmtRev(county.payerRev)}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900">${total}K</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-16">
                            <div className="h-1.5 rounded-full" style={{ width: `${county.engagement}%`, background: '#D4A843' }} />
                          </div>
                          <span className="text-xs font-medium text-slate-700">{county.engagement}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Totals row */}
                <tr className="border-t-2 border-slate-200" style={{ background: 'rgba(212,168,67,0.05)' }}>
                  <td className="px-4 py-3 font-bold text-slate-900">Total</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 font-bold text-slate-900">{totals.patients.toLocaleString()}</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 font-bold text-green-700">${totals.muniRev}K</td>
                  <td className="px-4 py-3 font-bold text-blue-700">${totals.treatmentRev}K</td>
                  <td className="px-4 py-3 font-bold" style={{ color: '#D4A843' }}>${totals.payerRev}K</td>
                  <td className="px-4 py-3">
                    <span className="font-black text-lg" style={{ color: '#D4A843' }}>${(grandTotal / 1000).toFixed(1)}M</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-700">71% avg</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            Pipeline (4)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {PIPELINE.map(c => (
              <div key={c.name} className="rounded-xl p-4 border-2 border-dashed border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-500">{c.name} County</span>
                </div>
                <div className="flex items-center gap-2">
                  {c.status === 'RFP Submitted' ? (
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className={`text-xs font-medium ${c.status === 'RFP Submitted' ? 'text-blue-500' : 'text-slate-400'}`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
