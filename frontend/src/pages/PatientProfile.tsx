import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, AlertTriangle, User, MapPin, Pill, Home, Shield,
  ChevronRight, Activity, Calendar, Zap, ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CareStreamViz from '@/components/CareStreamViz';
import DartPanel from '@/components/DartPanel';
import patients from '@/data/patients.json';
import heapEvents from '@/data/heap-events.json';
import type { HeapEvent, TimelineEvent } from '@/lib/carestream';

export default function PatientProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'carestream' | 'dart' | 'plan'>('carestream');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Patient not found</p>
        <Button variant="outline" onClick={() => navigate('/patients')} className="mt-4">Back to Patients</Button>
      </div>
    );
  }

  const riskColor = patient.riskLevel === 'critical' ? '#7f1d1d' : patient.riskLevel === 'high' ? '#ef4444' : patient.riskLevel === 'moderate' ? '#f59e0b' : '#22c55e';
  const riskBg = patient.riskLevel === 'critical' ? '#fef2f2' : patient.riskLevel === 'high' ? '#fef2f2' : patient.riskLevel === 'moderate' ? '#fffbeb' : '#f0fdf4';

  const patientEvents = (heapEvents as HeapEvent[]).filter(e => e.patientId === id);
  const criticalEvents = patientEvents.filter(e => e.severity === 'critical');
  const todayEvent = patientEvents.find(e => e.isToday);

  const tabs = [
    { id: 'carestream', label: 'Carestream™', icon: Activity },
    { id: 'dart', label: 'DART Assessment', icon: Shield },
    { id: 'plan', label: 'Service Plan', icon: Zap },
  ] as const;

  return (
    <div className="flex flex-col min-h-full">
      {/* Top bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="w-px h-5 bg-slate-200" />

          {/* Patient identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: riskColor }}>
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900">{patient.name}</h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase text-white"
                  style={{ background: riskColor }}>
                  {patient.riskLevel}
                </span>
                <span className="text-xs font-mono text-slate-400">{patient.id}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                <span>{patient.age}y {patient.gender}</span>
                <span>·</span>
                <span>{patient.race}</span>
                <span>·</span>
                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{patient.county} County</span>
                <span>·</span>
                <span className="flex items-center gap-0.5"><Home className="w-3 h-3" />{patient.housing?.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          {/* Risk score prominently */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400">DART Score</div>
              <div className="text-2xl font-bold" style={{ color: riskColor }}>{patient.riskScore}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">AI Score</div>
              <div className="text-2xl font-bold text-slate-700">{patient.aiRiskScore}</div>
            </div>
            <Button onClick={() => { setActiveTab('dart'); }}>
              Run Assessment
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Alerts banner */}
      {todayEvent && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-800 font-medium">{todayEvent.title}</span>
          <span className="text-xs text-red-600">{todayEvent.description}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="px-6 border-b border-slate-200 bg-white flex-shrink-0">
        <div className="flex gap-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#D4A843] text-[#1a1a2e]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'carestream' && (
          <div className="p-6">
            {/* Carestream header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4A843]" />
                  CARESTREAM™ — Patient Health Timeline
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {patientEvents.length} events across {new Set(patientEvents.map(e => e.domain)).size} domains · 
                  {' '}{criticalEvents.length} critical events · Hover events for detail · Hover timeline for PHS slice
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                {(['SUD', 'Mental Health', 'Social', 'Medical'] as const).map(d => (
                  <span key={d} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{
                      background: d === 'SUD' ? '#ef4444' : d === 'Mental Health' ? '#8b5cf6' : d === 'Social' ? '#f97316' : '#3b82f6'
                    }} />
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* THE CARESTREAM */}
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <CareStreamViz
                  events={heapEvents as HeapEvent[]}
                  patientId={id!}
                  onEventClick={setSelectedEvent}
                />
              </CardContent>
            </Card>

            {/* Event detail panel */}
            {selectedEvent && (
              <Card className="mt-4 border-l-4 animate-fade-in"
                style={{ borderLeftColor: selectedEvent.severity === 'critical' ? '#ef4444' : '#f59e0b' }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase text-white`}
                          style={{ background: selectedEvent.severity === 'critical' ? '#ef4444' : selectedEvent.severity === 'high' ? '#f97316' : '#f59e0b' }}>
                          {selectedEvent.severity}
                        </span>
                        <span className="text-sm text-slate-400">{selectedEvent.domain}</span>
                        <span className="text-sm text-slate-300">·</span>
                        <span className="text-sm text-slate-400">{new Date(selectedEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900">{selectedEvent.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{selectedEvent.description}</p>
                      {selectedEvent.location && <p className="text-xs text-slate-400 mt-1">📍 {selectedEvent.location}</p>}
                      {selectedEvent.source && <p className="text-xs text-slate-400">Source: {selectedEvent.source}</p>}
                    </div>
                    <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600 text-lg ml-4">×</button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Event timeline list */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Full Event History ({patientEvents.length} events)</h3>
              <div className="space-y-2">
                {[...patientEvents].reverse().map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedEvent({ ...evt, timestamp: new Date(evt.date).getTime(), x: 0 })}
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: evt.severity === 'critical' ? '#ef4444' : evt.severity === 'high' ? '#f97316' : evt.severity === 'moderate' ? '#f59e0b' : '#22c55e' }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-700">{evt.title}</span>
                        <span className="text-xs text-slate-400">{new Date(evt.date).toLocaleDateString()}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded text-white text-[10px]"
                          style={{ background: evt.domain === 'SUD' ? '#ef4444' : evt.domain === 'Mental Health' ? '#8b5cf6' : evt.domain === 'Social' ? '#f97316' : '#3b82f6' }}>
                          {evt.domain}
                        </span>
                        {evt.isToday && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">TODAY</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{evt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dart' && (
          <DartPanel patient={patient} onGeneratePlan={() => setActiveTab('plan')} />
        )}

        {activeTab === 'plan' && (
          <ServicePlanView patient={patient} />
        )}
      </div>
    </div>
  );
}

// Inline service plan view
function ServicePlanView({ patient }: { patient: typeof patients[0] }) {
  const [accepted, setAccepted] = useState(false);

  const interventions = [
    {
      priority: 'immediate',
      color: '#ef4444',
      emoji: '🔴',
      title: 'Peer Support Specialist Assignment',
      description: 'Assign dedicated peer specialist (Tanya Williams has prior relationship). Daily check-ins for first 2 weeks post-discharge.',
      provider: 'Foothills Recovery Resources — Peer Support',
      timeline: 'Today — before discharge',
      rationale: 'MAT discontinuation pattern (2x) suggests engagement barriers. Prior relationship with Tanya Williams is a key asset for re-engagement.',
    },
    {
      priority: 'immediate',
      color: '#ef4444',
      emoji: '🔴',
      title: 'MAT Initiation — Buprenorphine Induction',
      description: 'ED-based buprenorphine (Suboxone) induction at CVMC. Begin with 4mg, titrate to 16mg/day. Bridge script for 7 days. Warm handoff to Catawba Recovery Center.',
      provider: 'Catawba Valley Medical Center ED / Catawba Recovery Center',
      timeline: 'Today — while in ED',
      rationale: 'Post-incarceration tolerance gap + 4th OD = critical window for MAT initiation. ED-MOUD shown to increase 30-day engagement 3.5x.',
    },
    {
      priority: 'immediate',
      color: '#ef4444',
      emoji: '🔴',
      title: 'Naloxone Kit Distribution + Training',
      description: 'Issue take-home naloxone kit (2x 4mg intranasal Narcan) before ED discharge. Bystander training for shelter staff.',
      provider: 'ED Pharmacy / Catawba County Public Health',
      timeline: 'Today — before discharge',
      rationale: 'Poly-substance use (fentanyl + benzos) significantly delays Narcan reversal. Shelter staff and household contacts need training.',
    },
    {
      priority: 'urgent',
      color: '#f97316',
      emoji: '🟡',
      title: 'Housing Navigation Referral',
      description: 'Emergency shelter stabilization at Hickory Rescue Mission + bridge to transitional housing. Current shelter placement is precarious.',
      provider: 'Catawba County Social Services — Housing Navigation',
      timeline: 'Within 48 hours',
      rationale: 'Housing instability is a key driver of relapse. Shelter placement protects against street-level fentanyl exposure.',
    },
    {
      priority: 'short_term',
      color: '#22c55e',
      emoji: '🟢',
      title: 'Behavioral Health Counseling',
      description: 'Refer to co-occurring disorder counseling for depression + SUD. Target weekly sessions for first 60 days.',
      provider: 'Daymark Recovery Services — Hickory',
      timeline: 'Within 2 weeks',
      rationale: 'PHQ-9 depression history (score 16) + prior suicidal ideation. Co-occurring BH treatment increases MAT retention rates by 40%.',
    },
    {
      priority: 'short_term',
      color: '#22c55e',
      emoji: '🟢',
      title: 'Hepatitis C Treatment Coordination',
      description: 'Re-refer to hepatology at CVMC. Hep C treatment (Harvoni/Epclusa) can be initiated alongside MAT. Liver enzymes elevated.',
      provider: 'Catawba Valley Medical Center + Catawba Co. Public Health',
      timeline: 'Within 3 weeks',
      rationale: 'Elevated liver enzymes (ALT 145) indicate progression. Direct-acting antivirals are highly effective and can run concurrent with MAT.',
    },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">AI-Generated Service Plan</h2>
          <p className="text-xs text-slate-500 mt-0.5">Based on DART risk vector + ASAM criteria + available providers</p>
        </div>
        {!accepted ? (
          <Button onClick={() => setAccepted(true)} className="gap-2">
            <Shield className="w-4 h-4" />
            Accept Plan & Assign Providers
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
            <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span>
            Plan Accepted — Care Team Notified
          </div>
        )}
      </div>

      {accepted && (
        <Card className="mb-4 border-green-200 bg-green-50 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <Activity className="w-4 h-4" />
              <span className="font-medium text-sm">Care plan activated. Events are now flowing back to the CARESTREAM™ timeline.</span>
            </div>
            <p className="text-xs text-green-600 mt-1">Each completed intervention will be logged as a HEAP event, updating the patient's risk score in real-time.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {interventions.map((intervention, i) => (
          <Card key={i} className={`border-l-4 ${accepted ? 'opacity-100' : ''}`}
            style={{ borderLeftColor: intervention.color }}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{intervention.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm text-slate-900">{intervention.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase"
                      style={{ background: intervention.color + '20', color: intervention.color }}>
                      {intervention.priority.replace(/_/g, ' ')}
                    </span>
                    {accepted && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Assigned</span>}
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{intervention.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      {intervention.provider}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {intervention.timeline}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 italic">{intervention.rationale}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
