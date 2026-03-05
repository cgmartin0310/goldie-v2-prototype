import React, { useRef, useState, useEffect, useCallback } from 'react';
import { buildCareStream, DOMAIN_CONFIG, SEVERITY_CONFIG, getEventTypeLabel, type HeapEvent, type Domain, type TimelineEvent } from '@/lib/carestream';

interface CareStreamVizProps {
  events: HeapEvent[];
  patientId: string;
  onEventClick?: (event: TimelineEvent) => void;
}

const TRACK_HEIGHT = 80;
const TRACK_PADDING = 20;
const LABEL_WIDTH = 130;
const TOP_PADDING = 48;
const BOTTOM_PADDING = 32;
const DOMAINS: Domain[] = ['SUD', 'Mental Health', 'Social', 'Medical'];

function getEventY(domainIndex: number): number {
  return TOP_PADDING + domainIndex * (TRACK_HEIGHT + TRACK_PADDING) + TRACK_HEIGHT / 2;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export default function CareStreamViz({ events, patientId, onEventClick }: CareStreamVizProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(900);
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; event: TimelineEvent } | null>(null);
  const [animated, setAnimated] = useState(false);

  const carestream = buildCareStream(events, patientId);
  const totalHeight = TOP_PADDING + DOMAINS.length * (TRACK_HEIGHT + TRACK_PADDING) + BOTTOM_PADDING;
  const plotWidth = width - LABEL_WIDTH - 20;

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  const tsToX = useCallback((ts: number): number => {
    const range = carestream.endDate.getTime() - carestream.startDate.getTime();
    return LABEL_WIDTH + ((ts - carestream.startDate.getTime()) / range) * plotWidth;
  }, [carestream.startDate, carestream.endDate, plotWidth]);

  const xToTs = useCallback((x: number): number => {
    const range = carestream.endDate.getTime() - carestream.startDate.getTime();
    return carestream.startDate.getTime() + ((x - LABEL_WIDTH) / plotWidth) * range;
  }, [carestream.startDate, carestream.endDate, plotWidth]);

  // Time axis ticks
  const ticks: Date[] = [];
  const start = carestream.startDate;
  const end = carestream.endDate;
  const cur = new Date(start);
  cur.setDate(1);
  cur.setMonth(cur.getMonth() + 1);
  while (cur <= end) {
    ticks.push(new Date(cur));
    cur.setMonth(cur.getMonth() + 1);
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const svgX = e.clientX - rect.left;
    if (svgX >= LABEL_WIDTH) {
      setHoverX(svgX);
    }
  };

  const handleMouseLeave = () => {
    setHoverX(null);
    setTooltip(null);
    setHoveredEvent(null);
  };

  const handleEventHover = (e: React.MouseEvent, event: TimelineEvent, domainIndex: number) => {
    e.stopPropagation();
    setHoveredEvent(event);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({
        x: event.x / 100 * plotWidth + LABEL_WIDTH,
        y: getEventY(domainIndex),
        event,
      });
    }
  };

  const todayX = tsToX(new Date('2026-03-05').getTime());

  return (
    <div ref={containerRef} className="w-full relative">
      <svg
        ref={svgRef}
        width="100%"
        height={totalHeight}
        viewBox={`0 0 ${width} ${totalHeight}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cursor-crosshair select-none"
        style={{ fontFamily: 'inherit' }}
      >
        {/* Background */}
        <rect width={width} height={totalHeight} fill="#fafbfc" rx="8" />

        {/* Domain tracks */}
        {DOMAINS.map((domain, di) => {
          const y = TOP_PADDING + di * (TRACK_HEIGHT + TRACK_PADDING);
          const cfg = DOMAIN_CONFIG[domain];
          return (
            <g key={domain}>
              {/* Track bg */}
              <rect
                x={LABEL_WIDTH}
                y={y}
                width={plotWidth}
                height={TRACK_HEIGHT}
                fill={cfg.trackColor}
                fillOpacity={0.4}
                rx={4}
              />
              {/* Domain label */}
              <rect x={0} y={y} width={LABEL_WIDTH - 8} height={TRACK_HEIGHT} fill="white" rx={4} />
              <rect x={0} y={y} width={3} height={TRACK_HEIGHT} fill={cfg.color} rx={1} />
              <text
                x={12}
                y={y + TRACK_HEIGHT / 2 - 6}
                fill={cfg.color}
                fontSize={11}
                fontWeight="700"
                dominantBaseline="middle"
              >
                {domain.toUpperCase()}
              </text>
              <text
                x={12}
                y={y + TRACK_HEIGHT / 2 + 10}
                fill="#94a3b8"
                fontSize={9}
              >
                {carestream.timelines.find(t => t.domain === domain)?.events.length || 0} events
              </text>
            </g>
          );
        })}

        {/* Time axis */}
        {ticks.map((tick, i) => {
          const x = tsToX(tick.getTime());
          if (x < LABEL_WIDTH || x > width - 10) return null;
          return (
            <g key={i}>
              <line x1={x} y1={TOP_PADDING - 2} x2={x} y2={totalHeight - BOTTOM_PADDING} stroke="#e2e8f0" strokeWidth={1} />
              <text x={x} y={TOP_PADDING - 8} fill="#94a3b8" fontSize={9} textAnchor="middle">
                {formatDate(tick)}
              </text>
            </g>
          );
        })}

        {/* Today line */}
        {todayX > LABEL_WIDTH && (
          <g>
            <line
              x1={todayX} y1={TOP_PADDING - 4}
              x2={todayX} y2={totalHeight - BOTTOM_PADDING}
              stroke="#ef4444" strokeWidth={2} strokeDasharray="4,3"
            />
            <rect x={todayX - 16} y={4} width={32} height={16} rx={8} fill="#ef4444" />
            <text x={todayX} y={14} fill="white" fontSize={8} textAnchor="middle" fontWeight="700" dominantBaseline="middle">TODAY</text>
          </g>
        )}

        {/* Event connections (lines within each domain) */}
        {carestream.timelines.map((timeline, di) => {
          const y = getEventY(di);
          const events = timeline.events;
          if (events.length < 2) return null;

          const pathParts: string[] = [];
          events.forEach((evt, i) => {
            const x = tsToX(evt.timestamp);
            if (i === 0) pathParts.push(`M ${x} ${y}`);
            else pathParts.push(`L ${x} ${y}`);
          });

          return (
            <path
              key={`line-${di}`}
              d={pathParts.join(' ')}
              stroke={DOMAIN_CONFIG[timeline.domain].color}
              strokeWidth={1.5}
              fill="none"
              strokeOpacity={0.4}
              strokeDasharray={animated ? undefined : '1000'}
              style={animated ? {} : { strokeDashoffset: 1000, transition: 'stroke-dashoffset 2s ease-out' }}
            />
          );
        })}

        {/* Events */}
        {carestream.timelines.map((timeline, di) => {
          const trackY = getEventY(di);
          return timeline.events.map((evt) => {
            const x = tsToX(evt.timestamp);
            const sev = SEVERITY_CONFIG[evt.severity];
            const isHovered = hoveredEvent?.id === evt.id;
            const size = isHovered ? sev.size + 4 : sev.size;
            const isToday = evt.isToday;

            return (
              <g
                key={evt.id}
                className="cursor-pointer"
                onMouseEnter={(e) => handleEventHover(e, evt, di)}
                onMouseLeave={() => { setHoveredEvent(null); setTooltip(null); }}
                onClick={() => onEventClick?.(evt)}
              >
                {/* Pulse ring for critical/today */}
                {(evt.severity === 'critical' || isToday) && animated && (
                  <circle
                    cx={x}
                    cy={trackY}
                    r={size + 6}
                    fill={sev.fill}
                    fillOpacity={0.15}
                    stroke={sev.stroke}
                    strokeOpacity={0.3}
                    strokeWidth={1}
                  />
                )}
                {/* Main circle */}
                <circle
                  cx={x}
                  cy={trackY}
                  r={size / 2}
                  fill={sev.fill}
                  stroke={isHovered ? '#1a1a2e' : sev.stroke}
                  strokeWidth={isHovered ? 2 : 1.5}
                  opacity={animated ? 1 : 0}
                  style={{ transition: 'r 0.15s ease, opacity 0.5s ease' }}
                />
                {/* Today star marker */}
                {isToday && (
                  <text x={x} y={trackY} fill="white" fontSize={8} textAnchor="middle" dominantBaseline="middle" fontWeight="900">!</text>
                )}
                {/* Mini label under dot */}
                {isHovered && (
                  <text
                    x={x}
                    y={trackY + size / 2 + 10}
                    fill={DOMAIN_CONFIG[timeline.domain].color}
                    fontSize={8}
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {getEventTypeLabel(evt.eventType)}
                  </text>
                )}
              </g>
            );
          });
        })}

        {/* Hover vertical line (PHS slice) */}
        {hoverX !== null && hoverX > LABEL_WIDTH && (
          <g>
            <line
              x1={hoverX} y1={TOP_PADDING}
              x2={hoverX} y2={totalHeight - BOTTOM_PADDING}
              stroke="#1a1a2e"
              strokeWidth={1}
              strokeDasharray="3,2"
              strokeOpacity={0.4}
            />
            {/* Date label on hover */}
            <rect x={hoverX - 28} y={TOP_PADDING - 18} width={56} height={14} rx={4} fill="#1a1a2e" fillOpacity={0.8} />
            <text x={hoverX} y={TOP_PADDING - 8} fill="white" fontSize={8} textAnchor="middle">
              {new Date(xToTs(hoverX)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
            </text>
          </g>
        )}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 pointer-events-none bg-[#1a1a2e] text-white rounded-xl shadow-2xl p-4 w-72 animate-fade-in"
          style={{
            left: Math.min(tooltip.x, width - 300),
            top: tooltip.y - 20,
            transform: 'translate(10px, -50%)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
              tooltip.event.severity === 'critical' ? 'bg-red-500' :
              tooltip.event.severity === 'high' ? 'bg-orange-500' :
              tooltip.event.severity === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
            }`}>{tooltip.event.severity}</span>
            <span className="text-xs text-white/50">{tooltip.event.domain}</span>
          </div>
          <div className="font-semibold text-sm mb-1">{tooltip.event.title}</div>
          <div className="text-xs text-white/60 mb-2">{new Date(tooltip.event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          <div className="text-xs text-white/70 leading-relaxed">{tooltip.event.description}</div>
          {tooltip.event.source && (
            <div className="text-[10px] text-white/30 mt-2 border-t border-white/10 pt-2">
              Source: {tooltip.event.source}
            </div>
          )}
          {tooltip.event.substances && (
            <div className="text-xs text-orange-300 mt-1 font-medium">
              Substances: {tooltip.event.substances.join(' + ')}
            </div>
          )}
          {tooltip.event.dangerousCombo && (
            <div className="text-xs text-red-300 mt-1 font-bold">
              ⚠ DANGEROUS COMBINATION
            </div>
          )}
        </div>
      )}
    </div>
  );
}
