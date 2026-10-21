import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/cn';
import { AlertCircle, RefreshCw, XCircle, CheckCircle, Flame, Clock, Cpu } from 'lucide-react';
import { Button } from '../../../design/Button';

interface NodeInfo {
  id: string;
  name: string;
  sublabel: string;
  x: number;
  y: number;
  w: number;
  h: number;
  role: string;
  livesIn: string;
  failsAs: string;
}

const NODES: NodeInfo[] = [
  {
    id: 'browser',
    name: 'Browser',
    sublabel: 'pid 1204',
    x: 40,
    y: 218,
    w: 168,
    h: 84,
    role: 'Owns tabs, navigation and permissions; spawns and supervises every other process',
    livesIn: 'content/browser/',
    failsAs: 'A hang here freezes every tab',
  },
  {
    id: 'network',
    name: 'Network service',
    sublabel: 'sandboxed utility',
    x: 300,
    y: 56,
    w: 144,
    h: 64,
    role: 'Handles sockets, TLS, HTTP/2 and caching for all renderers',
    livesIn: 'services/network/, net/',
    failsAs: 'Stalls appear as slow loads in healthy renderers',
  },
  {
    id: 'gpu',
    name: 'GPU',
    sublabel: 'compositing',
    x: 300,
    y: 400,
    w: 144,
    h: 64,
    role: 'Rasterizes and composites frames and talks to the driver',
    livesIn: 'gpu/, components/viz/',
    failsAs: 'Falls back to software rendering; frames slow without an error',
  },
  {
    id: 'renderer_a',
    name: 'catalog.northwind.test',
    sublabel: 'pid 1311',
    x: 470,
    y: 150,
    w: 150,
    h: 56,
    role: 'Runs catalog DOM, style, layout and JavaScript in a sandbox',
    livesIn: 'content/renderer/, third_party/blink/renderer/',
    failsAs: 'A crash takes down only that site tabs',
  },
  {
    id: 'renderer_b',
    name: 'checkout.halcyon.test',
    sublabel: 'pid 1318',
    x: 470,
    y: 232,
    w: 150,
    h: 56,
    role: 'Runs checkout DOM, style, layout and JavaScript in a sandbox',
    livesIn: 'content/renderer/, third_party/blink/renderer/',
    failsAs: 'A crash takes down only that site tabs',
  },
  {
    id: 'renderer_c',
    name: 'ads.example.test (iframe)',
    sublabel: 'pid 1325',
    x: 470,
    y: 314,
    w: 150,
    h: 56,
    role: 'Out-of-process iframe isolated from parent checkout DOM',
    livesIn: 'content/renderer/',
    failsAs: 'A crash takes down only that site tabs',
  },
];

