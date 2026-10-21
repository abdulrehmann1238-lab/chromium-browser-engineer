import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockApi } from '../../../mock/api';
import { TraceData, TraceSpan } from '../../../mock/types';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { StatusDot } from '../../../design/StatusDot';
import { Switch } from '../../../design/Switch';
import { Button } from '../../../design/Button';
import { IconButton } from '../../../design/IconButton';
import { Drawer } from '../../../design/Drawer';
import { CodeWell } from '../../../components/CodeWell';
import { ErrorPanel } from '../../../components/ErrorPanel';
import { Skeleton } from '../../../design/Skeleton';
import { formatDuration } from '../../../lib/format';
import { useDemoStore } from '../../../store/demoStore';
import {
  Activity,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Link as LinkIcon,
  Check,
  ArrowRight,
  ExternalLink,
  Table as TableIcon,
  Flame,
} from 'lucide-react';

export const SessionTraceScreen: React.FC = () => {
  const { id = 'ses_7Q2K9M' } = useParams();
  const [trace, setTrace] = useState<TraceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trace interaction state
  const [currentTime, setCurrentTime] = useState<number>(4.82); // Crash moment default
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [compareBaseline, setCompareBaseline] = useState<boolean>(false);
  const [tableView, setTableView] = useState<boolean>(false);

  // Selected span for Drawer
  const [selectedSpan, setSelectedSpan] = useState<TraceSpan | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const traceContainerRef = useRef<HTMLDivElement>(null);
  const { addToast } = useDemoStore();
  const navigate = useNavigate();

  const loadTrace = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockApi.getTrace(id);
      setTrace(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load trace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrace();
  }, [id]);

  // Initial auto-seek animation on first mount: eases from 0 to 4.82s
  useEffect(() => {
    if (!trace) return;
    let start: number | null = null;
    const duration = 1200;
    const target = 4.82;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setCurrentTime(+(ease * target).toFixed(2));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [trace?.sessionId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    addToast({ title: 'Trace URL copied to clipboard', type: 'info', duration: 2500 });
    setTimeout(() => setCopiedLink(false), 1500);
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <ErrorPanel message={error} onRetry={loadTrace} />
      </div>
    );
  }

  const duration = trace?.totalDuration || 5.0;
  const isHeroTrace = id === 'ses_7Q2K9M';

  // Calculations for current moment readout
  const activeSpansAtCursor =
    trace?.spans.filter((s) => s.start_s <= currentTime && s.end_s >= currentTime) || [];

  // Memory calculation at cursor time
  const getShmAtTime = (t: number) => {
    if (!trace?.sharedMemorySeries) return 12;
    const series = trace.sharedMemorySeries;
    for (let i = series.length - 1; i >= 0; i--) {
      if (t >= series[i].time) return series[i].mb;
    }
    return series[0].mb;
  };

  const currentShm = getShmAtTime(currentTime);

  const LANES: { id: TraceSpan['lane']; label: string; color: string }[] = [
    { id: 'cdp', label: 'CDP Protocol', color: 'var(--lane-cdp)' },
    { id: 'browser', label: 'Browser', color: 'var(--lane-browser)' },
    { id: 'network', label: 'Network service', color: 'var(--lane-network)' },
    { id: 'renderer', label: 'Renderer main', color: 'var(--lane-renderer)' },
    { id: 'gpu', label: 'GPU (software)', color: 'var(--lane-gpu)' },
  ];

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = +(ratio * duration).toFixed(2);
    setCurrentTime(newTime);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs
            items={[
              { label: 'Console', to: '/console' },
              { label: 'Sessions', to: '/console/sessions' },
              { label: id },
            ]}
          />
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-serif font-semibold text-[var(--ink-1)] tracking-tight">
              Session {id}
            </h1>
            <StatusDot status="crashed (SIGBUS)" />
            {!isHeroTrace && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--sunken)] text-[var(--ink-3)] border border-[var(--line)]">
                synthetic trace
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--ink-2)] mt-0.5">
            checkout.halcyon.test, crashed after 4.86 s on use1-n07 (container-shm64).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Switch
            label="Compare to baseline"
            checked={compareBaseline}
            onChange={(chk) => setCompareBaseline(chk)}
          />
          <Switch
            label="Table view"
            checked={tableView}
            onChange={(chk) => setTableView(chk)}
          />
          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => {
              setCurrentTime(4.82);
              setZoomLevel(1);
            }}
          >
            Reset view
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <LinkIcon className="w-3.5 h-3.5" />}
            onClick={handleCopyLink}
          >
            Copy link
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton height={320} className="rounded-[var(--radius-xl)]" />
          <Skeleton height={120} className="rounded-[var(--radius-xl)]" />
        </div>
      ) : tableView ? (
        /* Accessible Table View (Section 17) */
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-[var(--ink-1)] mb-3">
            All Trace Spans ({trace?.spans.length || 0})
          </h3>
          <table>
            <thead>
              <tr>
                <th scope="col">Lane</th>
                <th scope="col">Span Name</th>
                <th scope="col">Start (s)</th>
                <th scope="col">End (s)</th>
                <th scope="col">Duration</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {trace?.spans.map((span) => (
                <tr
                  key={span.id}
                  onClick={() => setSelectedSpan(span)}
                  className="cursor-pointer hover:bg-[var(--hover)] font-mono text-xs"
                >
                  <td className="uppercase font-semibold text-[11px]">{span.lane}</td>
                  <td className="font-semibold text-[var(--ink-1)]">{span.name}</td>
                  <td>{span.start_s.toFixed(2)}s</td>
                  <td>{span.end_s.toFixed(2)}s</td>
                  <td>{((span.end_s - span.start_s) * 1000).toFixed(0)}ms</td>
                  <td className="text-[var(--ink-2)] truncate max-w-xs">{span.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Visual Interactive Trace Timeline (Centerpiece P0) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Trace Lanes (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="dark-well p-5 overflow-hidden relative select-none">
              {/* Trace Header / Zoom bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--well-line)] text-xs font-mono">
                <span className="text-[var(--well-muted)] uppercase text-[10px] tracking-wider">
                  Chromium Multi-Process Execution Lanes (M146+p14)
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--well-muted)]">Scale: {zoomLevel}x</span>
                  <IconButton
                    label="Zoom in"
                    size="sm"
                    className="text-[var(--well-muted)] hover:text-white"
                    onClick={() => setZoomLevel((z) => Math.min(3, z + 0.5))}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </IconButton>
                  <IconButton
                    label="Zoom out"
                    size="sm"
                    className="text-[var(--well-muted)] hover:text-white"
                    onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </IconButton>
                </div>
              </div>

              {/* Time Axis Header */}
              <div
                className="relative h-6 border-b border-[var(--well-line)] text-[10px] font-mono text-[var(--well-muted)] cursor-crosshair ml-36"
                onClick={handleTimelineClick}
              >
                {[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 4.86].map((tick) => (
                  <div
                    key={tick}
                    className="absolute top-0 bottom-0 flex flex-col items-center"
                    style={{ left: `${(tick / duration) * 100}%` }}
                  >
                    <span>{tick.toFixed(1)}s</span>
                    <div className="w-[1px] h-1.5 bg-[var(--well-line)] mt-auto" />
                  </div>
                ))}
              </div>

              {/* Lanes Area */}
              <div className="space-y-2 mt-2 relative">
                {LANES.map((lane) => {
                  const laneSpans = trace?.spans.filter((s) => s.lane === lane.id) || [];
                  return (
                    <div key={lane.id} className="flex items-center h-10 group">
                      {/* Sticky Lane Label (136px) */}
                      <div className="w-36 shrink-0 font-mono text-xs text-[var(--well-muted)] truncate pr-2 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lane.color }} />
                        <span>{lane.label}</span>
                      </div>

                      {/* Lane Track */}
                      <div
                        className="flex-1 h-full bg-[var(--well-raised)] rounded border border-[var(--well-line)] relative cursor-crosshair"
                        onClick={handleTimelineClick}
                      >
                        {laneSpans.map((span) => {
                          const leftPct = (span.start_s / duration) * 100;
                          const widthPct = Math.max(0.8, ((span.end_s - span.start_s) / duration) * 100);
                          const isSelected = selectedSpan?.id === span.id;

                          return (
                            <div
                              key={span.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSpan(span);
                              }}
                              className={`absolute top-1 bottom-1 rounded-[2px] transition-all cursor-pointer flex items-center px-1.5 overflow-hidden ${
                                isSelected ? 'ring-2 ring-[var(--accent)] z-20' : 'hover:opacity-90 z-10'
                              }`}
                              style={{
                                left: `${leftPct}%`,
                                width: `${widthPct}%`,
                                backgroundColor: lane.color,
                                opacity: 0.9,
                              }}
                              title={`${span.name} (${span.start_s}s - ${span.end_s}s)`}
                            >
                              <span className="text-[10px] font-mono font-medium text-[#1F2528] truncate select-none">
                                {span.name}
                              </span>
                            </div>
                          );
                        })}

                        {/* Baseline ghost overlay if active */}
                        {compareBaseline && lane.id === 'renderer' && (
                          <div
                            className="absolute top-1 bottom-1 rounded border border-dashed border-emerald-400 bg-emerald-500/20"
                            style={{
                              left: `${(2.4 / duration) * 100}%`,
                              width: `${((3.1 - 2.4) / duration) * 100}%`,
                            }}
                            title="Baseline: Script executed in 0.7s (0.5s shorter)"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Counter Lane: Shared Memory (MB) vs 64MB Ceiling */}
                <div className="pt-3 mt-3 border-t border-[var(--well-line)] flex items-center h-20">
                  <div className="w-36 shrink-0 font-mono text-xs text-[var(--well-muted)] pr-2">
                    <div className="font-semibold text-[var(--accent-text)]">Shared Memory</div>
                    <div className="text-[10px] text-[var(--well-muted)]">64 MB /dev/shm</div>
                  </div>

                  <div
                    className="flex-1 h-full bg-[var(--well-raised)] rounded border border-[var(--well-line)] relative overflow-hidden cursor-crosshair"
                    onClick={handleTimelineClick}
                  >
                    {/* SVG Shared Memory Curve */}
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                      {/* 64MB Ceiling Line */}
                      <line
                        x1="0"
                        y1="10"
                        x2="100"
                        y2="10"
                        stroke="var(--error)"
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                      />

                      {/* Area Fill */}
                      <polygon
                        points={`0,100 ${trace?.sharedMemorySeries
                          ?.map((d) => `${(d.time / duration) * 100},${100 - (d.mb / 64) * 90}`)
                          .join(' ')} ${(4.82 / duration) * 100},100`}
                        fill="var(--accent)"
                        opacity="0.25"
                      />

                      {/* Primary Line */}
                      <polyline
                        points={trace?.sharedMemorySeries
                          ?.map((d) => `${(d.time / duration) * 100},${100 - (d.mb / 64) * 90}`)
                          .join(' ')}
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="2"
                      />
                    </svg>

                    {/* Ceiling label */}
                    <span className="absolute top-1 right-2 font-mono text-[9px] text-[var(--error)] bg-[#1F2528] px-1 rounded border border-[var(--error)]/50">
                      64 MB ceiling limit
                    </span>

                    {/* SIGBUS crash marker at 4.82s */}
                    <div
                      className="absolute top-0 bottom-0 border-l-2 border-[var(--error)] flex flex-col items-center z-20"
                      style={{ left: `${(4.82 / duration) * 100}%` }}
                    >
                      <span className="px-1.5 py-0.5 rounded bg-[var(--error)] text-white font-mono text-[9px] font-bold">
                        SIGBUS EXIT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vertical Time Cursor (The screen's ONE focal accent) */}
                <div
                  className="absolute top-0 bottom-0 w-[1.5px] bg-[var(--accent)] pointer-events-none z-30 transition-all duration-75"
                  style={{
                    left: `calc(144px + ${(currentTime / duration)} * (100% - 144px))`,
                  }}
                >
                  <div className="absolute -top-7 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[var(--accent)] text-white font-mono text-[10px] font-bold whitespace-nowrap shadow-sm">
                    {currentTime.toFixed(2)}s
                  </div>
                </div>
              </div>

              {/* Bottom Scrubber Input */}
              <div className="mt-4 pt-3 border-t border-[var(--well-line)] flex items-center gap-3">
                <span className="text-xs font-mono text-[var(--well-muted)] shrink-0">
                  Scrub Timeline:
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.02"
                  value={currentTime}
                  onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                  className="w-full accent-[var(--accent)] cursor-pointer"
                  aria-label="Timeline position slider"
                />
              </div>
            </div>

            {/* Baseline comparison callout if enabled */}
            {compareBaseline && (
              <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] text-xs space-y-2">
                <div className="font-semibold text-[var(--ink-1)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Delta vs Baseline Bare-Metal Session (ses_4F8TW1)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px] text-[var(--ink-2)]">
                  <div className="p-2 rounded bg-[var(--sunken)] border border-[var(--line)]">
                    <span className="text-[var(--ink-3)] block">Script execution</span>
                    <span className="font-semibold text-rose-600">+0.5s longer in container</span>
                  </div>
                  <div className="p-2 rounded bg-[var(--sunken)] border border-[var(--line)]">
                    <span className="text-[var(--ink-3)] block">Shared memory ceiling</span>
                    <span className="font-semibold text-rose-600">64 MB vs 8,192 MB</span>
                  </div>
                  <div className="p-2 rounded bg-[var(--sunken)] border border-[var(--line)]">
                    <span className="text-[var(--ink-3)] block">Session Outcome</span>
                    <span className="font-semibold text-rose-600">Exit at 4.82s vs clean 5.90s</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Moment Inspector (4 cols, 320px) */}
          <div className="lg:col-span-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <span className="text-xs font-mono uppercase text-[var(--ink-3)]">
                  At This Moment
                </span>
                <span className="text-lg font-mono font-bold tabular-nums text-[var(--accent-text)]">
                  {currentTime.toFixed(2)}s
                </span>
              </div>

              {/* Shared Memory meter */}
              <div className="py-4 border-b border-[var(--line)]">
                <div className="flex justify-between items-baseline text-xs font-mono mb-1.5">
                  <span className="text-[var(--ink-2)]">Shared Memory (/dev/shm)</span>
                  <span
                    className={`font-bold tabular-nums ${
                      currentShm >= 60 ? 'text-[var(--error-text)]' : 'text-[var(--ink-1)]'
                    }`}
                  >
                    {currentShm} MB of 64 MB
                  </span>
                </div>
                <div className="w-full bg-[var(--sunken)] h-2 rounded overflow-hidden">
                  <div
                    className={`h-full transition-all duration-150 ${
                      currentShm >= 64 ? 'bg-[var(--error)]' : 'bg-[var(--accent)]'
                    }`}
                    style={{ width: `${Math.min(100, (currentShm / 64) * 100)}%` }}
                  />
                </div>
                {currentShm >= 64 && (
                  <span className="text-[11px] text-rose-600 font-mono mt-1 block font-semibold">
                    Partition full: subsequent mmap write triggers SIGBUS!
                  </span>
                )}
              </div>

              {/* Active Spans */}
              <div className="py-4 space-y-2 border-b border-[var(--line)]">
                <span className="text-[11px] font-mono uppercase text-[var(--ink-3)] block mb-1">
                  Active in Processes:
                </span>
                {activeSpansAtCursor.length === 0 ? (
                  <span className="text-xs text-[var(--ink-3)] font-mono">Idle at this timestamp</span>
                ) : (
                  activeSpansAtCursor.map((span) => (
                    <div
                      key={span.id}
                      onClick={() => setSelectedSpan(span)}
                      className="p-2 rounded bg-[var(--sunken)] hover:bg-[var(--hover)] border border-[var(--line)] flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="font-mono text-[10px] uppercase text-[var(--primary)] block">
                          {span.lane}
                        </span>
                        <span className="text-xs font-semibold text-[var(--ink-1)]">
                          {span.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--ink-3)]">
                        {((span.end_s - span.start_s) * 1000).toFixed(0)}ms
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Jump to Key Events */}
              <div className="pt-4">
                <span className="text-[11px] font-mono uppercase text-[var(--ink-3)] block mb-2">
                  Jump to Key Events:
                </span>
                <div className="space-y-1.5 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setCurrentTime(0.0)}
                    className="w-full p-1.5 rounded hover:bg-[var(--hover)] flex items-center justify-between text-left cursor-pointer"
                  >
                    <span>1. Navigation start</span>
                    <span className="text-[var(--ink-3)]">0.00s</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTime(2.5)}
                    className="w-full p-1.5 rounded hover:bg-[var(--hover)] flex items-center justify-between text-left cursor-pointer"
                  >
                    <span>2. Long task begins</span>
                    <span className="text-[var(--ink-3)]">2.50s</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTime(3.8)}
                    className="w-full p-1.5 rounded hover:bg-[var(--hover)] flex items-center justify-between text-left cursor-pointer"
                  >
                    <span>3. Shm threshold at 58 MB</span>
                    <span className="text-[var(--ink-3)]">3.80s</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTime(4.82)}
                    className="w-full p-1.5 rounded bg-[var(--error-tint)] text-[var(--error-text)] font-semibold flex items-center justify-between text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      4. Renderer SIGBUS Exit
                    </span>
                    <span>4.82s</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[var(--line)]">
              <Link
                to="/case-files/014"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--primary)] hover:underline"
              >
                Read root-cause analysis in Case File 014 →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Span Detail Drawer (560px) */}
      {selectedSpan && (
        <Drawer
          open={Boolean(selectedSpan)}
          onClose={() => setSelectedSpan(null)}
          width="lg"
          title={
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{selectedSpan.name}</span>
              <span className="font-mono text-[11px] uppercase px-1.5 py-0.5 rounded bg-[var(--sunken)] text-[var(--ink-2)] border border-[var(--line)]">
                {selectedSpan.lane}
              </span>
            </div>
          }
          subtitle={`Span duration: ${((selectedSpan.end_s - selectedSpan.start_s) * 1000).toFixed(0)} ms (${selectedSpan.start_s.toFixed(2)}s – ${selectedSpan.end_s.toFixed(2)}s)`}
        >
          <div className="space-y-5 text-xs">
            {/* Summary */}
            <div>
              <span className="font-mono uppercase text-[11px] text-[var(--ink-3)] block mb-1">
                Summary & Fleet Impact
              </span>
              <p className="text-sm text-[var(--ink-1)] leading-relaxed">
                {selectedSpan.summary || selectedSpan.detail}
              </p>
              {selectedSpan.whyItMatters && (
                <div className="mt-2 p-2.5 rounded bg-[var(--sunken)] border border-[var(--line)] text-xs text-[var(--ink-2)] font-mono">
                  <strong>Why it matters:</strong> {selectedSpan.whyItMatters}
                </div>
              )}
            </div>

            {/* Chromium Source / Pseudocode */}
            <div>
              <span className="font-mono uppercase text-[11px] text-[var(--ink-3)] block mb-1">
                Chromium Component & Pseudocode
              </span>
              <CodeWell
                path={selectedSpan.componentPath || 'content/browser/renderer_host/'}
                code={
                  selectedSpan.pseudocode ||
                  `// Handler in ${selectedSpan.componentPath || 'content/renderer/'}
void ExecuteOperation(const OperationContext& ctx) {
  // Dispatched during span execution
  TraceEvent::Instant("process", "${selectedSpan.name}");
}`
                }
              />
            </div>

            {/* Related spans */}
            <div>
              <span className="font-mono uppercase text-[11px] text-[var(--ink-3)] block mb-2">
                Related Traces & Diagnostics
              </span>
              <div className="space-y-1 font-mono text-xs">
                <Link
                  to="/case-files/014"
                  className="p-2 rounded bg-[var(--surface)] hover:bg-[var(--hover)] border border-[var(--line)] flex items-center justify-between text-[var(--primary)]"
                >
                  <span>Case File 014: Full /dev/shm exhaustion investigation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/console/processes"
                  className="p-2 rounded bg-[var(--surface)] hover:bg-[var(--hover)] border border-[var(--line)] flex items-center justify-between text-[var(--ink-1)]"
                >
                  <span>Process Inspector: Snapshot of PID 4131 at crash time</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
