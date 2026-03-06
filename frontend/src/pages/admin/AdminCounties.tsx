import React from 'react';
import { MapPin, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface County {
  name: string;
  status: 'active';
  patients: number;
  risk: { critical: number; high: number; mod: number; low: number };
  muniRev: number;
  treatmentRev: number;
  payerRev: number;
  engagement: number;
}

const COUNTIES: County[] = [
  { name: 'Alexander',  status: 'active', patients: 247, risk: { critical: 9, high: 19, mod: 33, low: 39 }, muniRev: 100, treatmentRev: 1000, payerRev: 14900, engagement: 71 },
  { name: 'Burke',      status: 'active', patients: 389, risk: { critical: 11, high: 22, mod: 31, low: 36 }, muniRev: 100, treatmentRev: 1000, payerRev: 14900, engagement: 68 },
  { name: 'Caldwell',   status: 'active', patients: 312, risk: { critical: 8, high: 17, mod: 34, low: 41 }, muniRev: 100, treatmentRev: 1000, payerRev: 14900, engagement: 74 },
  { name: 'Carteret',   status: 'active', patients: 278, risk: { critical: 7, high: 15, mod: 35, low: 43 }, muniRev: 100, treatmentRev: 1000, payerRev: 14900, engagement: 66 },
  { name: 'Catawba',    status: 'active', patients: 421, risk: { critical: 12, high: 23, mod: 29, low: 36 }, muniRev: 100, treatmentRev: 1000, payerRev: 14900, engagement: 79 },
  { name: 'Cleveland',  status: 'active', patients: 334, risk: { critical: 9, high: 18, mod: 32, low: 41 }, muniRev: 100, treatmentRev: 1000, payerRev: 14900, engagement: 72 },
  { name: 'Jackson',    status: 'active', patients: 198, risk: { critical: 6, high: 14, mod: 36, low: 44 }, muniRev: 100, treatmentRev: 1000, payerRev: 14900, engagement: 63 },
  { name: 'Rowan',      status: 'active', patients: 367, risk: { critical: 10, high: 20, mod: 30, low: 40 }, muniRev: 100, treatmentRev: 1000, payerRev: 14900, engagement: 76 },
  { name: 'Surry',      status: 'active', patients: 301, risk: { critical: 8, high: 16, mod: 33, low: 43 }, muniRev: 100, treatmentRev: 1000, payerRev: 14900, engagement: 69 },
];

const PIPELINE = [
  { name: 'Johnston',     status: 'RFP Submitted' },
  { name: 'Wake',         status: 'In Pipeline' },
  { name: 'Durham',       status: 'In Pipeline' },
  { name: 'Mecklenburg',  status: 'In Pipeline' },
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

function fmt(n: number) {
  return `$${(n / 1000).toFixed(1)}M`;
}

export default function AdminCounties() {
  const totals = COUNTIES.reduce((acc, c) => ({
    patients: acc.patients + c.patients,
    muniRev: acc.muniRev + c.muniRev,
    treatmentRev: acc.treatmentRev + c.treatmentRev,
    payerRev: acc.payerRev + c.payerRev,
  }), { patients: 0, muniRev: 0, treatmentRev: 0, payerRev: 0 });

  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-[#D4A843]" />
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">County Network</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">County Pipeline & Health</h1>
        <p className="text-slate-500 text-sm mt-0.5">9 signed counties · 4 in pipeline · NC Network</p>
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
                  {['County', 'Status', 'Patients Detected', 'Risk Distribution', 'Muni Rev', 'Treatment Rev', 'Payer Rev', 'Total Rev', 'Engagement'].map(h => (
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
                        <div className="text-[10px] text-slate-400">NC County</div>
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
                      <td className="px-4 py-3 font-medium text-green-700">$100K</td>
                      <td className="px-4 py-3 font-medium text-blue-700">$1.0M</td>
                      <td className="px-4 py-3 font-medium text-[#D4A843]">$14.9M</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900">{fmt(total)}</span>
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
                  <td className="px-4 py-3 font-bold text-slate-900">Total (9 counties)</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 font-bold text-slate-900">{totals.patients.toLocaleString()}</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 font-bold text-green-700">$900K</td>
                  <td className="px-4 py-3 font-bold text-blue-700">$9.0M</td>
                  <td className="px-4 py-3 font-bold text-[#D4A843]">$134.1M</td>
                  <td className="px-4 py-3">
                    <span className="font-black text-lg" style={{ color: '#D4A843' }}>$143.1M</span>
                    <div className="text-[9px] text-slate-400">OUD stream only</div>
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
            Pipeline Counties (4)
          </CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">Target counties for expansion — estimated $64M additional revenue at signing</p>
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
                <div className="mt-3 text-xs text-slate-400">
                  Est. revenue: <span className="font-semibold text-slate-600">$16M</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
