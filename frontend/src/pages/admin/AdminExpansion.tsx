import React from 'react';
import { TrendingUp, Globe, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';

const SCALE_DATA = [
  { counties: 9,   revenue: 192 },
  { counties: 25,  revenue: 400 },
  { counties: 50,  revenue: 800 },
  { counties: 100, revenue: 1600 },
];

const TAM_DATA = [
  { name: 'OUD Only\n(Current Focus)', value: 4.5, color: '#D4A843' },
  { name: 'All 7 Conditions\n(Platform Expansion)', value: 51, color: '#3b82f6' },
];

const CONDITIONS = [
  { name: 'OUD', icon: '💊', status: 'Live', color: '#D4A843' },
  { name: 'Cardiovascular', icon: '❤️', status: 'Next', color: '#ef4444' },
  { name: 'Diabetes', icon: '🩸', status: 'Roadmap', color: '#f97316' },
  { name: 'Cancer', icon: '🎗️', status: 'Roadmap', color: '#a78bfa' },
  { name: 'Respiratory', icon: '🫁', status: 'Roadmap', color: '#3b82f6' },
  { name: 'Mental Health', icon: '🧠', status: 'Roadmap', color: '#22c55e' },
  { name: 'Falls', icon: '🦺', status: 'Roadmap', color: '#64748b' },
];

const GEO_PHASES = [
  { phase: 'Phase 1', label: 'NC Network', detail: '9 counties · Active · $192M pent-up', color: '#D4A843', dot: '●' },
  { phase: 'Phase 2', label: 'Southeast Expansion', detail: 'SC, TN, VA, GA · 25+ counties · 2027', color: '#3b82f6', dot: '●' },
  { phase: 'Phase 3', label: 'National Rollout', detail: '100+ counties · 2028 · $1.6B+', color: '#22c55e', dot: '●' },
];

const ACQUIRERS = [
  { category: 'Virtual MAT Companies', names: 'Bicycle Health, Boulder Care, Ophelia', icon: '💊' },
  { category: 'Insurance Companies', names: 'BCBS, Humana, UnitedHealth, Aetna', icon: '🛡️' },
  { category: 'Health Tech Platforms', names: 'Health Catalyst, Evolent, Cotiviti', icon: '⚡' },
];

const TOOLTIP_STYLE = {
  background: '#1a1a2e',
  border: '1px solid rgba(212,168,67,0.3)',
  borderRadius: 8,
  color: '#fff',
  fontSize: 12,
};

export default function AdminExpansion() {
  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-[#D4A843]" />
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Growth Projections</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Expansion</h1>
        <p className="text-slate-500 text-sm mt-0.5">Scale projections · TAM · exit thesis</p>
      </div>

      {/* Top section */}
      <div className="grid grid-cols-5 gap-4 mb-5">
        {/* Scale projections area chart */}
        <Card className="col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Revenue at Scale</CardTitle>
            <p className="text-xs text-slate-400">Pent-up annual revenue as county network grows</p>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SCALE_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4A843" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4A843" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="counties"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `${v} counties`}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `$${v}M`}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v: number | undefined) => [`$${v ?? 0}M`, 'Revenue']}
                    labelFormatter={v => `${v} counties`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#D4A843"
                    strokeWidth={3}
                    fill="url(#goldGrad)"
                    dot={{ r: 6, fill: '#D4A843', strokeWidth: 0 }}
                    activeDot={{ r: 8 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {SCALE_DATA.map(d => (
                <div key={d.counties} className="text-center p-2 rounded-lg" style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)' }}>
                  <div className="text-sm font-black" style={{ color: '#D4A843' }}>${d.revenue >= 1000 ? `${d.revenue / 1000}B` : `${d.revenue}M`}</div>
                  <div className="text-[9px] text-slate-400">{d.counties} counties</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* TAM */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Addressable Market</CardTitle>
            <p className="text-xs text-slate-400">US market opportunity</p>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TAM_DATA} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number | undefined) => [`$${v ?? 0}B`, 'TAM']} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
                    {TAM_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 7 conditions */}
            <div className="mt-3">
              <div className="text-xs font-semibold text-slate-500 mb-2">7 Target Conditions</div>
              <div className="flex flex-wrap gap-1.5">
                {CONDITIONS.map(c => (
                  <div
                    key={c.name}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      background: `${c.color}15`,
                      border: `1px solid ${c.color}30`,
                      color: c.status === 'Live' ? c.color : '#64748b',
                    }}
                  >
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                    {c.status === 'Live' && <span style={{ color: c.color }}>●</span>}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic phases + Exit thesis */}
      <div className="grid grid-cols-2 gap-4">
        {/* Geographic expansion */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#D4A843]" />
              <CardTitle className="text-sm">Geographic Expansion Path</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {GEO_PHASES.map((p, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: p.color }}>
                      {i + 1}
                    </div>
                    {i < GEO_PHASES.length - 1 && (
                      <div className="w-0.5 flex-1 mt-1" style={{ background: `${p.color}40`, minHeight: 24 }} />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="text-xs font-semibold" style={{ color: p.color }}>{p.phase}</div>
                    <div className="text-sm font-bold text-slate-800">{p.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{p.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exit thesis */}
        <Card style={{ border: '1px solid rgba(212,168,67,0.3)', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f1528 100%)' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#D4A843]" />
              <CardTitle className="text-sm text-white">Exit Thesis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.25)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-[#D4A843]" />
                <span className="text-xs font-semibold text-[#D4A843] uppercase tracking-wider">Target Outcome</span>
              </div>
              <div className="text-3xl font-black text-white mb-1">$500M+</div>
              <div className="text-white/50 text-xs">Exit by December 2027</div>
              <div className="mt-3 space-y-1">
                <div className="text-xs text-white/60 flex items-center gap-2">
                  <span className="text-[#D4A843]">→</span> 100+ counties signed
                </div>
                <div className="text-xs text-white/60 flex items-center gap-2">
                  <span className="text-[#D4A843]">→</span> 100,000+ patients in network
                </div>
                <div className="text-xs text-white/60 flex items-center gap-2">
                  <span className="text-[#D4A843]">→</span> $1.6B pent-up revenue at 100 counties
                </div>
              </div>
            </div>

            <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Strategic Acquirers</div>
            <div className="space-y-2">
              {ACQUIRERS.map(a => (
                <div key={a.category} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span>{a.icon}</span>
                    <span className="text-xs font-semibold text-white">{a.category}</span>
                  </div>
                  <div className="text-[11px] text-white/40 pl-6">{a.names}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
