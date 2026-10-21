import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../../../mock/api';
import { OverviewMetrics, CrashRatePoint } from '../../../mock/types';
import { MetricCard } from '../../../components/MetricCard';
import { AttentionCard } from '../../../components/AttentionCard';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { ErrorPanel } from '../../../components/ErrorPanel';
import { Skeleton } from '../../../design/Skeleton';
import { Select } from '../../../design/Select';
import { IconButton } from '../../../design/IconButton';
import { StatusDot } from '../../../design/StatusDot';
import { RefreshCw, ArrowRight, ShieldAlert, Cpu, Server, Globe } from 'lucide-react';

export const OverviewScreen: React.FC = () => {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [buildFilter, setBuildFilter] = useState('All builds');
  const [rangeFilter, setRangeFilter] = useState('Last 14 days');
  const [hoveredDate, setHoveredDate] = useState<CrashRatePoint | null>(null);

  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockApi.getOverview(buildFilter);
      setMetrics(data);
    } catch (err: any) {
      setError(err.message || "Couldn't load fleet metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [buildFilter, rangeFilter]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <ErrorPanel message={error} onRetry={loadData} />
      </div>
    );
  }

  // Chart SVG calculations
  const chartData = metrics?.chartData || [];
  const svgWidth = 720;
  const svgHeight = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 50 };

  const minRate = 99.1;
  const maxRate = 99.9;

  const getX = (index: number) => {
    return padding.left + (index / (chartData.length - 1 || 1)) * (svgWidth - padding.left - padding.right);
  };

  const getY = (val: number) => {
    return padding.top + (1 - (val - minRate) / (maxRate - minRate)) * (svgHeight - padding.top - padding.bottom);
  };

  const makePath = (key: 'M146+p14' | 'M145+p11' | 'M147+p14-rc') => {
    if (!chartData.length) return '';
    return chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(d[key]).toFixed(1)}`).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: 'Console', to: '/console' }, { label: 'Overview' }]} />
          <h1 className="text-2xl font-serif font-semibold text-[var(--ink-1)] tracking-tight mt-1">
            Fleet Overview
          </h1>
          <p className="text-xs text-[var(--ink-2)] mt-0.5">
            Crash-free sessions, startup time and memory across 41 nodes.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Select
            options={['All builds', 'M146+p14', 'M145+p11', 'M147+p14-rc']}
            value={buildFilter}
            onChange={(e) => setBuildFilter(e.target.value)}
            className="h-9 text-xs"
          />
          <Select
            options={['Last 14 days', 'Last 7 days']}
            value={rangeFilter}
            onChange={(e) => setRangeFilter(e.target.value)}
            className="h-9 text-xs"
          />
          <IconButton label="Refresh metrics" size="sm" onClick={loadData}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </IconButton>
        </div>
      </div>

      {/* Suggested Path Ribbon */}
      <div className="p-2.5 px-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-mono text-[11px] text-[var(--ink-3)] uppercase tracking-wider">
          Suggested Path:
        </span>
        <div className="flex items-center gap-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => navigate('/console/sessions/ses_7Q2K9M')}
            className="text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            1. Open the crashed trace (ses_7Q2K9M) →
          </button>
          <button
            type="button"
            onClick={() => navigate('/console/consistency')}
            className="text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            2. Run Consistency Lab →
          </button>
          <button
            type="button"
            onClick={() => navigate('/console/builds')}
            className="text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            3. Start M147 rebase →
          </button>
        </div>
      </div>

      {/* Row 1: Needs Attention */}
      <div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-3)] block mb-2.5">
          Needs Attention
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AttentionCard
            status="Investigating"
            title="Compatibility drift on checkout flow after M147 canary"
            meta="INC-015 · Assigned to you"
            ctaText="Inspect in Consistency Lab"
            onClick={() => navigate('/console/consistency')}
          />
          <AttentionCard
            accent
            status="Monitoring"
            title="Renderer exits under load on container nodes"
            meta="INC-014 · Fixed Oct 19"
            ctaText="Open Case File 014"
            onClick={() => navigate('/case-files/014')}
          />
          <AttentionCard
            status="Action required"
            title="Rebase onto M147 blocked by 3 conflicts"
            meta="Builds · render_process_host_impl.cc"
            ctaText="Resolve and rebase"
            onClick={() => navigate('/console/builds')}
          />
        </div>
      </div>

      {/* Row 2: 5 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={104} className="rounded-[var(--radius-lg)]" />
          ))
        ) : (
          <>
            <MetricCard
              label="Crash-free rate (7d)"
              value={`${metrics?.crashFreeRate7d}%`}
              delta={{ value: `${metrics?.crashFreeDelta}%`, isPositive: false, period: 'vs prior 7d' }}
              sparkline={[99.78, 99.77, 99.76, 99.52, 99.48, 99.45, 99.47, 99.5, 99.74, 99.77, 99.78]}
              onClick={() => navigate('/console/sessions')}
            />
            <MetricCard
              label="p95 Cold Start"
              value={`${metrics?.p95ColdStartSec}s`}
              delta={{ value: `+${metrics?.p95ColdStartDelta}s`, isPositive: false, period: 'vs prior week' }}
              sparkline={[1.78, 1.79, 1.81, 1.82, 1.84, 1.85, 1.84]}
              onClick={() => navigate('/console/sessions')}
            />
            <MetricCard
              label="Active Sessions"
              value={metrics?.activeSessions.toLocaleString() || '8,214'}
              delta={{ value: '+420', isPositive: true, period: 'live fleet' }}
              onClick={() => navigate('/console/sessions')}
            />
            <MetricCard
              label="p95 Renderer Memory"
              value={`${metrics?.p95RendererMemoryMB} MB`}
              delta={{ value: '-14 MB', isPositive: true, period: 'post-reclaim' }}
              onClick={() => navigate('/console/processes')}
            />
            <MetricCard
              label="Environment Diffs"
              value="37"
              delta={{ value: '9 matter', isNeutral: true, period: 'behavioral' }}
              onClick={() => navigate('/console/consistency')}
            />
          </>
        )}
      </div>

      {/* Row 3: Fleet Reliability Chart + Crashes by Node Type */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart (8 cols) */}
        <div className="lg:col-span-8 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] p-5 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--line)] gap-2">
            <div>
              <h3 className="text-sm font-semibold text-[var(--ink-1)]">
                Crash-free Rate by Build (Daily)
              </h3>
              <p className="text-xs text-[var(--ink-3)] font-mono">
                Oct 08 – Oct 21, 2026 · Fleet-wide telemetry
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-[var(--primary)] rounded-full" />
                M146+p14 (prod)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-[#8FAFCB] rounded-full" />
                M145+p11 (legacy)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-[#B79CC4] rounded-full" />
                M147 canary
              </span>
            </div>
          </div>

          {/* SVG Multi-line Chart */}
          <div className="relative mt-4">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible select-none"
              role="img"
              aria-label="Crash-free sessions chart dipping between Oct 14 and Oct 18 and recovering on Oct 19"
            >
              {/* Y Axis Grid & Labels */}
              {[99.2, 99.4, 99.6, 99.8].map((val) => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke="var(--line)"
                      strokeDasharray="2,2"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="var(--ink-3)"
                      fontSize="10"
                      fontFamily="var(--font-mono)"
                    >
                      {val.toFixed(1)}%
                    </text>
                  </g>
                );
              })}

              {/* Shaded Container Dip Window (Oct 14 to Oct 19) */}
              <rect
                x={getX(6)}
                y={padding.top}
                width={getX(11) - getX(6)}
                height={svgHeight - padding.top - padding.bottom}
                fill="var(--accent-tint)"
                opacity="0.35"
              />
              <line
                x1={getX(6)}
                y1={padding.top}
                x2={getX(6)}
                y2={svgHeight - padding.bottom}
                stroke="var(--accent)"
                strokeDasharray="3,3"
              />
              <line
                x1={getX(11)}
                y1={padding.top}
                x2={getX(11)}
                y2={svgHeight - padding.bottom}
                stroke="var(--accent)"
                strokeDasharray="3,3"
              />

              {/* Accent Marker Annotation */}
              <g
                transform={`translate(${(getX(6) + getX(11)) / 2 - 60}, ${padding.top + 4})`}
                className="cursor-pointer"
                onClick={() => navigate('/case-files/014')}
              >
                <rect width="120" height="18" rx="4" fill="var(--accent)" />
                <text x="60" y="12" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="600" fontFamily="var(--font-mono)">
                  New container pool joined
                </text>
              </g>

              {/* Series Lines */}
              <path
                d={makePath('M145+p11')}
                fill="none"
                stroke="#8FAFCB"
                strokeWidth="1.5"
                opacity={buildFilter === 'All builds' || buildFilter === 'M145+p11' ? 1 : 0.15}
              />
              <path
                d={makePath('M147+p14-rc')}
                fill="none"
                stroke="#B79CC4"
                strokeWidth="1.5"
                opacity={buildFilter === 'All builds' || buildFilter === 'M147+p14-rc' ? 1 : 0.15}
              />
              <path
                d={makePath('M146+p14')}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                opacity={buildFilter === 'All builds' || buildFilter === 'M146+p14' ? 1 : 0.15}
              />

              {/* X Axis Date labels */}
              {chartData.map((d, i) => {
                if (i % 2 !== 0 && i !== chartData.length - 1) return null;
                const x = getX(i);
                return (
                  <text
                    key={d.date}
                    x={x}
                    y={svgHeight - 8}
                    textAnchor="middle"
                    fill="var(--ink-3)"
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                  >
                    {d.date.slice(5)}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 text-[11px] font-mono text-[var(--ink-3)] text-right">
            Click annotated window to read incident case analysis →
          </div>
        </div>

        {/* Crashes by Node Type (4 cols) */}
        <div className="lg:col-span-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[var(--ink-1)] mb-1">
              Crash Rate by Node Pool
            </h3>
            <p className="text-xs text-[var(--ink-3)] font-mono mb-4">
              Failure signature distribution (Oct 14–19)
            </p>

            <div className="space-y-4">
              {metrics?.crashesByNodeType.map((node) => {
                const isSpike = node.nodeType === 'container-shm64';
                return (
                  <div key={node.nodeType} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs font-mono">
                      <span className={isSpike ? 'text-[var(--error-text)] font-semibold' : 'text-[var(--ink-1)]'}>
                        {node.nodeType}
                      </span>
                      <span className="font-semibold tabular-nums">
                        {node.rate}% ({node.totalCrashes} exits)
                      </span>
                    </div>

                    <div className="w-full bg-[var(--sunken)] h-2 rounded overflow-hidden">
                      <div
                        className={`h-full rounded ${isSpike ? 'bg-[var(--error)]' : 'bg-[var(--primary)]'}`}
                        style={{ width: `${Math.min(100, (node.rate / 3.5) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-[var(--radius-md)] bg-[var(--sunken)] border border-[var(--line)] text-xs text-[var(--ink-2)] font-mono">
            <strong>Diagnosis:</strong> SIGBUS spike isolated to 64MB /dev/shm partition limit. Pool resized to 2GB on Oct 19.
          </div>
        </div>
      </div>

      {/* Row 4: Recent Incidents & Fleet Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incidents table (8 cols) */}
        <div className="lg:col-span-8 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--ink-1)]">
              Active & Recent Investigations
            </h3>
            <button
              type="button"
              onClick={() => navigate('/console/incidents')}
              className="text-xs font-mono text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              All incidents →
            </button>
          </div>

          <div className="divide-y divide-[var(--line)]">
            <div
              onClick={() => navigate('/console/consistency')}
              className="py-3 flex items-center justify-between hover:bg-[var(--hover)] px-2 rounded cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <StatusDot status="Investigating" />
                <div>
                  <div className="text-xs font-semibold text-[var(--ink-1)]">
                    INC-015: Compatibility drift on checkout flow after M147 canary
                  </div>
                  <div className="text-[11px] font-mono text-[var(--ink-3)]">
                    Owner: Aiyana Whitfield · Opened Oct 20
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--ink-3)]" />
            </div>

            <div
              onClick={() => navigate('/case-files/014')}
              className="py-3 flex items-center justify-between hover:bg-[var(--hover)] px-2 rounded cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <StatusDot status="Monitoring" />
                <div>
                  <div className="text-xs font-semibold text-[var(--ink-1)]">
                    INC-014: Renderer exits under load on container nodes
                  </div>
                  <div className="text-[11px] font-mono text-[var(--ink-3)]">
                    Owner: Priya Raman · Opened Oct 15 (Case File available)
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--ink-3)]" />
            </div>

            <div
              onClick={() => navigate('/console/incidents')}
              className="py-3 flex items-center justify-between hover:bg-[var(--hover)] px-2 rounded cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <StatusDot status="Resolved" />
                <div>
                  <div className="text-xs font-semibold text-[var(--ink-1)]">
                    INC-013: Cold start p95 regression on ap-south
                  </div>
                  <div className="text-[11px] font-mono text-[var(--ink-3)]">
                    Owner: Tomas Becker · Resolved Oct 6
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--ink-3)]" />
            </div>
          </div>
        </div>

        {/* Fleet at a Glance (4 cols) */}
        <div className="lg:col-span-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] p-5">
          <h3 className="text-sm font-semibold text-[var(--ink-1)] mb-3">
            Fleet Topology
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-[var(--sunken)] border border-[var(--line)]">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[var(--primary)]" />
                us-east (North Virginia)
              </span>
              <span className="font-semibold tabular-nums">24 nodes</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[var(--sunken)] border border-[var(--line)]">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#8FAFCB]" />
                eu-west (Frankfurt)
              </span>
              <span className="font-semibold tabular-nums">11 nodes</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[var(--sunken)] border border-[var(--line)]">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#B79CC4]" />
                ap-south (Mumbai)
              </span>
              <span className="font-semibold tabular-nums">6 nodes</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--ink-3)] font-mono">
            <span>Total fleet capacity:</span>
            <span className="text-[var(--ink-1)] font-semibold">12,000 max concurrent CDP sessions</span>
          </div>
        </div>
      </div>
    </div>
  );
};
