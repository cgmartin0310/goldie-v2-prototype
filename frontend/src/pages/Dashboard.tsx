import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Users, Activity, TrendingUp, ArrowUpRight, ArrowRight, MapPin, Clock, Building2, DollarSign, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import patients from '@/data/patients.json';

// Demo: logged-in county
const DEMO_COUNTY = 'Catawba';

const KPI_CARDS = [
  {
    label: 'Active Patients',
    value: '312',
    change: '+28 this month',
    changeDir: 'up',
    icon: Users,
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    label: 'High-Risk Alerts',
    value: '8',
    change: '3 critical today',
    changeDir: 'up',
    icon: AlertTriangle,
    color: '#ef4444',
    bg: '#fef2f2',
  },
  {
    label: 'Interventions (30d)',
    value: '47',
    change: '+22% vs last month',
    changeDir: 'up',
    icon: Activity,
    color: '#D4A843',
    bg: '#fefce8',
  },
  {
    label: 'MOUD Initiation (30d)',
    value: '21.4%',
    change: 'Network avg: 19.2%',
    changeDir: 'up',
    icon: TrendingUp,
    color: '#22c55e',
    bg: '#f0fdf4',
  },
];

// 9 actual signed NC counties — geographic positions (% within NC outline)
// Western/Foothills cluster + Carteret on coast
// Positions mapped to NC outline: west (x~5-15), foothills (x~15-30), piedmont (x~30-45), coast (x~80+)
const COUNTY_ZONES = [
  { name: 'Catawba',   x: 22, y: 42, intensity: 0.88, count: 312,  isMyCounty: true,  moudRate: 21.4 },
  { name: 'Burke',     x: 15, y: 40, intensity: 0.72, count: 241,  isMyCounty: false, moudRate: 18.7 },
  { name: 'Caldwell',  x: 18, y: 33, intensity: 0.65, count: 198,  isMyCounty: false, moudRate: 22.1 },
  { name: 'Alexander', x: 24, y: 34, intensity: 0.58, count: 174,  isMyCounty: false, moudRate: 16.3 },
  { name: 'Rowan',     x: 32, y: 44, intensity: 0.54, count: 161,  isMyCounty: false, moudRate: 19.8 },
  { name: 'Cleveland', x: 24, y: 54, intensity: 0.48, count: 143,  isMyCounty: false, moudRate: 14.9 },
  { name: 'Surry',     x: 26, y: 24, intensity: 0.42, count: 127,  isMyCounty: false, moudRate: 20.5 },
  { name: 'Jackson',   x: 7,  y: 52, intensity: 0.35, count: 104,  isMyCounty: false, moudRate: 17.2 },
  { name: 'Carteret',  x: 82, y: 52, intensity: 0.28, count:  87,  isMyCounty: false, moudRate: 23.6 },
];

