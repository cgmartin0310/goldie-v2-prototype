import React from 'react';
import { TrendingUp, DollarSign, Map, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

const PROJECTION_DATA = [
  { counties: '9 (Current)', savings: 9.6, cost: 2.3, net: 7.3, color: '#D4A843' },
  { counties: '25 Counties', savings: 24.0, cost: 5.8, net: 18.2, color: '#3b82f6' },
  { counties: '50 Counties', savings: 48.0, cost: 11.5, net: 36.5, color: '#22c55e' },
  { counties: '100 Counties', savings: 96.0, cost: 21.0, net: 75.0, color: '#a855f7' },
];

const CONTRACT_TERMS = [
  { term: 'Contract Type', value: 'Value-Based Care Agreement' },
  { term: 'Savings Sharing', value: '15% of documented cost avoidance to Goldie' },
  { term: 'Minimum Guarantee', value: '$100K/county/year baseline SaaS' },
  { term: 'Measurement Period', value: 'Quarterly (rolling 12-month baseline)' },
  { term: 'Current Counties', value: '9 (Alexander, Burke, Caldwell, Carteret, Catawba, Cleveland, Jackson, Rowan, Surry)' },
  { term: 'Contract Term', value: '3-year initial · auto-renew' },
  { term: 'Performance Targets', value: '≥25% reduction in per-member cost within 18 months' },
];

export default function PayerROI() {
  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">ROI Report & Projections</h1>
        <p className="text-slate-500 text-sm mt-0.5">Blue Cross NC — Goldie value-based contract analysis · Q1 2026</p>
      </div>

      {/* Current ROI summary */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Current Counties', value: '9', icon: Map, color: '#D4A843', bg: '#fefce8', sub: 'NC network' },
          { label: 'Projected Annual Savings', value: '$9.6M', icon: TrendingUp, color: '#22c55e', bg: '#f0fdf4', sub: 'Full-year run rate' },
          { label: 'Goldie Contract Cost', value: '$2.3M', icon: DollarSign, color: '#3b82f6', bg: '#eff6ff', sub: 'Annual fee' },
          { label: 'Net Annual Savings', value: '$7.3M', icon: Award, color: '#a855f7', bg: '#faf5ff', sub: '317% ROI' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="p-5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: card.bg }}>
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <div className="text-2xl font-black mb-0.5" style={{ color: card.color }}>{card.value}</div>
                <div className="text-xs font-semibold text-slate-700">{card.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{card.sub}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ROI highlight */}
      <div className="mb-5 rounded-2xl p-6"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', border: '1px solid rgba(212,168,67,0.3)' }}>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-xs text-white/40 uppercase tracking-widest mb-2">Investment</div>
            <div className="text-3xl font-bold text-white">$2.3M</div>
            <div className="text-xs text-white/40 mt-1">Goldie annual contract</div>
          </div>
          <div className="border-x border-white/10 flex flex-col items-center justify-center">
            <div className="text-xs text-[#D4A843] uppercase tracking-widest mb-2 font-semibold">ROI</div>
            <div className="text-5xl font-black text-[#D4A843]">317%</div>
            <div className="text-xs text-white/40 mt-1">Return on investment</div>
          </div>
          <div>
            <div className="text-xs text-white/40 uppercase tracking-widest mb-2">Total Return</div>
            <div className="text-3xl font-bold text-white">$9.6M</div>
            <div className="text-xs text-white/40 mt-1">Annual cost savings</div>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <span className="text-white/50 text-sm">For every </span>
          <span className="text-[#D4A843] font-bold text-lg">$1</span>
          <span className="text-white/50 text-sm"> invested in Goldie coordination, </span>
          <span className="text-[#D4A843] font-bold text-lg">$4.20</span>
          <span className="text-white/50 text-sm"> in costs are avoided</span>
        </div>
      </div>

      {/* Projection chart */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Savings Projection by County Scale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PROJECTION_DATA} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="counties" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    formatter={(v: number | undefined, name: string | undefined) => [`$${v ?? 0}M`, name === 'savings' ? 'Total Savings' : name === 'cost' ? 'Goldie Cost' : 'Net Savings']}
                  />
                  <Bar dataKey="savings" name="savings" fill="#D4A843" radius={[4, 4, 0, 0]} opacity={0.8} />
                  <Bar dataKey="cost" name="cost" fill="#94a3b8" radius={[4, 4, 0, 0]} opacity={0.6} />
                  <Bar dataKey="net" name="net" fill="#22c55e" radius={[4, 4, 0, 0]} opacity={0.9} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {[{ color: '#D4A843', label: 'Total Savings' }, { color: '#94a3b8', label: 'Goldie Cost' }, { color: '#22c55e', label: 'Net Savings' }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Milestone projections */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Scale Milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PROJECTION_DATA.map((p, i) => (
              <div key={p.counties}
                className={`rounded-xl p-4 border ${i === 0 ? 'border-[#D4A843]/30' : 'border-slate-100'}`}
                style={i === 0 ? { background: 'rgba(212,168,67,0.06)' } : { background: '#fafafa' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                    <span className="text-sm font-semibold text-slate-800">{p.counties}</span>
                    {i === 0 && <span className="text-[10px] text-[#D4A843] font-medium bg-[#D4A843]/10 px-1.5 py-0.5 rounded-full">Current</span>}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black" style={{ color: p.color }}>${p.net}M net</div>
                    <div className="text-[10px] text-slate-400">{Math.round((p.net / p.cost) * 100)}% ROI</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Savings: <span className="font-semibold text-slate-700">${p.savings}M</span></span>
                  <span className="text-slate-200">·</span>
                  <span>Cost: <span className="font-semibold text-slate-700">${p.cost}M</span></span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Contract terms */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Value-Based Contract Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {CONTRACT_TERMS.map(term => (
              <div key={term.term} className="flex gap-3 text-sm">
                <div className="w-44 flex-shrink-0 text-slate-400 font-medium text-xs pt-0.5">{term.term}</div>
                <div className="text-slate-700 text-xs leading-relaxed">{term.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)' }}>
              <span className="font-semibold text-[#D4A843]">Goldie Value Proposition: </span>
              <span className="text-slate-600">
                $14.9M/county total addressable value. At 9 counties, Goldie delivers $9.6M in measurable cost avoidance
                annually against a $2.3M contract — a 317% return. As the platform expands to 50+ counties,
                the payer network savings scale to $48M+ annually.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
