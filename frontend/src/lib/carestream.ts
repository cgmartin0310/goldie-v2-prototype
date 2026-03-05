// Carestream derivation logic
// Transforms HEAP events into Patient Health Timeline (PHT) and Patient Health State (PHS)
// Based on the CARESTREAM patent architecture

export type Domain = 'SUD' | 'Mental Health' | 'Social' | 'Medical';
export type Severity = 'low' | 'moderate' | 'high' | 'critical';

export interface HeapEvent {
  id: string;
  patientId: string;
  date: string;
  domain: Domain;
  eventType: string;
  severity: Severity;
  title: string;
  description: string;
  location?: string;
  source?: string;
  substances?: string[];
  dangerousCombo?: boolean;
  naluResponsed?: boolean;
  isToday?: boolean;
}

export interface TimelineEvent extends HeapEvent {
  x: number;         // pixel x position on timeline
  timestamp: number; // unix ms
}

export interface DomainTimeline {
  domain: Domain;
  events: TimelineEvent[];
  color: string;
  icon: string;
}

export interface PatientHealthState {
  timestamp: number;
  date: string;
  events: Record<Domain, TimelineEvent | null>;
  riskLevel: Severity;
}

export interface CareStreamData {
  patientId: string;
  timelines: DomainTimeline[];
  startDate: Date;
  endDate: Date;
  phs: (timestamp: number) => PatientHealthState;
}

export const DOMAIN_CONFIG: Record<Domain, { color: string; trackColor: string; icon: string; row: number }> = {
  'SUD': { color: '#ef4444', trackColor: '#fee2e2', icon: '🔴', row: 0 },
  'Mental Health': { color: '#8b5cf6', trackColor: '#ede9fe', icon: '🟣', row: 1 },
  'Social': { color: '#f97316', trackColor: '#ffedd5', icon: '🟠', row: 2 },
  'Medical': { color: '#3b82f6', trackColor: '#dbeafe', icon: '🔵', row: 3 },
};

export const SEVERITY_CONFIG: Record<Severity, { fill: string; stroke: string; size: number }> = {
  'low': { fill: '#22c55e', stroke: '#16a34a', size: 8 },
  'moderate': { fill: '#f59e0b', stroke: '#d97706', size: 10 },
  'high': { fill: '#ef4444', stroke: '#dc2626', size: 12 },
  'critical': { fill: '#7f1d1d', stroke: '#991b1b', size: 14 },
};

export function buildCareStream(events: HeapEvent[], patientId: string): CareStreamData {
  const patientEvents = events.filter(e => e.patientId === patientId);
  
  if (patientEvents.length === 0) {
    const now = new Date();
    return {
      patientId,
      timelines: [],
      startDate: now,
      endDate: now,
      phs: () => ({ timestamp: Date.now(), date: '', events: { SUD: null, 'Mental Health': null, Social: null, Medical: null }, riskLevel: 'low' }),
    };
  }

  const timestamps = patientEvents.map(e => new Date(e.date).getTime());
  const minTs = Math.min(...timestamps);
  const maxTs = Math.max(...timestamps);
  
  // Add some padding
  const padding = (maxTs - minTs) * 0.05;
  const startDate = new Date(minTs - padding - 30 * 24 * 60 * 60 * 1000);
  const endDate = new Date(maxTs + padding + 10 * 24 * 60 * 60 * 1000);
  
  const totalRange = endDate.getTime() - startDate.getTime();

  const domains: Domain[] = ['SUD', 'Mental Health', 'Social', 'Medical'];
  
  const timelines: DomainTimeline[] = domains.map(domain => {
    const domainEvents = patientEvents
      .filter(e => e.domain === domain)
      .map(e => ({
        ...e,
        timestamp: new Date(e.date).getTime(),
        x: ((new Date(e.date).getTime() - startDate.getTime()) / totalRange) * 100,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    return {
      domain,
      events: domainEvents,
      color: DOMAIN_CONFIG[domain].color,
      icon: DOMAIN_CONFIG[domain].icon,
    };
  });

  const phs = (timestamp: number): PatientHealthState => {
    const state: Record<Domain, TimelineEvent | null> = {
      SUD: null,
      'Mental Health': null,
      Social: null,
      Medical: null,
    };

    for (const timeline of timelines) {
      const eventsBeforeTs = timeline.events.filter(e => e.timestamp <= timestamp);
      if (eventsBeforeTs.length > 0) {
        state[timeline.domain] = eventsBeforeTs[eventsBeforeTs.length - 1];
      }
    }

    // Compute risk level from active states
    const allEvents = Object.values(state).filter(Boolean) as TimelineEvent[];
    let riskLevel: Severity = 'low';
    for (const event of allEvents) {
      if (event.severity === 'critical') { riskLevel = 'critical'; break; }
      if (event.severity === 'high') riskLevel = 'high';
      else if (event.severity === 'moderate' && riskLevel === 'low') riskLevel = 'moderate';
    }

    return {
      timestamp,
      date: new Date(timestamp).toLocaleDateString(),
      events: state,
      riskLevel,
    };
  };

  return { patientId, timelines, startDate, endDate, phs };
}

export function getEventTypeLabel(eventType: string): string {
  const labels: Record<string, string> = {
    overdose: 'Overdose',
    detox: 'Detox',
    mat_start: 'MAT Start',
    mat_discontinue: 'MAT Stop',
    assessment: 'Assessment',
    crisis: 'Crisis Eval',
    housing_loss: 'Lost Housing',
    housing_gain: 'Housing Gain',
    justice: 'Incarceration',
    release: 'Release',
    lab: 'Lab Results',
    diagnosis: 'New Diagnosis',
    ed_visit: 'ED Visit',
    ems_call: 'EMS Call',
    outreach: 'Outreach',
    counseling: 'Counseling',
    mat_checkin: 'MAT Check-in',
  };
  return labels[eventType] || eventType;
}
