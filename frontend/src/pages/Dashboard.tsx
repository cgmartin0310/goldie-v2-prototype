import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Users, Activity, TrendingUp, ArrowUpRight, ArrowRight, MapPin, Clock, Building2 } from 'lucide-react';
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
const COUNTY_ZONES = [
  { name: 'Catawba',   x: 25, y: 45, intensity: 0.88, count: 312,  isMyCounty: true  },
  { name: 'Burke',     x: 17, y: 48, intensity: 0.72, count: 241,  isMyCounty: false },
  { name: 'Caldwell',  x: 15, y: 38, intensity: 0.65, count: 198,  isMyCounty: false },
  { name: 'Alexander', x: 23, y: 37, intensity: 0.58, count: 174,  isMyCounty: false },
  { name: 'Rowan',     x: 33, y: 46, intensity: 0.54, count: 161,  isMyCounty: false },
  { name: 'Cleveland', x: 22, y: 61, intensity: 0.48, count: 143,  isMyCounty: false },
  { name: 'Surry',     x: 25, y: 25, intensity: 0.42, count: 127,  isMyCounty: false },
  { name: 'Jackson',   x: 9,  y: 62, intensity: 0.35, count: 104,  isMyCounty: false },
  { name: 'Carteret',  x: 78, y: 68, intensity: 0.28, count:  87,  isMyCounty: false },
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

      {/* Goldie Network strip */}
      <div className="mb-4 rounded-xl px-4 py-3 flex items-center gap-6 text-xs"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(212,168,67,0.2)' }}>
        <div className="text-[#D4A843] font-semibold text-[11px] uppercase tracking-wider flex-shrink-0">Goldie Network</div>
        {[
          { label: 'Counties Active', value: '9 NC' },
          { label: 'Network Patients', value: '2,847' },
          { label: 'Pent-Up Revenue', value: '$192M' },
          { label: 'Provider Network', value: '100+' },
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

      <div className="grid grid-cols-5 gap-4">
        {/* County Map */}
        <Card className="col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">OD Incident Heatmap — North Carolina</CardTitle>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D4A843]" />Your County</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />High</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" />Lower</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-72 mx-5 mb-5 rounded-xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #e8edf5 0%, #dde5f0 100%)', border: '1px solid #e2e8f0' }}>

              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* NC state outline — separate SVG with viewBox for percentage-based coords */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M 5,20 L 15,15 L 30,13 L 50,12 L 70,13 L 85,15 L 93,20 L 97,30 L 95,40 L 92,48 L 96,56 L 90,67 L 83,76 L 72,81 L 60,84 L 45,87 L 30,85 L 20,81 L 12,72 L 8,58 L 6,42 L 5,30 Z"
                  fill="white"
                  stroke="#94a3b8"
                  strokeWidth="0.6"
                  fillOpacity="0.75"
                />
              </svg>

              {/* County dots */}
              {COUNTY_ZONES.map((county) => {
                const color = county.isMyCounty ? '#D4A843'
                  : county.intensity >= 0.7 ? '#ef4444'
                  : county.intensity >= 0.5 ? '#f97316'
                  : county.intensity >= 0.35 ? '#f59e0b'
                  : '#22c55e';
                const size = county.isMyCounty ? 22 : (8 + county.intensity * 16);

                return (
                  <div
                    key={county.name}
                    className="absolute group"
                    style={{
                      left: `${county.x}%`,
                      top: `${county.y}%`,
                      transform: 'translate(-50%, -50%)',
                      cursor: county.isMyCounty ? 'pointer' : 'default',
                    }}
                    onClick={() => county.isMyCounty ? navigate('/patients') : undefined}
                  >
                    {/* Pulse ring — own county + high intensity others */}
                    {(county.isMyCounty || county.intensity >= 0.7) && (
                      <div className="absolute rounded-full animate-ping opacity-25"
                        style={{ width: size * 2, height: size * 2, background: color, top: -size/2, left: -size/2 }} />
                    )}
                    {/* Main dot */}
                    <div
                      className="rounded-full border-2 border-white shadow-lg transition-transform group-hover:scale-125"
                      style={{ width: size, height: size, background: color, opacity: county.isMyCounty ? 1 : 0.80 }}
                    />
                    {/* Own county ring */}
                    {county.isMyCounty && (
                      <div className="absolute rounded-full border-2 border-[#D4A843]"
                        style={{ width: size + 8, height: size + 8, top: -4, left: -4, opacity: 0.5 }} />
                    )}
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1a1a2e] text-white text-xs px-2 py-1.5 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="font-semibold">{county.name} County {county.isMyCounty ? '⭐' : ''}</div>
                      <div className="text-white/60">{county.count} patients detected</div>
                      {county.isMyCounty && <div className="text-[#D4A843] text-[10px] mt-0.5">← Your County · Click to view</div>}
                      {!county.isMyCounty && <div className="text-white/40 text-[10px] mt-0.5">Network county — aggregate only</div>}
                    </div>
                    {/* County name label */}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-0.5 text-[9px] font-medium whitespace-nowrap ${county.isMyCounty ? 'text-[#D4A843]' : 'text-slate-600'}`}>
                      {county.name}
                    </div>
                  </div>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-3 left-3 bg-white/90 rounded-lg px-3 py-2 shadow-sm">
                <div className="text-[10px] text-slate-500 font-medium mb-1">9 COUNTIES IN GOLDIE NC NETWORK</div>
                <div className="text-xs font-bold text-slate-800">
                  <span className="text-[#D4A843]">312</span> Catawba · <span className="text-slate-400">2,535</span> network
                </div>
              </div>
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
    </div>
  );
}
