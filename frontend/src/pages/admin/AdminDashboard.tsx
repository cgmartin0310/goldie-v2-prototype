import React, { useEffect, useState } from 'react';
import { Building2, MapPin, Users, TrendingUp, ArrowUpRight, Activity, DollarSign, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

// Realistic monthly revenue (actual collected, not projections)
const MONTHLY_REVENUE = [
  { month: 'Oct', muni: 45, referral: 0, payer: 0 },
  { month: 'Nov', muni: 52, referral: 8, payer: 0 },
  { month: 'Dec', muni: 58, referral: 14, payer: 0 },
  { month: 'Jan', muni: 68, referral: 22, payer: 0 },
  { month: 'Feb', muni: 78, referral: 38, payer: 12 },
  { month: 'Mar', muni: 85, referral: 52, payer: 18 },
];

const ACTIVITY = [
  { time: '1h ago', text: 'Catawba County — monthly report auto-generated and sent', dot: '#D4A843' },
  { time: '3h ago', text: 'Burke County — onboarding milestone: DART scoring live', dot: '#22c55e' },
  { time: '6h ago', text: 'Rowan County — 24 new patients detected this week', dot: '#3b82f6' },
  { time: '1d ago', text: 'Alliance Health — first treatment referral invoiced ($4,200)', dot: '#D4A843' },
  { time: '1d ago', text: 'Surry County — engagement score improved to 72%', dot: '#22c55e' },
  { time: '2d ago', text: 'Cleveland County — peer support billing integration enabled', dot: '#a78bfa' },
  { time: '3d ago', text: 'Caldwell County — quarterly review scheduled for March 12', dot: '#94a3b8' },
  { time: '4d ago', text: 'BCBS NC — pilot data sharing agreement signed', dot: '#D4A843' },
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
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Goldie HQ</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Platform Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">NC Network · 9 active counties</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 mb-0.5">As of</div>
          <div className="text-sm font-medium text-slate-700">March 5, 2026</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Monthly Revenue (MRR)', value: '$155K', icon: DollarSign, color: '#D4A843', bg: 'rgba(212,168,67,0.08)', sub: '+18% vs last month' },
          { label: 'Counties Active', value: '9', icon: MapPin, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', sub: '4 in pipeline' },
          { label: 'Patients Detected', value: '2,847', icon: Users, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', sub: '+340 this month' },
          { label: 'Avg MOUD Initiation', value: '19.2%', icon: Pill, color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', sub: 'Network average' },
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
                <div className="text-2xl font-black text-slate-900 mb-0.5">{card.value}</div>
                <div className="text-xs font-semibold text-slate-700">{card.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{card.sub}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue chart */}
      <Card className="mb-5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Monthly Revenue by Stream ($K)</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Actual collected revenue · Oct 2025 – Mar 2026</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-slate-900">$155K</div>
              <div className="text-[10px] text-green-600 font-medium">March MRR</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_REVENUE} margin={{ top: 5, right: 20, bottom: 5, left: 5 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
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

      {/* County revenue summary + Activity feed */}
      <div className="grid grid-cols-5 gap-4">
        {/* Top counties by revenue */}
        <Card className="col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Revenue by County (Annualized)</CardTitle>
              <span className="text-xs text-slate-400">Top performers</span>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-[10px] font-semibold text-slate-400 uppercase px-5 pb-2">County</th>
                  <th className="text-right text-[10px] font-semibold text-slate-400 uppercase px-4 pb-2">Municipal</th>
                  <th className="text-right text-[10px] font-semibold text-slate-400 uppercase px-4 pb-2">Referrals</th>
                  <th className="text-right text-[10px] font-semibold text-slate-400 uppercase px-4 pb-2">Insurance</th>
                  <th className="text-right text-[10px] font-semibold text-slate-400 uppercase px-5 pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Catawba', muni: 120, ref: 348, ins: 186, total: 654 },
                  { name: 'Rowan', muni: 110, ref: 275, ins: 0, total: 385 },
                  { name: 'Burke', muni: 100, ref: 180, ins: 0, total: 280 },
                  { name: 'Cleveland', muni: 95, ref: 125, ins: 0, total: 220 },
                  { name: 'Caldwell', muni: 90, ref: 82, ins: 54, total: 226 },
                ].map((c, i) => (
                  <tr key={c.name} className={`border-b border-slate-50 ${i % 2 === 1 ? 'bg-slate-50/30' : ''}`}>
                    <td className="px-5 py-2.5 font-medium text-slate-800">{c.name}</td>
                    <td className="px-4 py-2.5 text-right text-green-700 font-medium">${c.muni}K</td>
                    <td className="px-4 py-2.5 text-right text-blue-700 font-medium">{c.ref > 0 ? `$${c.ref}K` : '—'}</td>
                    <td className="px-4 py-2.5 text-right font-medium" style={{ color: c.ins > 0 ? '#D4A843' : '#94a3b8' }}>{c.ins > 0 ? `$${c.ins}K` : '—'}</td>
                    <td className="px-5 py-2.5 text-right font-bold text-slate-900">${c.total}K</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-2.5 text-xs text-slate-400 border-t border-slate-100">
              Showing top 5 of 9 counties · <span className="text-[#D4A843] font-medium cursor-pointer hover:underline">View all →</span>
            </div>
          </CardContent>
        </Card>

        {/* Activity feed */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#D4A843]" />
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ACTIVITY.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.dot }} />
                  <div className="flex-1">
                    <span className="text-xs text-slate-700">{item.text}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
