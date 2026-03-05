import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight, Inbox, Users, CheckCircle, Clock,
  Heart, ArrowRight, MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const KPI_CARDS = [
  { label: 'Total Referrals Received', value: '847', change: '+64 this month', icon: Inbox, color: '#D4A843', bg: '#fefce8' },
  { label: 'Active Patients', value: '312', change: '+28 this month', icon: Users, color: '#3b82f6', bg: '#eff6ff' },
  { label: 'Accepted Rate', value: '89%', change: 'vs. 71% network avg', icon: CheckCircle, color: '#22c55e', bg: '#f0fdf4' },
  { label: 'Avg. Time to First Appt.', value: '2.3 days', change: '↓ 1.1 days vs. prior quarter', icon: Clock, color: '#a855f7', bg: '#faf5ff' },
];

const REFERRAL_TREND = [
  { month: 'Sep', referrals: 98 },
  { month: 'Oct', referrals: 115 },
  { month: 'Nov', referrals: 127 },
  { month: 'Dec', referrals: 134 },
  { month: 'Jan', referrals: 149 },
  { month: 'Feb', referrals: 162 },
];

const RECENT_REFERRALS = [
  { id: 'R-2847', name: 'J. Mitchell', county: 'Catawba', risk: 'critical', date: '2026-03-04', status: 'pending' },
  { id: 'R-2846', name: 'T. Lawson', county: 'Burke', risk: 'high', date: '2026-03-04', status: 'accepted' },
  { id: 'R-2845', name: 'M. Parker', county: 'Rowan', risk: 'high', date: '2026-03-03', status: 'scheduled' },
  { id: 'R-2844', name: 'D. Harris', county: 'Caldwell', risk: 'moderate', date: '2026-03-03', status: 'active' },
  { id: 'R-2843', name: 'S. Johnson', county: 'Catawba', risk: 'critical', date: '2026-03-02', status: 'pending' },
  { id: 'R-2842', name: 'R. Williams', county: 'Surry', risk: 'high', date: '2026-03-02', status: 'completed' },
];

const RISK_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-amber-100 text-amber-700',
  moderate: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-600',
  accepted: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-purple-100 text-purple-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-slate-200 text-slate-500',
};

function CounterNumber({ target }: { target: string }) {
  const [display, setDisplay] = useState(0);
  const num = parseFloat(target.replace(/[^0-9.]/g, ''));

  useEffect(() => {
    let start = 0;
    const steps = 40;
    const inc = num / steps;
    const timer = setInterval(() => {
      start += inc;
      if (start >= num) { setDisplay(num); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [num]);

  if (target.includes('%')) return <span>{display.toFixed(0)}%</span>;
  if (target.includes('days')) return <span>{display.toFixed(1)} days</span>;
  return <span>{Math.round(display).toLocaleString()}</span>;
}

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-4 h-4 text-[#D4A843]" />
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Provider Network</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Alliance Health — Goldie Provider Network</h1>
        <p className="text-slate-500 text-sm mt-0.5">Treatment referral dashboard · 9 NC counties · Updated live</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {KPI_CARDS.map(card => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className={`transition-all ${animated ? 'animate-fade-in' : 'opacity-0'}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: card.bg }}>
                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-0.5">
                  <CounterNumber target={card.value} />
                </div>
                <div className="text-xs text-slate-500">{card.label}</div>
                <div className="text-xs mt-1.5 font-medium text-green-600">{card.change}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Network strip */}
      <div className="mb-4 rounded-xl px-4 py-3 flex items-center gap-6 text-xs"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(212,168,67,0.2)' }}>
        <div className="text-[#D4A843] font-semibold text-[11px] uppercase tracking-wider flex-shrink-0">Goldie Provider Network</div>
        {[
          { label: 'Counties Served', value: '9 NC' },
          { label: 'Referrals YTD', value: '847' },
          { label: 'Revenue (Referral Fees)', value: '$1.2M' },
          { label: 'Avg. Patient LTV', value: '$8,400' },
        ].map(stat => (
          <div key={stat.label} className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">{stat.value}</span>
            <span className="text-white/40">{stat.label}</span>
            <span className="text-white/20">·</span>
          </div>
        ))}
        <div className="flex-1" />
        <span className="text-white/30 text-[10px]">Series A · 2026</span>
      </div>

      {/* Chart + Recent Referrals */}
      <div className="grid grid-cols-5 gap-4">
        {/* Trend chart */}
        <Card className="col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Referral Volume — Last 6 Months</CardTitle>
              <Badge className="bg-green-100 text-green-700 text-xs">↑ Trending Up</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REFERRAL_TREND} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    labelStyle={{ color: '#D4A843' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="referrals"
                    stroke="#D4A843"
                    strokeWidth={2.5}
                    dot={{ fill: '#D4A843', r: 4 }}
                    activeDot={{ r: 6, fill: '#D4A843' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent referrals */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Recent Referrals</CardTitle>
              <button className="text-xs text-[#D4A843] hover:text-[#c49a3a]" onClick={() => navigate('/provider/referrals')}>
                View all →
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-2">
              {RECENT_REFERRALS.slice(0, 5).map(ref => (
                <div key={ref.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => navigate('/provider/referrals')}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ref.risk === 'critical' ? 'bg-red-500 animate-pulse' : ref.risk === 'high' ? 'bg-amber-400' : 'bg-yellow-300'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-900">{ref.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${RISK_COLORS[ref.risk]}`}>{ref.risk}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-slate-300" />
                      <span className="text-[10px] text-slate-400">{ref.county} Co.</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[ref.status]}`}>{ref.status}</span>
                  <ArrowRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outcome summary */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {[
          { label: 'Treatment Completion Rate', value: '67%', desc: 'Patients completing full program', color: '#22c55e', bg: '#f0fdf4' },
          { label: 'ED Visits Reduced', value: '71%', desc: 'Members with fewer ER encounters post-enrollment', color: '#3b82f6', bg: '#eff6ff' },
          { label: 'MAT Adherence (90-day)', value: '58%', desc: 'Patients on medication-assisted treatment at 90 days', color: '#D4A843', bg: '#fefce8' },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-sm font-semibold text-slate-800 mb-1">{stat.label}</div>
              <div className="text-xs text-slate-400">{stat.desc}</div>
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full">
                <div className="h-full rounded-full transition-all" style={{ width: stat.value, background: stat.color }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
