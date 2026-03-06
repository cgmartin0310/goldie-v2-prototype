import React, { useEffect, useState } from 'react';
import { Building2, MapPin, Users, Stethoscope, TrendingUp, ArrowUpRight, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const REVENUE_STREAMS = [
  { name: 'Insurance/Payer', value: 185.7, color: '#D4A843' },
  { name: 'Treatment Referrals', value: 5.4, color: '#3b82f6' },
  { name: 'Municipalities', value: 0.9, color: '#22c55e' },
];

const MONTHLY_GROWTH = [
  { month: 'Apr', revenue: 0.2 },
  { month: 'May', revenue: 0.3 },
  { month: 'Jun', revenue: 0.5 },
  { month: 'Jul', revenue: 1.1 },
  { month: 'Aug', revenue: 2.8 },
  { month: 'Sep', revenue: 5.4 },
  { month: 'Oct', revenue: 9.2 },
  { month: 'Nov', revenue: 14.7 },
  { month: 'Dec', revenue: 22.3 },
  { month: 'Jan', revenue: 31.8 },
  { month: 'Feb', revenue: 44.2 },
  { month: 'Mar', revenue: 59.6 },
];

const ACTIVITY = [
  { time: '2h ago', text: 'BCBS NC — payer contract initiated', dot: '#D4A843' },
  { time: '4h ago', text: 'Alliance Health joined provider network', dot: '#22c55e' },
  { time: '1d ago', text: 'Burke County — 2nd patient cohort activated', dot: '#3b82f6' },
  { time: '2d ago', text: 'Surry County signed partnership agreement', dot: '#D4A843' },
  { time: '3d ago', text: '1,200+ DART assessments completed this week', dot: '#a78bfa' },
  { time: '4d ago', text: 'Rowan County — MAT initiation rate hits 24%', dot: '#22c55e' },
  { time: '5d ago', text: 'Cleveland County ED diversions: 47 this month', dot: '#f59e0b' },
];

function AnimatedCounter({ target, prefix = '', suffix = '', decimals = 0 }: {
  target: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 60;
    const inc = target / steps;
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(start);
    }, 20);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{display.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

const CUSTOM_TOOLTIP_STYLE = {
  background: '#1a1a2e',
  border: '1px solid rgba(212,168,67,0.3)',
  borderRadius: 8,
  color: '#fff',
  fontSize: 12,
};

export default function AdminDashboard() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-[#D4A843]" />
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Goldie HQ · Business Overview</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Platform Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Full business view · 9 NC counties · Series A 2026</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 mb-0.5">As of</div>
          <div className="text-sm font-medium text-slate-700">March 5, 2026</div>
        </div>
      </div>

      {/* HERO — Pent-up Revenue */}
      <div className="mb-5 rounded-2xl p-8 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', border: '1px solid rgba(212,168,67,0.4)' }}>
        <div>
          <div className="text-xs text-[#D4A843] font-semibold uppercase tracking-widest mb-2">
            Pent-Up Annual Revenue · 9 Counties · All Conditions
          </div>
          <div className="text-7xl font-black text-white leading-none">
            $<AnimatedCounter target={192} suffix="M" />
          </div>
          <div className="text-white/50 text-sm mt-3 max-w-lg">
            Revenue addressable across 9 signed NC counties — municipalities, treatment referrals, and value-based payer contracts.
          </div>
          <div className="mt-4 flex gap-3">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1"
              style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.3)' }}>
              <TrendingUp className="w-3.5 h-3.5 text-[#D4A843]" />
              <span className="text-[#D4A843] text-xs font-semibold">$16M avg per county (all conditions)</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1"
              style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <Activity className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400 text-xs font-semibold">LTV:CAC ratio 1,067:1</span>
            </div>
          </div>
        </div>
        <div className="text-right pr-4 hidden lg:block">
          <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Revenue Breakdown</div>
          <div className="space-y-2">
            {REVENUE_STREAMS.map(s => (
              <div key={s.name} className="flex items-center gap-3 justify-end">
                <span className="text-white/50 text-xs">{s.name}</span>
                <span className="text-sm font-bold" style={{ color: s.color }}>${s.value}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Counties Active', value: '9', icon: MapPin, color: '#D4A843', bg: 'rgba(212,168,67,0.08)', sub: 'NC Network' },
          { label: 'Total Patients Detected', value: '2,847', icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', sub: '+340 this month' },
          { label: 'Provider Network', value: '100+', icon: Stethoscope, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', sub: 'Treatment providers' },
          { label: 'Avg Revenue / County', value: '$16M', icon: TrendingUp, color: '#D4A843', bg: 'rgba(212,168,67,0.08)', sub: 'All conditions' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className={`transition-all duration-500 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: card.bg }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: card.color }} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-200" />
                </div>
                <div className="text-2xl font-black text-slate-900 mb-0.5" style={{ color: card.color }}>{card.value}</div>
                <div className="text-xs font-semibold text-slate-700">{card.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{card.sub}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {/* Revenue by stream donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Revenue by Stream</CardTitle>
            <p className="text-xs text-slate-400">9 counties · all conditions</p>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={REVENUE_STREAMS}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {REVENUE_STREAMS.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={CUSTOM_TOOLTIP_STYLE}
                    formatter={(v: number | undefined) => [`$${v ?? 0}M`, '']}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ fontSize: 10, color: '#64748b' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly revenue growth */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Monthly Revenue Growth Trajectory</CardTitle>
            <p className="text-xs text-slate-400">Pent-up revenue unlocked (cumulative $M) · Hockey stick from Month 4</p>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_GROWTH} margin={{ top: 5, right: 20, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `$${v}M`}
                  />
                  <Tooltip
                    contentStyle={CUSTOM_TOOLTIP_STYLE}
                    formatter={(v: number | undefined) => [`$${v ?? 0}M`, 'Revenue']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#D4A843"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#D4A843', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity feed */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#D4A843]" />
            <CardTitle className="text-sm">Recent Network Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.dot }} />
                <div className="flex-1">
                  <span className="text-sm text-slate-700">{item.text}</span>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
