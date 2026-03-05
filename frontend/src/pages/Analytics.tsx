import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Users, Award, Building2 } from 'lucide-react';

// 9 signed NC counties — Catawba is the logged-in county
const MY_COUNTY = 'Catawba';

const COUNTY_DATA = [
  { county: 'Catawba',   patients: 312, critical: 42, moudRate: 21, isMyCounty: true  },
  { county: 'Burke',     patients: 241, critical: 29, moudRate: 17, isMyCounty: false },
  { county: 'Caldwell',  patients: 198, critical: 24, moudRate: 16, isMyCounty: false },
  { county: 'Alexander', patients: 174, critical: 18, moudRate: 20, isMyCounty: false },
  { county: 'Rowan',     patients: 161, critical: 17, moudRate: 18, isMyCounty: false },
  { county: 'Cleveland', patients: 143, critical: 14, moudRate: 22, isMyCounty: false },
  { county: 'Surry',     patients: 127, critical: 11, moudRate: 15, isMyCounty: false },
  { county: 'Jackson',   patients: 104, critical: 9,  moudRate: 19, isMyCounty: false },
  { county: 'Carteret',  patients: 87,  critical: 7,  moudRate: 24, isMyCounty: false },
];

const NETWORK_AVG_MOUD = Math.round(
  COUNTY_DATA.reduce((s, c) => s + c.moudRate, 0) / COUNTY_DATA.length
);
const TOTAL_PATIENTS = COUNTY_DATA.reduce((s, c) => s + c.patients, 0);

const RISK_DIST = [
  { name: 'Critical', value: 312, color: '#7f1d1d' },
  { name: 'High',     value: 687, color: '#ef4444' },
  { name: 'Moderate', value: 924, color: '#f59e0b' },
  { name: 'Low',      value: 924, color: '#22c55e' },
];

const OUTCOME_TREND = [
  { month: 'Sep', moudRate: 8,  repeatOD: 42, interventions: 89  },
  { month: 'Oct', moudRate: 10, repeatOD: 38, interventions: 112 },
  { month: 'Nov', moudRate: 12, repeatOD: 35, interventions: 145 },
  { month: 'Dec', moudRate: 14, repeatOD: 31, interventions: 178 },
  { month: 'Jan', moudRate: 16, repeatOD: 28, interventions: 234 },
  { month: 'Feb', moudRate: 18, repeatOD: 24, interventions: 287 },
  { month: 'Mar', moudRate: 21, repeatOD: 19, interventions: 318 },
];

const INTERVENTION_EFFECTIVENESS = [
  { category: 'ED-Based MAT (CVMC)', rate: 68, baseline: 12 },
  { category: 'Peer Support + MAT',  rate: 54, baseline: 12 },
  { category: 'MAT Only',            rate: 41, baseline: 12 },
  { category: 'Peer Support Only',   rate: 29, baseline: 12 },
  { category: 'No Intervention',     rate: 12, baseline: 12 },
];

export default function Analytics() {
  const myCountyData = COUNTY_DATA.find(c => c.county === MY_COUNTY)!;

  return (
    <div className="p-6 max-w-screen-xl">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Population Analytics</h1>
        <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
          <Building2 className="w-3.5 h-3.5 text-[#D4A843]" />
          <span className="font-medium text-slate-700">Catawba County Health Department</span>
          <span className="text-slate-300">·</span>
          <span>9 counties in Goldie NC network · 2,847 network patients · Powered by DART™ + CARESTREAM™</span>
        </div>
      </div>

      {/* Top metrics — Catawba County */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Catawba Patients', value: myCountyData.patients.toLocaleString(), icon: Users, color: '#3b82f6', bg: '#eff6ff', change: `Network total: ${TOTAL_PATIENTS.toLocaleString()}` },
          { label: 'MOUD Rate (Catawba)', value: `${myCountyData.moudRate}%`, icon: TrendingUp, color: '#22c55e', bg: '#f0fdf4', change: `↑ vs network avg ${NETWORK_AVG_MOUD}%` },
          { label: 'Avoided ED Visits (Q1)', value: '$847K', icon: DollarSign, color: '#D4A843', bg: '#fefce8', change: 'Catawba estimated savings' },
          { label: '6-Month OD-Free Rate', value: '68%', icon: Award, color: '#8b5cf6', bg: '#f5f3ff', change: 'MAT pts engaged within 72h' },
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
            <CardTitle className="text-sm">Outcome Trends — 7 Months (Catawba County)</CardTitle>
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
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500 inline-block" />Repeat ODs/month</span>
            </div>
          </CardContent>
        </Card>

        {/* Risk distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Risk Distribution — Goldie NC Network</CardTitle>
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
                    <span className="text-xs text-slate-400">({Math.round(d.value / TOTAL_PATIENTS * 100)}%)</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700 flex justify-between">
                  <span>Network Total</span>
                  <span>{TOTAL_PATIENTS.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Network county benchmarks */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Network Benchmarks — MOUD Initiation Rate</CardTitle>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-[#D4A843] inline-block" />
                Your county
              </div>
            </div>
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
                  <tr
                    key={county.county}
                    className={`border-b border-slate-50 ${county.isMyCounty ? 'bg-[#D4A843]/5' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-5 py-2.5 text-slate-400 font-medium">{i + 1}</td>
                    <td className="px-3 py-2.5">
                      <span className={`font-medium ${county.isMyCounty ? 'text-[#D4A843]' : 'text-slate-700'}`}>
                        {county.county}
                        {county.isMyCounty && <span className="ml-1 text-[9px] text-[#D4A843] font-semibold">YOU</span>}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{county.patients.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-red-600 font-medium">{county.critical}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${county.moudRate / 30 * 100}%`, background: county.isMyCounty ? '#D4A843' : '#22c55e' }}
                          />
                        </div>
                        <span className={`font-semibold ${county.isMyCounty ? 'text-[#D4A843]' : 'text-green-700'}`}>{county.moudRate}%</span>
                        {i === 0 && <span className="text-[9px] text-yellow-500">🏆</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-2 text-[10px] text-slate-400">
              Network avg: {NETWORK_AVG_MOUD}% · Target: 25% · National avg: 8.4%
            </div>
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
                Key finding: ED-based MAT initiation at CVMC within 72h of OD is 5.7× more effective than no intervention at preventing 6-month repeat OD.
              </p>
            </div>

            <div className="mt-3 p-3 bg-slate-50 rounded-lg">
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Network Revenue Opportunity</div>
              <div className="text-xl font-bold text-slate-900">$192M</div>
              <div className="text-xs text-slate-400 mt-0.5">Pent-up demand across 9 NC counties · Addressable with Goldie platform</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
