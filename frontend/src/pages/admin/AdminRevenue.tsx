import React from 'react';
import { DollarSign, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell,
} from 'recharts';

const COUNTY_REVENUE = [
  { county: 'Alexander', muni: 0.1, treatment: 1.0, payer: 14.9 },
  { county: 'Burke',     muni: 0.1, treatment: 1.0, payer: 14.9 },
  { county: 'Caldwell',  muni: 0.1, treatment: 1.0, payer: 14.9 },
  { county: 'Carteret',  muni: 0.1, treatment: 1.0, payer: 14.9 },
  { county: 'Catawba',   muni: 0.1, treatment: 1.0, payer: 14.9 },
  { county: 'Cleveland', muni: 0.1, treatment: 1.0, payer: 14.9 },
  { county: 'Jackson',   muni: 0.1, treatment: 1.0, payer: 14.9 },
  { county: 'Rowan',     muni: 0.1, treatment: 1.0, payer: 14.9 },
  { county: 'Surry',     muni: 0.1, treatment: 1.0, payer: 14.9 },
];

const WATERFALL = [
  { name: 'Start', value: 0, cumulative: 0, type: 'start' },
  { name: 'Alexander', value: 16.0, cumulative: 16.0, type: 'county' },
  { name: 'Burke',     value: 16.0, cumulative: 32.0, type: 'county' },
  { name: 'Caldwell',  value: 16.0, cumulative: 48.0, type: 'county' },
  { name: 'Carteret',  value: 16.0, cumulative: 64.0, type: 'county' },
  { name: 'Catawba',   value: 16.0, cumulative: 80.0, type: 'county' },
  { name: 'Cleveland', value: 16.0, cumulative: 96.0, type: 'county' },
  { name: 'Jackson',   value: 16.0, cumulative: 112.0, type: 'county' },
  { name: 'Rowan',     value: 16.0, cumulative: 128.0, type: 'county' },
  { name: 'Surry',     value: 16.0, cumulative: 144.0, type: 'county' },
  { name: 'OUD Total', value: 0, cumulative: 144.0, type: 'subtotal' },
  { name: '+ All Conditions', value: 48.0, cumulative: 192.0, type: 'expansion' },
  { name: 'Total $192M', value: 0, cumulative: 192.0, type: 'total' },
];

const TOOLTIP_STYLE = {
  background: '#1a1a2e',
  border: '1px solid rgba(212,168,67,0.3)',
  borderRadius: 8,
  color: '#fff',
  fontSize: 12,
};

const STREAMS = [
  {
    title: 'Municipalities',
    value: '$100K/county',
    total: '$900K',
    color: '#22c55e',
    comparable: 'Like Unite Us — but upstream at the point of crisis',
    desc: 'Annual contract per county for DART-powered crisis detection and public health intelligence.',
    icon: '🏛️',
  },
  {
    title: 'Treatment Referrals',
    value: '$1M/county',
    total: '$9M',
    color: '#3b82f6',
    comparable: 'Like Zocdoc — but at the moment of highest motivation',
    desc: 'Per-referral fees and success bonuses from treatment providers receiving qualified, motivated patients.',
    icon: '🏥',
  },
  {
    title: 'Insurance / Payer',
    value: '$14.9M/county',
    total: '$134.1M',
    color: '#D4A843',
    comparable: 'Like Health Catalyst — but controlling the entire care network',
    desc: 'Value-based contracts tied to documented cost avoidance: $47K → $12.8K per member per year.',
    icon: '🛡️',
  },
];

const UNIT_ECONOMICS = [
  { label: 'Customer Acquisition Cost', value: '~$15K', sub: 'Sales + onboarding per county', color: '#3b82f6' },
  { label: 'Lifetime Value / County', value: '$16M', sub: 'All conditions · annual', color: '#D4A843' },
  { label: 'LTV : CAC Ratio', value: '1,067:1', sub: 'Exceptional unit economics', color: '#22c55e' },
  { label: 'Payback Period', value: '< 1 month', sub: 'Muni contract alone covers CAC', color: '#a78bfa' },
];

export default function AdminRevenue() {
  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="w-4 h-4 text-[#D4A843]" />
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Revenue Intelligence</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Revenue Deep Dive</h1>
        <p className="text-slate-500 text-sm mt-0.5">Three streams · 9 counties · $192M pent-up opportunity</p>
      </div>

      {/* Stacked bar — revenue by stream × county */}
      <Card className="mb-5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Revenue by Stream × County ($M)</CardTitle>
          <p className="text-xs text-slate-400">Each county contributes $16M/yr across 3 revenue streams (OUD-only baseline)</p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COUNTY_REVENUE} margin={{ top: 5, right: 20, bottom: 5, left: 5 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="county" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number | undefined) => [`$${v ?? 0}M`, '']} />
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 10, color: '#64748b' }}>{v}</span>} />
                <Bar dataKey="payer" name="Insurance/Payer" stackId="a" fill="#D4A843" radius={[0, 0, 0, 0]} />
                <Bar dataKey="treatment" name="Treatment Referrals" stackId="a" fill="#3b82f6" />
                <Bar dataKey="muni" name="Municipalities" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Waterfall */}
      <Card className="mb-5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Revenue Waterfall — County-by-County Cumulative Build</CardTitle>
          <p className="text-xs text-slate-400">Each signed county adds $16M · OUD baseline → $192M with all conditions</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex items-end gap-1 h-48 min-w-[700px]">
              {WATERFALL.map((item, i) => {
                const maxVal = 192;
                const heightPct = (item.cumulative / maxVal) * 100;
                const color =
                  item.type === 'start' ? '#e2e8f0' :
                  item.type === 'total' ? '#D4A843' :
                  item.type === 'subtotal' ? '#94a3b8' :
                  item.type === 'expansion' ? '#a78bfa' :
                  '#3b82f6';
                return (
                  <div key={i} className="flex flex-col items-center flex-1 min-w-0">
                    <div className="text-[9px] font-bold mb-1" style={{ color }}>
                      {item.cumulative > 0 ? `$${item.cumulative}M` : ''}
                    </div>
                    <div
                      className="w-full rounded-t transition-all"
                      style={{
                        height: `${Math.max(heightPct, 2)}%`,
                        background: color,
                        minHeight: 4,
                      }}
                    />
                    <div className="text-[8px] text-slate-400 mt-1 text-center leading-tight px-0.5">{item.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unit economics */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {UNIT_ECONOMICS.map(ue => (
          <Card key={ue.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4" style={{ color: ue.color }} />
                <span className="text-xs text-slate-500 font-medium">{ue.label}</span>
              </div>
              <div className="text-2xl font-black mb-0.5" style={{ color: ue.color }}>{ue.value}</div>
              <div className="text-xs text-slate-400">{ue.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue stream cards */}
      <div className="grid grid-cols-3 gap-4">
        {STREAMS.map(s => (
          <Card key={s.title} className="overflow-hidden">
            <div className="h-1.5" style={{ background: s.color }} />
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-2xl">{s.icon}</span>
                  <div className="mt-2 text-base font-bold text-slate-800">{s.title}</div>
                  <div className="text-xs text-slate-400">{s.value} per county</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black" style={{ color: s.color }}>{s.total}</div>
                  <div className="text-[10px] text-slate-400">9 counties</div>
                </div>
              </div>
              <div className="p-3 rounded-lg mb-3" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <TrendingUp className="w-3 h-3" style={{ color: s.color }} />
                  <span className="text-xs font-semibold" style={{ color: s.color }}>Comparable</span>
                </div>
                <div className="text-xs text-slate-600 italic">{s.comparable}</div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
