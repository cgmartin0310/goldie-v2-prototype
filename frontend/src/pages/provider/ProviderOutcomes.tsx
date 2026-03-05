import React from 'react';
import { Users, TrendingUp, Clock, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';

const OUTCOME_TREND = [
  { month: 'Sep', active: 210, completed: 34, dropped: 18 },
  { month: 'Oct', active: 238, completed: 41, dropped: 15 },
  { month: 'Nov', active: 255, completed: 47, dropped: 12 },
  { month: 'Dec', active: 274, completed: 52, dropped: 14 },
  { month: 'Jan', active: 295, completed: 58, dropped: 11 },
  { month: 'Feb', active: 312, completed: 67, dropped: 9 },
];

const ED_REDUCTION = [
  { county: 'Catawba', before: 4.8, after: 1.4 },
  { county: 'Burke', before: 4.1, after: 1.2 },
  { county: 'Caldwell', before: 3.9, after: 1.1 },
  { county: 'Rowan', before: 3.5, after: 1.3 },
  { county: 'Cleveland', before: 4.2, after: 1.5 },
  { county: 'Surry', before: 2.9, after: 0.9 },
];

const MILESTONE_METRICS = [
  { milestone: '30-day retention', pct: 84, color: '#22c55e' },
  { milestone: '60-day retention', pct: 73, color: '#3b82f6' },
  { milestone: '90-day MAT adherence', pct: 58, color: '#D4A843' },
  { milestone: 'Program completion', pct: 67, color: '#a855f7' },
  { milestone: 'Sustained recovery (6mo)', pct: 44, color: '#ef4444' },
];

export default function ProviderOutcomes() {
  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Outcomes & Reporting</h1>
        <p className="text-slate-500 text-sm mt-0.5">Alliance Health — patient outcomes across the Goldie NC network</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Patients in Treatment', value: '312 active', icon: Users, color: '#3b82f6', bg: '#eff6ff', sub: '+28 this month' },
          { label: 'Completion Rate', value: '67%', icon: TrendingUp, color: '#22c55e', bg: '#f0fdf4', sub: 'vs 51% national avg' },
          { label: 'Avg. Engagement', value: '4.2 months', icon: Clock, color: '#D4A843', bg: '#fefce8', sub: 'from intake to discharge' },
          { label: 'ED Visits Reduced', value: '71%', icon: Activity, color: '#a855f7', bg: '#faf5ff', sub: 'post-enrollment reduction' },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: kpi.bg }}>
                    <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-0.5">{kpi.value}</div>
                <div className="text-xs text-slate-500">{kpi.label}</div>
                <div className="text-xs mt-1.5 font-medium text-green-600">{kpi.sub}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Patient outcomes over time */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Patient Outcomes Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={OUTCOME_TREND} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Active Patients" />
                  <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="Completed Program" />
                  <Line type="monotone" dataKey="dropped" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 3 }} name="Dropped Out" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ED visits before/after */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Avg. ED Visits Per Patient — Before vs. After Goldie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ED_REDUCTION} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="county" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    formatter={(v: number | undefined) => [`${v ?? 0} visits/yr`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="before" fill="#fca5a5" name="Before Goldie" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="after" fill="#D4A843" name="With Goldie" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Retention milestones */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Retention & Milestone Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MILESTONE_METRICS.map(m => (
              <div key={m.milestone} className="flex items-center gap-4">
                <div className="w-44 text-sm text-slate-600">{m.milestone}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-3">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${m.pct}%`, background: m.color }}
                  />
                </div>
                <div className="w-10 text-right font-bold text-slate-700" style={{ color: m.color }}>{m.pct}%</div>
                <div className="w-20 text-xs text-slate-400 text-right">
                  {Math.round(312 * m.pct / 100)} patients
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)' }}>
              <span className="font-semibold text-[#D4A843]">Note: </span>
              <span className="text-slate-600">
                Outcomes tracked via Goldie case management integration. National SUD treatment completion averages 43–51% (SAMHSA 2024).
                Alliance Health exceeds national benchmarks by 16 percentage points.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
