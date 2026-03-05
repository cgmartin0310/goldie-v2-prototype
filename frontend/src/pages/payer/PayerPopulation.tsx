import React from 'react';
import { MapPin, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const COUNTIES = [
  { name: 'Catawba',   members: 680, riskHigh: 312, costBefore: 47200, costAfter: 12800, savings: 2.4 },
  { name: 'Burke',     members: 520, riskHigh: 241, costBefore: 45800, costAfter: 13200, savings: 1.7 },
  { name: 'Caldwell',  members: 470, riskHigh: 198, costBefore: 44600, costAfter: 12600, savings: 1.5 },
  { name: 'Rowan',     members: 440, riskHigh: 161, costBefore: 43900, costAfter: 13800, savings: 1.3 },
  { name: 'Alexander', members: 360, riskHigh: 174, costBefore: 46100, costAfter: 13000, savings: 1.2 },
  { name: 'Cleveland', members: 380, riskHigh: 143, costBefore: 44800, costAfter: 12900, savings: 1.2 },
  { name: 'Surry',     members: 320, riskHigh: 127, costBefore: 43200, costAfter: 12100, savings: 1.0 },
  { name: 'Jackson',   members: 280, riskHigh: 104, costBefore: 42900, costAfter: 12400, savings: 0.8 },
  { name: 'Carteret',  members: 260, riskHigh:  87, costBefore: 41700, costAfter: 11900, savings: 0.7 },
];

const CONDITION_PIE = [
  { name: 'OUD (Primary)', value: 4200, color: '#D4A843' },
  { name: 'Co-occurring Depression', value: 2100, color: '#3b82f6' },
  { name: 'Chronic Pain / Polysubstance', value: 1400, color: '#a855f7' },
  { name: 'Alcohol Use Disorder', value: 980, color: '#f97316' },
  { name: 'Other Behavioral', value: 620, color: '#94a3b8' },
];

const PROJECTED_CONDITIONS = [
  { condition: 'OUD (current)', savings: 9.6, color: '#D4A843' },
  { condition: 'Congestive Heart Failure', savings: 14.2, color: '#ef4444' },
  { condition: 'Type 2 Diabetes', savings: 11.8, color: '#3b82f6' },
  { condition: 'COPD', savings: 8.4, color: '#22c55e' },
  { condition: 'Sickle Cell Disease', savings: 6.1, color: '#a855f7' },
];

export default function PayerPopulation() {
  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Population Analytics</h1>
        <p className="text-slate-500 text-sm mt-0.5">Blue Cross NC — member risk distribution and cost analysis across Goldie counties</p>
      </div>

      {/* County comparison table */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">County-by-County Cost Comparison</CardTitle>
            <span className="text-xs text-slate-400">9 NC counties · Q1 2026</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">County</th>
                  <th className="px-3 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider">Members</th>
                  <th className="px-3 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider">High-Risk</th>
                  <th className="px-3 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider">Cost Before</th>
                  <th className="px-3 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider">Cost With Goldie</th>
                  <th className="px-3 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider">Reduction</th>
                  <th className="px-3 py-3 text-right text-xs text-slate-400 font-semibold uppercase tracking-wider">Qtly Savings</th>
                </tr>
              </thead>
              <tbody>
                {COUNTIES.map(county => {
                  const reduction = Math.round((1 - county.costAfter / county.costBefore) * 100);
                  return (
                    <tr key={county.name} className="border-b border-slate-50 hover:bg-amber-50/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#D4A843]" />
                          <span className="font-medium text-slate-900">{county.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right text-slate-600">{county.members.toLocaleString()}</td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">{county.riskHigh}</span>
                      </td>
                      <td className="px-3 py-3 text-right text-slate-500 line-through text-xs">${county.costBefore.toLocaleString()}/yr</td>
                      <td className="px-3 py-3 text-right font-semibold text-green-700">${county.costAfter.toLocaleString()}/yr</td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <TrendingDown className="w-3 h-3 text-green-500" />
                          <span className="font-bold text-green-600">{reduction}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-[#D4A843]">${county.savings}M</td>
                    </tr>
                  );
                })}
                {/* Total row */}
                <tr className="bg-slate-50 border-t border-slate-200">
                  <td className="px-5 py-3 font-bold text-slate-900">Total (9 Counties)</td>
                  <td className="px-3 py-3 text-right font-bold text-slate-900">4,200</td>
                  <td className="px-3 py-3 text-right font-bold text-red-600">1,547</td>
                  <td className="px-3 py-3 text-right text-slate-400 text-xs">—</td>
                  <td className="px-3 py-3 text-right text-slate-400 text-xs">—</td>
                  <td className="px-3 py-3 text-right font-bold text-green-600">73% avg</td>
                  <td className="px-3 py-3 text-right font-black text-[#D4A843] text-base">$11.9M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Condition pie */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Member Condition Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CONDITION_PIE}
                    cx="40%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {CONDITION_PIE.map(entry => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    formatter={(v: number | undefined) => [`${(v ?? 0).toLocaleString()} members`, '']}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ fontSize: 10, paddingLeft: 16 }}
                    formatter={(value) => <span style={{ color: '#64748b' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Projected savings by condition */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Projected Annual Savings — Goldie Condition Expansion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PROJECTED_CONDITIONS} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${v}M`} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="condition" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    formatter={(v: number | undefined) => [`$${v ?? 0}M/yr`, 'Projected Savings']}
                  />
                  <Bar dataKey="savings" radius={[0, 4, 4, 0]}>
                    {PROJECTED_CONDITIONS.map(entry => (
                      <Cell key={entry.condition} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insight banner */}
      <div className="rounded-xl p-4 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(212,168,67,0.2)' }}>
        <div className="text-[#D4A843] font-semibold text-[11px] uppercase tracking-wider flex-shrink-0">Goldie Insight</div>
        <div className="text-white/60 text-xs flex-1">
          OUD is Goldie's initial focus — but the coordination infrastructure applies directly to CHF, diabetes, and COPD.
          Every additional condition added to the platform could generate{' '}
          <span className="text-[#D4A843] font-semibold">$8–14M in additional annual savings per payer</span>.
        </div>
      </div>
    </div>
  );
}
