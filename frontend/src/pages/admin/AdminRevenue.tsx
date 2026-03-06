import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

// Realistic varied revenue per county (annualized $K)
// All 9 have municipal. ~5 have referral revenue. 2 have early insurance revenue.
const COUNTY_REVENUE = [
  { county: 'Catawba',   muni: 120, referral: 348, payer: 186 },
  { county: 'Rowan',     muni: 110, referral: 275, payer: 0 },
  { county: 'Burke',     muni: 100, referral: 180, payer: 0 },
  { county: 'Caldwell',  muni: 90,  referral: 82,  payer: 54 },
  { county: 'Cleveland', muni: 95,  referral: 125, payer: 0 },
  { county: 'Surry',     muni: 85,  referral: 0,   payer: 0 },
  { county: 'Alexander', muni: 80,  referral: 42,  payer: 0 },
  { county: 'Carteret',  muni: 78,  referral: 0,   payer: 0 },
  { county: 'Jackson',   muni: 75,  referral: 0,   payer: 0 },
];

const TOOLTIP_STYLE = {
  background: '#1a1a2e',
  border: '1px solid rgba(212,168,67,0.3)',
  borderRadius: 8,
  color: '#fff',
  fontSize: 12,
};

export default function AdminRevenue() {
  // Calculate totals
  const totals = COUNTY_REVENUE.reduce(
    (acc, c) => ({
      muni: acc.muni + c.muni,
      referral: acc.referral + c.referral,
      payer: acc.payer + c.payer,
    }),
    { muni: 0, referral: 0, payer: 0 }
  );
  const grandTotal = totals.muni + totals.referral + totals.payer;
  const countiesWithReferrals = COUNTY_REVENUE.filter(c => c.referral > 0).length;
  const countiesWithPayer = COUNTY_REVENUE.filter(c => c.payer > 0).length;

  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="w-4 h-4 text-[#D4A843]" />
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Revenue</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Revenue Overview</h1>
        <p className="text-slate-500 text-sm mt-0.5">Annualized revenue across 9 NC counties · 3 revenue streams</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-slate-500 mb-1">Total Annual Revenue</div>
            <div className="text-2xl font-black text-slate-900">${(grandTotal / 1000).toFixed(1)}M</div>
            <div className="text-[10px] text-green-600 font-medium mt-1">
              <TrendingUp className="w-3 h-3 inline mr-0.5" />
              +22% vs last quarter
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-slate-500 mb-1">Municipal SaaS</div>
            <div className="text-2xl font-black text-green-700">${totals.muni}K</div>
            <div className="text-[10px] text-slate-400 mt-1">9 of 9 counties</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-slate-500 mb-1">Treatment Referrals</div>
            <div className="text-2xl font-black text-blue-700">${totals.referral}K</div>
            <div className="text-[10px] text-slate-400 mt-1">{countiesWithReferrals} of 9 counties</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-slate-500 mb-1">Insurance / Payer</div>
            <div className="text-2xl font-black" style={{ color: '#D4A843' }}>${totals.payer}K</div>
            <div className="text-[10px] text-slate-400 mt-1">{countiesWithPayer} of 9 counties · pilot phase</div>
          </CardContent>
        </Card>
      </div>

      {/* Stacked bar chart — revenue by stream × county */}
      <Card className="mb-5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Revenue by County ($K Annualized)</CardTitle>
          <p className="text-xs text-slate-400">Sorted by total revenue · Municipal is baseline, referrals and insurance vary by county maturity</p>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={COUNTY_REVENUE}
                margin={{ top: 5, right: 20, bottom: 5, left: 5 }}
                barSize={32}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="county" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}K`} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number | undefined) => [`$${v ?? 0}K`, '']} />
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 10, color: '#64748b' }}>{v}</span>} />
                <Bar dataKey="muni" name="Municipal SaaS" stackId="a" fill="#22c55e" />
                <Bar dataKey="referral" name="Treatment Referrals" stackId="a" fill="#3b82f6" />
                <Bar dataKey="payer" name="Insurance/Payer" stackId="a" fill="#D4A843" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue detail table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">County Revenue Detail</CardTitle>
          <p className="text-xs text-slate-400">Annualized contract values by revenue stream</p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['County', 'Municipal SaaS', 'Treatment Referrals', 'Insurance/Payer', 'Total Revenue', 'Revenue Mix'].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-5 pb-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COUNTY_REVENUE.map((county, i) => {
                  const total = county.muni + county.referral + county.payer;
                  const muniPct = Math.round((county.muni / total) * 100);
                  const refPct = Math.round((county.referral / total) * 100);
                  const payPct = 100 - muniPct - refPct;
                  return (
                    <tr key={county.county} className={`border-b border-slate-50 hover:bg-slate-50/80 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                      <td className="px-5 py-3 font-semibold text-slate-800">{county.county}</td>
                      <td className="px-5 py-3 font-medium text-green-700">${county.muni}K</td>
                      <td className="px-5 py-3 font-medium text-blue-700">{county.referral > 0 ? `$${county.referral}K` : <span className="text-slate-300">—</span>}</td>
                      <td className="px-5 py-3 font-medium" style={{ color: county.payer > 0 ? '#D4A843' : '#cbd5e1' }}>{county.payer > 0 ? `$${county.payer}K` : '—'}</td>
                      <td className="px-5 py-3 font-bold text-slate-900">${total}K</td>
                      <td className="px-5 py-3">
                        <div className="flex h-2.5 rounded overflow-hidden w-28 gap-px">
                          <div style={{ width: `${muniPct}%`, background: '#22c55e' }} />
                          {refPct > 0 && <div style={{ width: `${refPct}%`, background: '#3b82f6' }} />}
                          {payPct > 0 && county.payer > 0 && <div style={{ width: `${payPct}%`, background: '#D4A843' }} />}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Totals */}
                <tr className="border-t-2 border-slate-200" style={{ background: 'rgba(212,168,67,0.05)' }}>
                  <td className="px-5 py-3 font-bold text-slate-900">Total (9 counties)</td>
                  <td className="px-5 py-3 font-bold text-green-700">${totals.muni}K</td>
                  <td className="px-5 py-3 font-bold text-blue-700">${totals.referral}K</td>
                  <td className="px-5 py-3 font-bold" style={{ color: '#D4A843' }}>${totals.payer}K</td>
                  <td className="px-5 py-3">
                    <span className="text-lg font-black" style={{ color: '#D4A843' }}>${(grandTotal / 1000).toFixed(1)}M</span>
                  </td>
                  <td className="px-5 py-3" />
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
