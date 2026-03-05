import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, ArrowRight, AlertTriangle, Clock, Zap, FileText, Ambulance, Building2, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DEMO_COUNTY = 'Catawba';

interface IncomingEvent {
  id: string;
  type: 'ems' | 'ed' | 'detox' | 'jail';
  timestamp: string;
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  county: string;
  eventDescription: string;
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  isNew?: boolean;
  substances?: string[];
  narcanAdministered?: boolean;
  source: string;
}

const INITIAL_EVENTS: IncomingEvent[] = [
  {
    id: 'ev-live-001',
    type: 'ems',
    timestamp: '2026-03-05T14:32:00Z',
    patientName: 'Marcus Johnson',
    patientId: 'patient-001',
    age: 34,
    gender: 'M',
    county: 'Catawba',
    eventDescription: 'Overdose — Narcan ×2 administered. Fentanyl + benzo suspected. Unresponsive on scene. Transported to Catawba Valley Medical Center ED.',
    riskScore: 78,
    riskLevel: 'critical',
    isNew: true,
    substances: ['Fentanyl', 'Benzodiazepines'],
    narcanAdministered: true,
    source: 'EMS ePCR #2026-1842',
  },
  {
    id: 'ev-live-002',
    type: 'ems',
    timestamp: '2026-03-05T11:20:00Z',
    patientName: 'Carlos Mendez',
    patientId: 'patient-009',
    age: 45,
    gender: 'M',
    county: 'Catawba',
    eventDescription: 'ED arrival via EMS. Poly-substance OD — fentanyl + meth + benzos. 3rd overdose this year. Narcan ×3 administered.',
    riskScore: 76,
    riskLevel: 'critical',
    isNew: true,
    substances: ['Fentanyl', 'Methamphetamine', 'Benzodiazepines'],
    narcanAdministered: true,
    source: 'Hospital ADT — CVMC',
  },
  {
    id: 'ev-live-003',
    type: 'ems',
    timestamp: '2026-03-05T06:15:00Z',
    patientName: 'Emily Davis',
    patientId: 'patient-012',
    age: 21,
    gender: 'F',
    county: 'Catawba',
    eventDescription: 'OD #2 — Fentanyl. Parents called 911. Narcan administered by first responders. Transported to CVMC. No prior SUD treatment.',
    riskScore: 65,
    riskLevel: 'high',
    isNew: true,
    substances: ['Fentanyl'],
    narcanAdministered: true,
    source: 'Hospital ADT — CVMC',
  },
  {
    id: 'ev-live-004',
    type: 'ems',
    timestamp: '2026-03-04T22:10:00Z',
    patientName: 'Ashley Reed',
    patientId: 'patient-013',
    age: 29,
    gender: 'F',
    county: 'Catawba',
    eventDescription: 'OD #3 while PREGNANT (14 wks). Fentanyl + meth. Narcan ×2. Fetal monitoring initiated en route. Transported to CVMC OB emergency.',
    riskScore: 85,
    riskLevel: 'critical',
    substances: ['Fentanyl', 'Methamphetamine'],
    narcanAdministered: true,
    source: 'EMS ePCR #2026-1831',
  },
  {
    id: 'ev-live-005',
    type: 'ed',
    timestamp: '2026-03-04T15:45:00Z',
    patientName: 'Patricia Jones',
    patientId: 'patient-010',
    age: 52,
    gender: 'F',
    county: 'Catawba',
    eventDescription: 'Crisis evaluation at Daymark. Suicidal ideation. Poly-substance use disclosed — Rx opioids + benzos. Safety plan completed.',
    riskScore: 58,
    riskLevel: 'high',
    substances: ['Rx Opioids', 'Benzodiazepines'],
    source: 'Daymark Crisis Line',
  },
  {
    id: 'ev-live-006',
    type: 'ed',
    timestamp: '2026-03-04T09:15:00Z',
    patientName: 'Sarah Mitchell',
    patientId: 'patient-002',
    age: 28,
    gender: 'F',
    county: 'Catawba',
    eventDescription: 'ED evaluation post-OD. Stable. Patient declined MAT referral at discharge. Prior OD June 2025. Discharged AMA.',
    riskScore: 62,
    riskLevel: 'high',
    substances: ['Fentanyl', 'Methamphetamine'],
    narcanAdministered: true,
    source: 'Hospital ADT — CVMC',
  },
  {
    id: 'ev-live-007',
    type: 'jail',
    timestamp: '2026-03-03T08:00:00Z',
    patientName: 'Michael Brooks',
    patientId: 'patient-007',
    age: 38,
    gender: 'M',
    county: 'Catawba',
    eventDescription: 'Released from CCDC after 22-day sentence. MAT prescription not bridged at release. HIGH RISK window. No naloxone issued.',
    riskScore: 35,
    riskLevel: 'moderate',
    source: 'Justice System Integration — CCDC',
  },
];

const NEW_EVENT: IncomingEvent = {
  id: 'ev-live-new',
  type: 'ems',
  timestamp: new Date().toISOString(),
  patientName: 'Robert Williams',
  patientId: 'patient-005',
  age: 55,
  gender: 'M',
  county: 'Catawba',
  eventDescription: 'OD #5 — Fentanyl + Xylazine (Tranq). Multiple Narcan doses with delayed reversal due to xylazine component. Transported to CVMC ED.',
  riskScore: 85,
  riskLevel: 'critical',
  isNew: true,
  substances: ['Fentanyl', 'Xylazine (Tranq)'],
  narcanAdministered: true,
  source: 'EMS ePCR #2026-1848',
};