function CounterNumber({ target, suffix = '' }: { target: number | string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const numTarget = typeof target === 'number' ? target : parseFloat(String(target).replace(/,/g, ''));

  useEffect(() => {
    let start = 0;
    const increment = numTarget / 40;
    const timer = setInterval(() => {
      start += increment;
      if (start >= numTarget) {
        setDisplay(numTarget);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [numTarget]);

  const formatted = typeof target === 'string' && target.includes('%')
    ? display.toFixed(1) + '%'
    : typeof target === 'string' && target.includes(',')
      ? Math.round(display).toLocaleString()
      : Math.round(display).toString();

  return <span>{formatted}{suffix}</span>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const countyPatients = patients.filter(p => p.county === DEMO_COUNTY);
  const criticalPatients = countyPatients.filter(p => p.riskLevel === 'critical').slice(0, 5);
  const recentAlerts = countyPatients
    .filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high')
    .slice(0, 5);

  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">County Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#D4A843]" />
            <span className="font-medium text-slate-700">Catawba County Health Department</span>
            <span className="text-slate-300">·</span>
            Showing Catawba County patients only
          </span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {KPI_CARDS.map((card) => {
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
                <div className={`text-xs mt-1.5 font-medium ${card.changeDir === 'up' ? 'text-green-600' : 'text-slate-400'}`}>
                  {card.change}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Network County Comparison */}
        <Card className="col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Patients Detected — Goldie NC Network</CardTitle>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D4A843]" />Detected</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" />MOUD Initiated</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-2">
              {COUNTY_ZONES.sort((a, b) => b.count - a.count).map((county) => {
                const maxCount = 312;
                const pct = (county.count / maxCount) * 100;
                const isMe = county.isMyCounty;
                return (
                  <div key={county.name} className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isMe ? 'bg-amber-50 border border-[#D4A843]/20' : 'hover:bg-slate-50'}`}>
                    <div className="w-20 text-xs font-medium text-slate-700 flex items-center gap-1.5 flex-shrink-0">
                      {isMe && <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] flex-shrink-0" />}
                      {county.name}
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      {/* Patients detected bar */}
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: isMe ? 'linear-gradient(90deg, #D4A843, #e8c06a)' : '#cbd5e1',
                          }}
                        />
                      </div>
                      {/* MOUD initiation bar — proportional to detected */}
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(county.moudRate / 100) * pct}%`,
                            background: isMe ? '#22c55e' : '#86efac',
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0 w-16">
                      <span className={`text-xs font-bold ${isMe ? 'text-[#D4A843]' : 'text-slate-500'}`}>
                        {county.count}
                      </span>
                      <span className={`text-[10px] font-semibold ${isMe ? 'text-green-600' : 'text-green-500'}`}>
                        {county.moudRate}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>9 counties in Goldie NC Network</span>
              <span className="font-medium text-slate-600">Network total: <span className="text-[#D4A843] font-bold">2,847</span></span>
            </div>
          </CardContent>
        </Card>

        {/* Alert Feed */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Critical Alerts — Catawba County</CardTitle>
              <Badge variant="destructive" className="text-xs">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-2">
              {recentAlerts.map((patient, i) => (
                <div
                  key={patient.id}
                  className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors border border-slate-100"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    patient.riskLevel === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900 truncate">{patient.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase flex-shrink-0 ${
                        patient.riskLevel === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>{patient.riskLevel}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {patient.lastEventType?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} · {patient.age}y {patient.gender}
                    </div>
                    <div className="text-xs text-slate-400">
                      Response SLA: {patient.riskLevel === 'critical' ? '4 hours' : '12 hours'}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </div>

            <button
              className="w-full mt-3 text-xs text-[#D4A843] font-medium hover:text-[#c49a3a] transition-colors"
              onClick={() => navigate('/detection')}
            >
              View Detection Feed →
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Critical patients */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Critical Risk — Catawba County</CardTitle>
              <button className="text-xs text-[#D4A843] hover:text-[#c49a3a]" onClick={() => navigate('/patients')}>
                View all →
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-2 text-left text-slate-400 font-medium">Patient</th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">Score</th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">Last Event</th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">Response SLA</th>
                </tr>
              </thead>
              <tbody>
                {criticalPatients.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/patients/${p.id}`)}
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-slate-900">{p.name}</div>
                      <div className="text-slate-400">{p.age}y {p.gender}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-1.5 rounded-full bg-red-100">
                          <div className="h-full rounded-full bg-red-500" style={{ width: `${p.riskScore}%` }} />
                        </div>
                        <span className="font-semibold text-red-600">{p.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{p.lastEventType?.replace(/_/g, ' ')}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs font-semibold text-red-600">4 hrs</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Population stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Risk Distribution — Catawba County</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Critical', count: 42, pct: 13, color: '#7f1d1d', bg: '#fef2f2', sla: '4h / weekly' },
                { label: 'High', count: 87, pct: 28, color: '#ef4444', bg: '#fef2f2', sla: '12h / monthly' },
                { label: 'Moderate', count: 109, pct: 35, color: '#f59e0b', bg: '#fffbeb', sla: '24h / bi-mo.' },
                { label: 'Low', count: 74, pct: 24, color: '#22c55e', bg: '#f0fdf4', sla: '72h / as needed' },
              ].map(level => (
                <div key={level.label} className="flex items-center gap-3">
                  <div className="w-14 text-xs font-medium" style={{ color: level.color }}>{level.label}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${level.pct}%`, background: level.color }}
                    />
                  </div>
                  <div className="w-10 text-right">
                    <span className="text-xs font-semibold text-slate-700">{level.count}</span>
                  </div>
                  <div className="w-24 text-right">
                    <span className="text-[10px] text-slate-400">{level.sla}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Response SLAs (DART Protocol)</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-red-50 rounded-lg p-2.5">
                  <div className="text-sm font-bold text-red-700">4 hrs</div>
                  <div className="text-[10px] text-red-500 leading-tight">Critical (75–100) · Weekly contact</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-2.5">
                  <div className="text-sm font-bold text-orange-700">12 hrs</div>
                  <div className="text-[10px] text-orange-500 leading-tight">High (50–74) · Monthly contact</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-2.5">
                  <div className="text-sm font-bold text-amber-700">24 hrs</div>
                  <div className="text-[10px] text-amber-500 leading-tight">Moderate (25–49) · Bi-monthly</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2.5">
                  <div className="text-sm font-bold text-green-700">72 hrs</div>
                  <div className="text-[10px] text-green-500 leading-tight">Low (0–24) · As needed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Recovery Card */}
      <div className="mt-4">
        <Card className="overflow-hidden" style={{ border: '1px solid rgba(212,168,67,0.3)' }}>
          <div className="flex">
            {/* Gold accent bar */}
            <div className="w-1.5 flex-shrink-0" style={{ background: 'linear-gradient(180deg, #D4A843 0%, #c49a3a 100%)' }} />
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,168,67,0.1)' }}>
                    <DollarSign className="w-5 h-5 text-[#D4A843]" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">💰 Revenue Recovery — Peer Support Billing</div>
                    <div className="text-xs text-slate-500">Medicaid-billable encounters auto-documented by Goldie</div>
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <div className="text-xs text-slate-400 mb-0.5">Goldie ROI from billing alone</div>
                  <div className="text-2xl font-black text-[#D4A843]">4.5x</div>
                  <div className="text-xs text-slate-500">$100K/yr subscription</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-lg p-3" style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)' }}>
                  <div className="text-lg font-bold text-slate-900">62%</div>
                  <div className="text-xs text-slate-500 mt-0.5">Medicaid-eligible patients</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">~194 of 312 active</div>
                </div>
                <div className="rounded-lg p-3" style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)' }}>
                  <div className="text-lg font-bold text-slate-900">~1,200</div>
                  <div className="text-xs text-slate-500 mt-0.5">Billable encounters/month</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">H0038 / H0039 codes</div>
                </div>
                <div className="rounded-lg p-3" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <div className="text-lg font-bold text-green-700">$37,290/mo</div>
                  <div className="text-xs text-slate-500 mt-0.5">Recoverable revenue</div>
                  <div className="text-[10px] font-semibold text-green-600 mt-0.5">$447K / year</div>
                </div>
                <div className="rounded-lg p-3" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                  <div className="text-lg font-bold text-red-600">$0/mo</div>
                  <div className="text-xs text-slate-500 mt-0.5">Currently billing</div>
                  <div className="text-[10px] text-red-500 mt-0.5">Revenue being left on table</div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">
                  Goldie auto-documents peer support encounters for Medicaid billing — no additional documentation burden on your team.
                  <span className="text-[#D4A843] font-medium ml-1">Enable billing integration → </span>
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
