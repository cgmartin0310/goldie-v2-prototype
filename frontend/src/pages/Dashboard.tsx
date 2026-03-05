import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Users, Activity, TrendingUp, ArrowUpRight, ArrowRight, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import patients from '@/data/patients.json';

const KPI_CARDS = [
  {
    label: 'Active Patients',
    value: '2,847',
    change: '+124 this month',
    changeDir: 'up',
    icon: Users,
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    label: 'High-Risk Alerts',
    value: '42',
    change: '8 critical today',
    changeDir: 'up',
    icon: AlertTriangle,
    color: '#ef4444',
    bg: '#fef2f2',
  },
  {
    label: 'Interventions (30d)',
    value: '318',
    change: '+18% vs last month',
    changeDir: 'up',
    icon: Activity,
    color: '#D4A843',
    bg: '#fefce8',
  },
  {
    label: 'MOUD Initiation (30d)',
    value: '19.2%',
    change: 'Target: 25%',
    changeDir: 'neutral',
    icon: TrendingUp,
    color: '#22c55e',
    bg: '#f0fdf4',
  },
];

const COUNTY_ZONES = [
  { name: 'Fayette', x: 45, y: 42, intensity: 0.9, count: 847 },
  { name: 'Jefferson', x: 22, y: 38, intensity: 0.75, count: 612 },
  { name: 'Madison', x: 58, y: 50, intensity: 0.6, count: 398 },
  { name: 'Scott', x: 42, y: 28, intensity: 0.5, count: 287 },
  { name: 'Jessamine', x: 47, y: 55, intensity: 0.45, count: 243 },
  { name: 'Woodford', x: 36, y: 43, intensity: 0.4, count: 198 },
  { name: 'Clark', x: 64, y: 44, intensity: 0.35, count: 176 },
  { name: 'Anderson', x: 33, y: 52, intensity: 0.25, count: 86 },
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

  const criticalPatients = patients.filter(p => p.riskLevel === 'critical').slice(0, 5);
  const recentAlerts = patients
    .filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high')
    .slice(0, 5);

  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">County Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Fayette County + 11 surrounding counties — Real-time view</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
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
        {/* County Map */}
        <Card className="col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">OD Incident Heatmap — Central KY</CardTitle>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />High</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />Moderate</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" />Low</span>
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
                
                {/* KY state shape approximation */}
                <path
                  d="M 60,20 L 85,15 L 95,25 L 90,35 L 85,40 L 90,50 L 85,60 L 75,65 L 65,70 L 50,72 L 35,68 L 20,65 L 10,55 L 15,40 L 10,30 L 20,22 L 40,18 Z"
                  fill="white"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  fillOpacity="0.8"
                  style={{ transform: 'scale(2.8) translate(5px, 3px)' }}
                />
              </svg>

              {/* County dots */}
              {COUNTY_ZONES.map((county) => {
                const color = county.intensity >= 0.8 ? '#ef4444'
                  : county.intensity >= 0.6 ? '#f97316'
                  : county.intensity >= 0.4 ? '#f59e0b'
                  : '#22c55e';
                const size = 8 + county.intensity * 20;

                return (
                  <div
                    key={county.name}
                    className="absolute cursor-pointer group"
                    style={{ left: `${county.x}%`, top: `${county.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    {/* Pulse ring */}
                    {county.intensity >= 0.7 && (
                      <div className="absolute rounded-full animate-ping opacity-30"
                        style={{ width: size * 2, height: size * 2, background: color, top: -size/2, left: -size/2 }} />
                    )}
                    {/* Main dot */}
                    <div
                      className="rounded-full border-2 border-white shadow-lg transition-transform hover:scale-125"
                      style={{ width: size, height: size, background: color, opacity: 0.85 }}
                    />
                    {/* Label */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1a1a2e] text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="font-medium">{county.name} Co.</div>
                      <div className="text-white/60">{county.count} patients</div>
                    </div>
                    {/* County name */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 text-[9px] text-slate-600 font-medium whitespace-nowrap">
                      {county.name}
                    </div>
                  </div>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-3 left-3 bg-white/90 rounded-lg px-3 py-2 shadow-sm">
                <div className="text-[10px] text-slate-500 font-medium mb-1">12 COUNTIES MONITORED</div>
                <div className="text-xs font-bold text-slate-800">2,847 active patients</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert Feed */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Critical Alerts</CardTitle>
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
                      {patient.lastEventType?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} · {patient.age}y {patient.gender} · {patient.county}
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
              <CardTitle className="text-sm">Critical Risk Patients</CardTitle>
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
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">County</th>
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
                      <div className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3 h-3" />
                        <span>{p.county}</span>
                      </div>
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
            <CardTitle className="text-sm">Risk Distribution — All Counties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Critical', count: 312, pct: 11, color: '#7f1d1d', bg: '#fef2f2' },
                { label: 'High', count: 687, pct: 24, color: '#ef4444', bg: '#fef2f2' },
                { label: 'Moderate', count: 924, pct: 32, color: '#f59e0b', bg: '#fffbeb' },
                { label: 'Low', count: 924, pct: 33, color: '#22c55e', bg: '#f0fdf4' },
              ].map(level => (
                <div key={level.label} className="flex items-center gap-3">
                  <div className="w-16 text-xs font-medium" style={{ color: level.color }}>{level.label}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${level.pct}%`, background: level.color }}
                    />
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-xs font-semibold text-slate-700">{level.count.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 ml-1">({level.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-lg font-bold text-green-700">68%</div>
                <div className="text-xs text-green-600 leading-tight">High-risk pts with MAT within 72h had no repeat OD at 6 months</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-lg font-bold text-blue-700">$4.2M</div>
                <div className="text-xs text-blue-600 leading-tight">Estimated ED visit cost avoidance this quarter</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