function formatRelative(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return new Date(isoString).toLocaleDateString();
}

function EventTypeIcon({ type }: { type: string }) {
  const config: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    ems: { icon: <Ambulance className="w-3.5 h-3.5" />, color: '#ef4444', label: 'EMS' },
    ed: { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: '#f97316', label: 'ED' },
    detox: { icon: <Zap className="w-3.5 h-3.5" />, color: '#8b5cf6', label: 'Crisis' },
    jail: { icon: <FileText className="w-3.5 h-3.5" />, color: '#3b82f6', label: 'Justice' },
  };
  const c = config[type] || config.ems;
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-medium" style={{ background: c.color }}>
      {c.icon}
      <span>{c.label}</span>
    </div>
  );
}

const SLA: Record<string, string> = {
  critical: '4-hr response',
  high: '12-hr response',
  moderate: '24-hr response',
  low: '72-hr response',
};

export default function DetectionFeed() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<IncomingEvent[]>(INITIAL_EVENTS);
  const [streamActive, setStreamActive] = useState(true);

  useEffect(() => {
    if (!streamActive) return;
    const timer = setTimeout(() => {
      setEvents(prev => [{ ...NEW_EVENT, isNew: true }, ...prev]);
    }, 3000);
    return () => clearTimeout(timer);
  }, [streamActive]);

  const handleOpenPatient = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  return (
    <div className="p-6 max-w-screen-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-5 h-5 text-[#D4A843]" />
            <h1 className="text-xl font-bold text-slate-900">Detection Feed</h1>
            {streamActive && (
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium px-2 py-0.5 bg-green-50 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Building2 className="w-3.5 h-3.5 text-[#D4A843]" />
            <span className="font-medium text-slate-700">Catawba County</span>
            <span className="text-slate-300">·</span>
            <span>EMS ePCR, CVMC ADT, CCDC Justice — auto-scored by DART™</span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400 ml-1 px-2 py-0.5 bg-slate-100 rounded-full">
              <Lock className="w-2.5 h-2.5" />
              County-only events
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Events today</div>
            <div className="text-xl font-bold text-slate-900">{events.length}</div>
          </div>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              streamActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
            onClick={() => setStreamActive(!streamActive)}
          >
            {streamActive ? '⏸ Pause Stream' : '▶ Resume Stream'}
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Critical', count: events.filter(e => e.riskLevel === 'critical').length, color: '#ef4444', bg: '#fef2f2' },
          { label: 'High Risk', count: events.filter(e => e.riskLevel === 'high').length, color: '#f97316', bg: '#fff7ed' },
          { label: 'Narcan Used', count: events.filter(e => e.narcanAdministered).length, color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'DART Scored', count: events.length, color: '#D4A843', bg: '#fefce8' },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0"
                style={{ background: stat.bg, color: stat.color }}>
                {stat.count}
              </div>
              <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Event Stream */}
      <div className="space-y-3">
        {events.map((event, i) => (
          <div
            key={event.id}
            className={`bg-white rounded-xl border transition-all hover:shadow-md ${
              event.isNew && i === 0 ? 'animate-slide-in border-l-4' : 'border-slate-200'
            }`}
            style={event.isNew && i === 0 ? { borderLeftColor: '#ef4444' } : {}}
          >
            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* Risk score */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white font-bold ${
                    event.riskLevel === 'critical' ? 'bg-red-500' :
                    event.riskLevel === 'high' ? 'bg-orange-400' :
                    event.riskLevel === 'moderate' ? 'bg-amber-400' : 'bg-green-500'
                  }`}>
                    <span className="text-lg leading-none">{event.riskScore}</span>
                    <span className="text-[8px] uppercase font-medium opacity-80">DART</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {event.isNew && i === 0 && (
                      <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">NEW</span>
                    )}
                    <EventTypeIcon type={event.type} />
                    <span className="text-sm font-bold text-slate-900">{event.patientName}</span>
                    <span className="text-xs text-slate-400">{event.age}y {event.gender} · Catawba Co.</span>
                    {event.narcanAdministered && (
                      <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">Narcan Administered</span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      event.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                      event.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                      event.riskLevel === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>{event.riskLevel}</span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-2">{event.eventDescription}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {event.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelative(event.timestamp)}
                    </span>
                    {event.substances && (
                      <span>{event.substances.join(' + ')}</span>
                    )}
                    <span className={`font-semibold ${
                      event.riskLevel === 'critical' ? 'text-red-600' :
                      event.riskLevel === 'high' ? 'text-orange-600' : 'text-slate-500'
                    }`}>
                      SLA: {SLA[event.riskLevel]}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <Button
                  size="sm"
                  onClick={() => handleOpenPatient(event.patientId)}
                  className="flex-shrink-0 gap-1.5"
                >
                  Open Profile
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-lg text-xs text-[#D4A843]/80 text-center">
        Catawba County data only — events stream from EMS ePCR, CVMC ADT, CCDC Justice System, and Daymark Crisis integrations.
        Each event triggers automatic DART scoring. Network county data is available in Analytics (aggregate only).
      </div>
    </div>
  );
}
