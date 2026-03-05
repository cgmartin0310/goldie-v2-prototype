import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Users, Award } from 'lucide-react';

const COUNTY_DATA = [
  { county: 'Fayette', patients: 847, critical: 89, moudRate: 22 },
  { county: 'Jefferson', patients: 612, critical: 61, moudRate: 18 },
  { county: 'Madison', patients: 398, critical: 38, moudRate: 15 },
  { county: 'Scott', patients: 287, critical: 31, moudRate: 21 },
  { county: 'Jessamine', patients: 243, critical: 22, moudRate: 19 },
  { county: 'Woodford', patients: 198, critical: 17, moudRate: 24 },
  { county: 'Clark', patients: 176, critical: 14, moudRate: 17 },
  { county: 'Anderson', patients: 86, critical: 6, moudRate: 28 },
];

const RISK_DIST = [
  { name: 'Critical', value: 312, color: '#7f1d1d' },
  { name: 'High', value: 687, color: '#ef4444' },
  { name: 'Moderate', value: 924, color: '#f59e0b' },
  { name: 'Low', value: 924, color: '#22c55e' },
];

const OUTCOME_TREND = [
  { month: 'Sep', moudRate: 8, repeatOD: 42, interventions: 89 },
  { month: 'Oct', moudRate: 10, repeatOD: 38, interventions: 112 },
  { month: 'Nov', moudRate: 12, repeatOD: 35, interventions: 145 },
  { month: 'Dec', moudRate: 14, repeatOD: 31, interventions: 178 },
  { month: 'Jan', moudRate: 16, repeatOD: 28, interventions: 234 },
  { month: 'Feb', moudRate: 18, repeatOD: 24, interventions: 287 },
  { month: 'Mar', moudRate: 19, repeatOD: 21, interventions: 318 },
];

const INTERVENTION_EFFECTIVENESS = [
  { category: 'ED-Based MAT (BRIGHT)', rate: 68, baseline: 12 },
  { category: 'Peer Support + MAT', rate: 54, baseline: 12 },
  { category: 'MAT Only', rate: 41, baseline: 12 },
  { category: 'Peer Support Only', rate: 29, baseline: 12 },
  { category: 'No Intervention', rate: 12, baseline: 12 },
];

export default function Analytics() {
  return (
    <div className="p-6 max-w-screen-xl">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Population Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">12 counties · 2,847 active patients · Powered by DART™ + CARESTREAM™</p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Active Patients', value: '2,847', icon: Users, color: '#3b82f6', bg: '#eff6ff', change: '+124 this month' },
          { label: 'MOUD Initiation Rate', value: '19.2%', icon: TrendingUp, color: '#22c55e', bg: '#f0fdf4', change: '↑ 1.2% vs last month' },
          { label: 'Avoided ED Visits (Q1)', value: '$4.2M', icon: DollarSign, color: '#D4A843', bg: '#fefce8', change: 'Estimated savings' },
          { label: '6-Month OD-Free Rate', value: '68%', icon: Award, color: '#8b5cf6', bg: '#f5f3ff', change: 'MAT pts within 72h' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: card.bg }}>
                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900">{card.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{card.label}</div>
                <div className="text-xs text-green-600 font-medium mt-1">{card.change}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Outcome trends */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Outcome Trends — 7 Months</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={OUTCOME_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 11, border: '1px solid #e2e8f0' }} />
                <Line type="monotone" dataKey="moudRate" stroke="#22c55e" strokeWidth={2} dot={false} name="MOUD Rate %" />
                <Line type="monotone" dataKey="repeatOD" stroke="#ef4444" strokeWidth={2} dot={false} name="Repeat ODs" strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-green-500 inline-block" />MOUD Initiation Rate</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500 inline-block border-dashed" />Repeat ODs/month</span>
            </div>
          </CardContent>
        </Card>

        {/* Risk distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Risk Distribution — All Counties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={RISK_DIST} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" strokeWidth={0}>
                    {RISK_DIST.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {RISK_DIST.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-xs text-slate-600 flex-1">{d.name}</span>
                    <span className="text-xs font-bold text-slate-800">{d.value.toLocaleString()}</span>
                    <span className="text-xs text-slate-400">({Math.round(d.value / 2847 * 100)}%)</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700 flex justify-between">
                  <span>Total</span>
                  <span>2,847</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* County leaderboard */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">County Leaderboard — MOUD Initiation Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-2 text-left text-slate-400 font-medium">#</th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">County</th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">Patients</th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">Critical</th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">MOUD Rate</th>
                </tr>
              </thead>
              <tbody>
                {[...COUNTY_DATA].sort((a, b) => b.moudRate - a.moudRate).map((county, i) => (
                  <tr key={county.county} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-2.5 text-slate-400 font-medium">{i + 1}</td>
                    <td className="px-3 py-2.5 font-medium text-slate-800">{county.county}</td>
                    <td className="px-3 py-2.5 text-slate-600">{county.patients.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-red-600 font-medium">{county.critical}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5">
                          <div className="h-full rounded-full bg-green-500" style={{ width: `${county.moudRate / 30 * 100}%` }} />
                        </div>
                        <span className="font-semibold text-green-700">{county.moudRate}%</span>
                        {i === 0 && <span className="text-[9px] text-yellow-500">🏆</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-2 text-[10px] text-slate-400">Target: 25% · National avg: 8.4%</div>
          </CardContent>
        </Card>

        {/* Intervention effectiveness */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">6-Month OD-Free Rate by Intervention Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {INTERVENTION_EFFECTIVENESS.map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600">{item.category}</span>
                    <span className="text-xs font-bold" style={{ color: item.rate >= 50 ? '#22c55e' : item.rate >= 30 ? '#f59e0b' : '#ef4444' }}>
                      {item.rate}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.rate}%`,
                        background: item.rate >= 50 ? '#22c55e' : item.rate >= 30 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-700 font-medium">
                Key finding: ED-based MAT initiation within 72h of OD is 5.7× more effective than no intervention at preventing 6-month repeat OD.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
