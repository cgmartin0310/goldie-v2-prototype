import React, { useEffect, useState } from 'react';
import { BarChart3, Activity, Clock, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts';

const PATIENTS_PER_MONTH = [
  { month: 'Apr', patients: 48 },
  { month: 'May', patients: 87 },
  { month: 'Jun', patients: 143 },
  { month: 'Jul', patients: 198 },
  { month: 'Aug', patients: 267 },
  { month: 'Sep', patients: 318 },
  { month: 'Oct', patients: 389 },
  { month: 'Nov', patients: 421 },
  { month: 'Dec', patients: 467 },
  { month: 'Jan', patients: 512 },
  { month: 'Feb', patients: 548 },
  { month: 'Mar', patients: 449 },
];

const RISK_DIST = [
  { name: 'Low Risk', value: 42, color: '#22c55e' },
  { name: 'Moderate', value: 32, color: '#eab308' },
  { name: 'High Risk', value: 18, color: '#f97316' },
  { name: 'Critical', value: 8, color: '#ef4444' },
];

const ED_OUTCOMES = [
  { month: 'May', before: 412, after: 412 },
  { month: 'Jun', before: 428, after: 380 },
  { month: 'Jul', before: 435, after: 341 },
  { month: 'Aug', before: 441, after: 298 },
  { month: 'Sep', before: 438, after: 261 },
  { month: 'Oct', before: 445, after: 228 },
  { month: 'Nov', before: 442, after: 198 },
  { month: 'Dec', before: 449, after: 172 },
  { month: 'Jan', before: 447, after: 152 },
  { month: 'Feb', before: 451, after: 136 },
  { month: 'Mar', before: 448, after: 124 },
];

const TOOLTIP_STYLE = {
  background: '#1a1a2e',
  border: '1px solid rgba(212,168,67,0.3)',
  borderRadius: 8,
  color: '#fff',
  fontSize: 12,
};

function AnimatedCounter({ target, prefix = '', suffix = '', decimals = 0 }: {
  target: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 50;
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

export default function AdminMetrics() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);

  const KPIS = [
    { label: 'DART Assessments Run', value: 4200, suffix: '+', color: '#D4A843', icon: Activity, decimals: 0 },
    { label: 'Risk Score Accuracy', value: 80, suffix: '%', color: '#22c55e', icon: BarChart3, decimals: 0 },
    { label: 'Avg Time to Intervention', value: 4.2, suffix: 'h', color: '#3b82f6', icon: Clock, decimals: 1 },
    { label: 'MAT Initiation Rate', value: 21.4, suffix: '%', color: '#a78bfa', icon: TrendingDown, decimals: 1 },
    { label: 'ED Visit Reduction', value: 34, suffix: '%', color: '#ef4444', icon: TrendingDown, decimals: 0 },
    { label: '30-Day Retention Rate', value: 67, suffix: '%', color: '#22c55e', icon: Activity, decimals: 0 },
  ];

  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-4 h-4 text-[#D4A843]" />
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Platform Performance</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Platform Metrics</h1>
        <p className="text-slate-500 text-sm mt-0.5">Clinical outcomes · network performance · Q1 2026</p>
      </div>

      {/* KPI Hero Grid */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        {KPIS.map(kpi => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className={`transition-all duration-500 ${animated ? 'opacity-100' : 'opacity-0'}`}>
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${kpi.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
                <div className="text-2xl font-black leading-none mb-1" style={{ color: kpi.color }}>
                  <AnimatedCounter target={kpi.value} suffix={kpi.suffix} decimals={kpi.decimals} />
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">{kpi.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        {/* Patients detected per month */}
        <Card className="col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Patients Detected Per Month</CardTitle>
            <p className="text-xs text-slate-400">Network-wide DART detections · growing cohort</p>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PATIENTS_PER_MONTH} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number | undefined) => [v ?? 0, 'Patients']} />
                  <Bar dataKey="patients" fill="#D4A843" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk distribution pie */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Risk Distribution — Network-Wide</CardTitle>
            <p className="text-xs text-slate-400">Current patient risk profile</p>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={RISK_DIST} cx="50%" cy="45%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {RISK_DIST.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number | undefined) => [`${v ?? 0}%`, '']} />
                  <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 10, color: '#64748b' }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ED visit outcomes */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">ED Visits — Before vs. After Goldie</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Monthly ED visits per 10K covered lives · 34% reduction achieved</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-300 rounded inline-block" />Without Goldie</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#D4A843] rounded inline-block" />With Goldie</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ED_OUTCOMES} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 500]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number | undefined) => [v ?? 0, 'ED Visits']} />
                <Line type="monotone" dataKey="before" stroke="#fca5a5" strokeWidth={2} strokeDasharray="5 3" dot={false} name="Without Goldie" />
                <Line type="monotone" dataKey="after" stroke="#D4A843" strokeWidth={2.5} dot={{ r: 3, fill: '#D4A843' }} activeDot={{ r: 5 }} name="With Goldie" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