export const ProcessScene: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('browser');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Fault states
  const [isRunningFault, setIsRunningFault] = useState(false);
  const [rendererBCrashed, setRendererBCrashed] = useState(false);
  const [rendererBRespawning, setRendererBRespawning] = useState(false);
  const [networkStalled, setNetworkStalled] = useState(false);
  const [gpuSoftware, setGpuSoftware] = useState(false);
  const [gpuFps, setGpuFps] = useState(60);
  const [sadTabCount, setSadTabCount] = useState(0);

  // Event Log
  const [eventLogs, setEventLogs] = useState<string[]>([
    'ready: multi-process isolation active (M146+p14)',
    'mojo: IPC channels established across 6 processes',
    'supervisor: all sandboxed child process hosts healthy',
  ]);

  const activeNode = NODES.find((n) => n.id === (hoveredNodeId || selectedNodeId)) || NODES[0];

  const logEvent = (msg: string) => {
    setEventLogs((prev) => [msg, ...prev.slice(0, 5)]);
  };

  // Reset scene
  const handleReset = () => {
    setRendererBCrashed(false);
    setRendererBRespawning(false);
    setNetworkStalled(false);
    setGpuSoftware(false);
    setGpuFps(60);
    setSadTabCount(0);
    setIsRunningFault(false);
    logEvent('scene: reset to baseline multi-process state');
  };

  // Fault 1: Crash a renderer
  const handleCrashRenderer = () => {
    if (isRunningFault) return;
    setIsRunningFault(true);
    setRendererBCrashed(true);
    setSadTabCount(1);
    logEvent('fault: renderer 1318 (checkout.halcyon.test) terminated abnormally [SIGBUS]');
    logEvent('browser: child process died; sad tab shown for frame host');

    setTimeout(() => {
      setRendererBRespawning(true);
      logEvent('browser: site isolation respawn policy triggered; launching spare host');
    }, 1400);

    setTimeout(() => {
      setRendererBCrashed(false);
      setRendererBRespawning(false);
      setSadTabCount(0);
      setIsRunningFault(false);
      logEvent('supervisor: renderer 1342 spawned and attached to tab frame');
    }, 2800);
  };

  // Fault 2: Stall the network
  const handleStallNetwork = () => {
    if (isRunningFault) return;
    setIsRunningFault(true);
    setNetworkStalled(true);
    logEvent('fault: network service socket pool throttled; request queue growing');

    setTimeout(() => {
      setNetworkStalled(false);
      setIsRunningFault(false);
      logEvent('network: socket queue drained; TCP connection reuse restored');
    }, 3200);
  };

  // Fault 3: Fall back to software GPU
  const handleFallbackGpu = () => {
    if (isRunningFault) return;
    setIsRunningFault(true);
    setGpuSoftware(true);
    logEvent('fault: GPU hardware acceleration node unavailable (/dev/dri missing)');
    logEvent('gpu: falling back to Skia software rasterizer; FPS dropping to 24');

    let fps = 60;
    const interval = setInterval(() => {
      fps = Math.max(24, fps - 8);
      setGpuFps(fps);
      if (fps <= 24) clearInterval(interval);
    }, 100);

    setTimeout(() => {
      setGpuSoftware(false);
      setGpuFps(60);
      setIsRunningFault(false);
      logEvent('gpu: restored hardware accelerated compositing [Vulkan]');
    }, 3200);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Interactive Process Scene SVG */}
      <div className="relative w-full max-w-[640px] aspect-[640/520] select-none bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] p-2 overflow-hidden">
        <svg
          viewBox="0 0 640 520"
          className="w-full h-full"
          role="group"
          aria-label="Chromium Multi-Process Architecture Diagram"
        >
          {/* Edge lines (Mojo IPC pipes) */}
          <g className="edges">
            {/* Browser to Network */}
            <path
              d="M 124 218 L 124 88 L 300 88"
              fill="none"
              stroke={hoveredNodeId === 'network' || hoveredNodeId === 'browser' ? 'var(--primary)' : 'var(--line-strong)'}
              strokeWidth={hoveredNodeId === 'network' || hoveredNodeId === 'browser' ? '2' : '1.25'}
            />
            {/* Browser to GPU */}
            <path
              d="M 124 302 L 124 432 L 300 432"
              fill="none"
              stroke={gpuSoftware ? 'var(--warning)' : hoveredNodeId === 'gpu' || hoveredNodeId === 'browser' ? 'var(--primary)' : 'var(--line-strong)'}
              strokeWidth={hoveredNodeId === 'gpu' || hoveredNodeId === 'browser' ? '2' : '1.25'}
              strokeDasharray={gpuSoftware ? '4,4' : undefined}
            />
            {/* Browser to Renderer A */}
            <path
              d="M 208 238 L 360 238 L 360 178 L 470 178"
              fill="none"
              stroke={hoveredNodeId === 'renderer_a' || hoveredNodeId === 'browser' ? 'var(--primary)' : 'var(--line-strong)'}
              strokeWidth={hoveredNodeId === 'renderer_a' || hoveredNodeId === 'browser' ? '2' : '1.25'}
            />
            {/* Browser to Renderer B */}
            <path
              d="M 208 260 L 470 260"
              fill="none"
              stroke={rendererBCrashed ? 'var(--error)' : hoveredNodeId === 'renderer_b' || hoveredNodeId === 'browser' ? 'var(--primary)' : 'var(--line-strong)'}
              strokeWidth={hoveredNodeId === 'renderer_b' || hoveredNodeId === 'browser' ? '2' : '1.25'}
              strokeDasharray={rendererBCrashed ? '4,4' : undefined}
            />
            {/* Browser to Renderer C */}
            <path
              d="M 208 282 L 360 282 L 360 342 L 470 342"
              fill="none"
              stroke={hoveredNodeId === 'renderer_c' || hoveredNodeId === 'browser' ? 'var(--primary)' : 'var(--line-strong)'}
              strokeWidth={hoveredNodeId === 'renderer_c' || hoveredNodeId === 'browser' ? '2' : '1.25'}
            />

            {/* Lighter secondary edges: Network to renderers */}
            <path d="M 444 88 L 470 160" fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="3,3" />
            <path d="M 444 88 L 470 245" fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="3,3" />

            {/* Renderer to GPU */}
            <path d="M 470 270 L 444 432" fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="3,3" />
            <path d="M 470 350 L 444 432" fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="3,3" />
          </g>

          {/* Animated packets (SVG circles or rects) */}
          {!rendererBCrashed && (
            <g className="packets">
              {/* Packet to Renderer A */}
              <circle r="3.5" fill="var(--primary)">
                <animateMotion path="M 208 238 L 360 238 L 360 178 L 470 178" dur="2.8s" repeatCount="indefinite" />
              </circle>
              {/* Packet to Renderer B */}
              <circle r="3.5" fill="var(--primary)">
                <animateMotion path="M 208 260 L 470 260" dur="2.2s" repeatCount="indefinite" />
              </circle>
              {/* Packet to Renderer C */}
              <circle r="3.5" fill="var(--primary)">
                <animateMotion path="M 208 282 L 360 282 L 360 342 L 470 342" dur="3.2s" repeatCount="indefinite" />
              </circle>
              {/* Packet to Network */}
              <circle r="3.5" fill={networkStalled ? 'var(--warning)' : 'var(--primary)'}>
                <animateMotion
                  path="M 124 218 L 124 88 L 300 88"
                  dur={networkStalled ? '7.5s' : '2.5s'}
                  repeatCount="indefinite"
                />
              </circle>
              {/* Packet to GPU */}
              <circle r="3.5" fill="var(--primary)">
                <animateMotion path="M 124 302 L 124 432 L 300 432" dur="3.0s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* Nodes */}
          {NODES.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isDimmed = (hoveredNodeId !== null && !isHovered) || (rendererBCrashed && node.id === 'renderer_b');

            // Specific fault classes
            let borderColor = 'var(--line-strong)';
            let bgColor = 'var(--elevated)';
            let titleText = node.name;
            let subText = node.sublabel;

            if (node.id === 'renderer_b') {
              if (rendererBCrashed) {
                borderColor = 'var(--error)';
                bgColor = 'var(--error-tint)';
                titleText = 'checkout (crashed)';
                subText = 'exited abnormal';
              } else if (rendererBRespawning) {
                borderColor = 'var(--primary)';
                titleText = 'checkout (respawning)';
                subText = 'pid 1342';
              }
            } else if (node.id === 'network' && networkStalled) {
              borderColor = 'var(--warning)';
              bgColor = 'var(--warning-tint)';
              subText = 'queue stalled';
            } else if (node.id === 'gpu' && gpuSoftware) {
              borderColor = 'var(--warning)';
              titleText = 'GPU, software';
              subText = `${gpuFps} fps raster`;
            }

            if (isHovered || isSelected) {
              borderColor = 'var(--primary)';
            }

            return (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => setSelectedNodeId(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="cursor-pointer transition-opacity duration-150"
                style={{ opacity: isDimmed ? 0.45 : 1 }}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx="8"
                  fill={bgColor}
                  stroke={borderColor}
                  strokeWidth={isSelected || isHovered ? '2' : '1'}
                />

                <text
                  x={node.x + 12}
                  y={node.y + 24}
                  fill="var(--ink-1)"
                  fontSize={node.id.startsWith('renderer') ? '12' : '13'}
                  fontWeight="600"
                  fontFamily="var(--font-ui)"
                >
                  {titleText}
                </text>

                <text
                  x={node.x + 12}
                  y={node.y + (node.h > 60 ? 44 : 40)}
                  fill="var(--ink-3)"
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                >
                  {subText}
                </text>

                {/* Sad tab badge on Browser if crash occurred */}
                {node.id === 'browser' && sadTabCount > 0 && (
                  <g transform={`translate(${node.x + node.w - 85}, ${node.y + 8})`}>
                    <rect width="78" height="20" rx="4" fill="var(--error)" />
                    <text x="8" y="14" fill="#ffffff" fontSize="10" fontWeight="600" fontFamily="var(--font-mono)">
                      1 sad tab
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Inspector Strip below scene */}
      <div className="w-full max-w-[640px] mt-2 p-3.5 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] text-xs flex flex-col gap-1.5 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-[var(--ink-1)]">{activeNode.name}</span>
            <span className="font-mono text-[11px] text-[var(--ink-3)] bg-[var(--sunken)] px-1.5 py-0.5 rounded">
              {activeNode.sublabel}
            </span>
          </div>
          <span className="font-mono text-[11px] text-[var(--primary)] font-medium">
            Lives in: {activeNode.livesIn}
          </span>
        </div>
        <p className="text-[var(--ink-2)] text-xs">{activeNode.role}</p>
        <div className="text-[11px] text-[var(--error-text)] font-medium flex items-center gap-1">
          <span className="font-mono uppercase text-[10px] text-[var(--ink-3)]">Fails as:</span>
          <span>{activeNode.failsAs}</span>
        </div>
      </div>

      {/* Fault Controls */}
      <div className="w-full max-w-[640px] mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={isRunningFault}
            onClick={handleCrashRenderer}
            icon={<Flame className="w-3.5 h-3.5 text-[var(--error)]" />}
            className="text-xs"
          >
            Crash a renderer
          </Button>

          <Button
            variant="secondary"
            size="sm"
            disabled={isRunningFault}
            onClick={handleStallNetwork}
            icon={<Clock className="w-3.5 h-3.5 text-[var(--warning)]" />}
            className="text-xs"
          >
            Stall the network
          </Button>

          <Button
            variant="secondary"
            size="sm"
            disabled={isRunningFault}
            onClick={handleFallbackGpu}
            icon={<Cpu className="w-3.5 h-3.5 text-[var(--info)]" />}
            className="text-xs"
          >
            Fall back to software GPU
          </Button>
        </div>

        {isRunningFault ? (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-mono text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 animate-spin" />
            Reset scene
          </button>
        ) : (
          <span className="text-[11px] font-mono text-[var(--ink-3)]">Click any process to inspect</span>
        )}
      </div>

      {/* Event log readout */}
      <div
        className="w-full max-w-[640px] mt-2.5 p-2.5 dark-well font-mono text-[11px] leading-relaxed flex flex-col gap-0.5 select-text"
        aria-live="polite"
      >
        <div className="text-[10px] uppercase text-[var(--well-muted)] tracking-wider mb-1 flex items-center justify-between">
          <span>IPC Telemetry Stream</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        {eventLogs.slice(0, 3).map((log, idx) => (
          <div key={idx} className={idx === 0 ? 'text-[var(--well-text)]' : 'text-[var(--well-muted)]'}>
            <span className="text-[var(--primary-border)] mr-2">&gt;</span>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
