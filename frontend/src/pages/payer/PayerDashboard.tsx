import React, { useEffect, useState } from 'react';
import { Shield, TrendingDown, Users, DollarSign, ArrowUpRight, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';

const COST_TREND = [
  { month: 'Jan \'25', before: 3.9, after: 3.9 },
  { month: 'Feb',     before: 4.1, after: 3.8 },
  { month: 'Mar',     before: 4.0, after: 3.5 },
  { month: 'Apr',     before: 4.2, after: 3.2 },
  { month: 'May',     before: 4.1, after: 2.9, goldie: true },
  { month: 'Jun',     before: 4.3, after: 2.6 },
  { month: 'Jul',     before: 4.2, after: 2.4 },
  { month: 'Aug',     before: 4.1, after: 2.2 },
  { month: 'Sep',     before: 4.4, after: 2.0 },
  { month: 'Oct',     before: 4.3, after: 1.9 },
  { month: 'Nov',     before: 4.2, after: 1.8 },
  { month: 'Dec',     before: 4.1, after: 1.7 },
  { month: 'Jan \'26', before: 4.3, after: 1.6 },
  { month: 'Feb',     before: 4.4, after: 1.5 },
];

function AnimatedNumber({ target, prefix = '', suffix = '', decimals = 0 }: { target: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 50;
    const inc = target / steps;
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(start);
    }, 25);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>{prefix}{display.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>
  );
}

export default function PayerDashboard() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[#D4A843]" />
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Payer Analytics</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Blue Cross NC — Goldie Payer Analytics</h1>
          <p className="text-slate-500 text-sm mt-0.5">Cost avoidance dashboard · 9 NC counties · Q1 2026</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 mb-0.5">Last updated</div>
          <div className="text-sm font-medium text-slate-700">March 5, 2026 · 4:00 PM ET</div>
        </div>
      </div>

      {/* HERO KPI */}
      <div className="mb-5 rounded-2xl p-6 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', border: '1px solid rgba(212,168,67,0.3)' }}>
        <div>
          <div className="text-xs text-[#D4A843] font-semibold uppercase tracking-widest mb-2">Cost Avoidance — This Quarter</div>
          <div className="text-6xl font-black text-white">
            $<AnimatedNumber target={2.4} decimals={1} />M
          </div>
          <div className="text-white/50 text-sm mt-2">Saved through coordinated care intervention across 9 NC counties</div>
          <div className="mt-3 inline-flex items-center gap-2 bg-green-500/15 border border-green-500/25 rounded-full px-3 py-1">
            <TrendingDown className="w-3.5 h-3.5 text-green-400" />
            <span className="text-green-400 text-xs font-semibold">73% reduction in per-member costs since Goldie launch</span>
          </div>
        </div>
        <div className="text-right pr-4">
          <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">ROI Formula</div>
          <div className="text-3xl font-bold text-[#D4A843]">4.2x</div>
          <div className="text-white/40 text-xs mt-1">For every $1 invested</div>
          <div className="text-white/30 text-xs">in Goldie coordination</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {[
          { label: 'ED Visits Prevented', value: '1,847', icon: TrendingDown, color: '#ef4444', bg: '#fef2f2', change: 'This quarter' },
          { label: 'Hospitalizations Avoided', value: '423', icon: BarChart3, color: '#3b82f6', bg: '#eff6ff', change: 'This quarter' },
          { label: 'Avg Cost/Patient — Before', value: '$47,200/yr', icon: DollarSign, color: '#94a3b8', bg: '#f8fafc', change: 'Baseline' },
          { label: 'Avg Cost/Patient — With Goldie', value: '$12,800/yr', icon: DollarSign, color: '#22c55e', bg: '#f0fdf4', change: '↓ 73% reduction' },
          { label: 'Members in Goldie Network', value: '4,200', icon: Users, color: '#D4A843', bg: '#fefce8', change: '+340 this month' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className={`transition-all ${animated ? '' : 'opacity-0'}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: card.bg }}>
                    <Icon className="w-4 h-4" style={{ color: card.color }} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-200" />
                </div>
                <div className="text-lg font-bold text-slate-900 mb-0.5 leading-tight">{card.value}</div>
                <div className="text-[10px] text-slate-500 leading-tight">{card.label}</div>
                <div className="text-[10px] mt-1 font-medium text-green-600">{card.change}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cost trend chart */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Monthly Spend Per Member — Before vs. After Goldie</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Per-member per-month spend ($ thousands) · Goldie launched May 2025</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-300 rounded" />Projected without Goldie</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#D4A843] rounded" />With Goldie</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={COST_TREND} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `$${v}K`}
                  domain={[0, 5]}
                />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  formatter={(v: number | undefined) => [`$${v ?? 0}K PMPM`, '']}
                />
                <ReferenceLine x="May" stroke="#D4A843" strokeDasharray="4 2" label={{ value: 'Goldie Launch', fill: '#D4A843', fontSize: 10 }} />
                <Line type="monotone" dataKey="before" stroke="#fca5a5" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Without Goldie" />
                <Line type="monotone" dataKey="after" stroke="#D4A843" strokeWidth={2.5} dot={{ r: 3, fill: '#D4A843' }} activeDot={{ r: 5 }} name="With Goldie" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            title: 'Total Value-Based Contract',
            value: '$14.9M',
            sub: 'Per county per year (at scale)',
            desc: 'Based on documented cost avoidance tied to Goldie-coordinated interventions',
            color: '#D4A843',
          },
          {
            title: 'Network Savings Rate',
            value: '73%',
            sub: 'Cost reduction per enrolled member',
            desc: '$47,200 baseline → $12,800 with Goldie. Measured across 4,200 members in 9 counties.',
            color: '#22c55e',
          },
          {
            title: 'Goldie ROI Summary',
            value: '$4.20',
            sub: 'Returned per $1 invested',
            desc: 'Q1 2026: $2.4M saved on $573K Goldie contract cost. Annualizing at $9.6M projected.',
            color: '#3b82f6',
          },
        ].map(s => (
          <Card key={s.title}>
            <CardContent className="p-5">
              <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-sm font-bold text-slate-800 mb-0.5">{s.title}</div>
              <div className="text-xs text-[#D4A843] font-medium mb-2">{s.sub}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{s.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
