import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../../../mock/api';
import { ProcessNode } from '../../../mock/types';
import { useDemoStore } from '../../../store/demoStore';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { StatusDot } from '../../../design/StatusDot';
import { Button } from '../../../design/Button';
import { IconButton } from '../../../design/IconButton';
import { Dialog } from '../../../design/Dialog';
import { Drawer } from '../../../design/Drawer';
import { Select } from '../../../design/Select';
import { Chip } from '../../../design/Chip';
import { Segmented } from '../../../design/Segmented';
import { CodeWell } from '../../../components/CodeWell';
import { ErrorPanel } from '../../../components/ErrorPanel';
import { Skeleton } from '../../../design/Skeleton';
import { formatMemory } from '../../../lib/format';
import {
  Layers,
  Cpu,
  Globe,
  Network,
  Wrench,
  Flame,
  Camera,
  GitCompare,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export const ProcessInspectorScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPid, setSelectedPid] = useState<number>(4131);
  const [copiedPid, setCopiedPid] = useState<number | null>(null);

  // Workflow 2: Capture Trace modal state
  const [captureModalOpen, setCaptureModalOpen] = useState(false);
  const [captureCategories, setCaptureCategories] = useState<string[]>([
    'Network',
    'Renderer',
    'GPU',
  ]);
  const [captureDuration, setCaptureDuration] = useState<'5s' | '10s' | '30s'>('10s');
  const [captureBuffer, setCaptureBuffer] = useState('256 MB');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);

  // Workflow 3: Kill Renderer modal state
  const [killModalOpen, setKillModalOpen] = useState(false);
  const [pidToKill, setPidToKill] = useState<number | null>(null);
  const [killing, setKilling] = useState(false);

  // Compare against baseline drawer
  const [baselineDrawerOpen, setBaselineDrawerOpen] = useState(false);

  const { processTree, killProcess, addToast } = useDemoStore();
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      await mockApi.getProcessTree();
    } catch (err: any) {
      setError(err.message || 'Failed to load process tree.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyPid = (pid: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(String(pid));
    setCopiedPid(pid);
    setTimeout(() => setCopiedPid(null), 1200);
  };

  // Find currently selected process object
  const findProcess = (nodes: ProcessNode[], pid: number): ProcessNode | null => {
    for (const node of nodes) {
      if (node.pid === pid) return node;
      if (node.children) {
        const found = findProcess(node.children, pid);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedProcess = findProcess(processTree, selectedPid) || processTree[0];

  // Workflow 2 Handler: Capture trace simulation
  const handleStartCapture = () => {
    if (captureCategories.length === 0) return;
    setIsCapturing(true);
    setCaptureProgress(10);

    const interval = setInterval(() => {
      setCaptureProgress((p) => {
        if (p >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsCapturing(false);
            setCaptureModalOpen(false);
            addToast({
              title: 'Trace captured: 8.2 s, 14 MB',
              description: 'Categories: Network, Renderer, GPU.',
              type: 'success',
              action: {
                label: 'Open trace',
                onClick: () => navigate('/console/sessions/ses_7Q2K9M'),
              },
            });
          }, 300);
          return 100;
        }
        return p + 20;
      });
    }, 400);
  };

  // Workflow 3 Handler: Kill renderer
  const handleConfirmKill = async () => {
    if (!pidToKill) return;
    setKilling(true);
    try {
      await killProcess(pidToKill);
      addToast({
        title: 'Renderer respawned as pid 4161',
        description: 'checkout.halcyon.test recovered via supervisor site isolation policy.',
        type: 'success',
      });
      setSelectedPid(4161);
    } finally {
      setKilling(false);
      setKillModalOpen(false);
      setPidToKill(null);
    }
  };

  const getProcessIcon = (type: ProcessNode['type']) => {
    switch (type) {
      case 'Browser':
        return <Globe className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Network service':
        return <Network className="w-3.5 h-3.5 text-[#8FAFCB]" />;
      case 'GPU':
        return <Cpu className="w-3.5 h-3.5 text-[#B79CC4]" />;
      case 'Renderer':
      case 'Renderer (child frame)':
      case 'Renderer (spare)':
        return <Layers className="w-3.5 h-3.5 text-[#D5B27A]" />;
      default:
        return <Wrench className="w-3.5 h-3.5 text-[var(--well-muted)]" />;
    }
  };

  // Recursive flat rendering of tree rows with depth indentation
  const renderTreeRows = (nodes: ProcessNode[], depth = 0): React.ReactNode => {
    return nodes.map((node) => {
      const isSelected = selectedPid === node.pid;
      const isExited = node.status.includes('Exited');
      const isRenderer = node.type.startsWith('Renderer');
      const maxResidentMB = 450;
      const residentPct = Math.min(100, (node.residentMB / maxResidentMB) * 100);

      return (
        <React.Fragment key={node.pid}>
          <tr
            onClick={() => setSelectedPid(node.pid)}
            className={`cursor-pointer transition-colors font-mono text-xs ${
              isSelected
                ? 'bg-[var(--well-line)] text-white border-l-2 border-[var(--well-ring)]'
                : 'hover:bg-[var(--well-line)]/50 text-[var(--well-text)]'
            } ${isExited ? 'bg-rose-950/40 text-rose-300' : ''}`}
          >
            {/* PID with copy */}
            <td className="py-2.5 px-3">
              <div className="flex items-center gap-1.5" style={{ paddingLeft: `${depth * 18}px` }}>
                {depth > 0 && <span className="text-[var(--well-muted)]">└</span>}
                {getProcessIcon(node.type)}
                <span className="font-semibold">{node.pid}</span>
                <button
                  type="button"
                  onClick={(e) => handleCopyPid(node.pid, e)}
                  className="p-0.5 text-[var(--well-muted)] hover:text-white"
                  title="Copy PID"
                >
                  {copiedPid === node.pid ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </td>

            {/* Type */}
            <td className="py-2.5 px-3">
              <span className="text-xs text-[var(--well-text)] font-semibold">{node.type}</span>
            </td>

            {/* Site / Role */}
            <td className="py-2.5 px-3 truncate max-w-[200px]">
              <span className="text-[var(--well-muted)]">{node.siteOrRole}</span>
            </td>

            {/* Resident Set with inline progress bar */}
            <td className="py-2.5 px-3 min-w-[140px]">
              <div className="flex items-center gap-2">
                <span className="w-16 tabular-nums">{formatMemory(node.residentMB)}</span>
                <div className="flex-1 bg-[var(--well-raised)] h-1.5 rounded overflow-hidden">
                  <div
                    className={`h-full ${node.residentMB > 350 ? 'bg-[var(--accent)]' : 'bg-emerald-400'}`}
                    style={{ width: `${residentPct}%` }}
                  />
                </div>
              </div>
            </td>

            {/* CPU */}
            <td className="py-2.5 px-3 tabular-nums">
              <span className={node.cpuPercent > 50 ? 'text-amber-300 font-bold' : ''}>
                {node.cpuPercent}%
              </span>
            </td>

            {/* Threads */}
            <td className="py-2.5 px-3 tabular-nums">{node.threads}</td>

            {/* Status & Kill Action */}
            <td className="py-2.5 px-3">
              <div className="flex items-center justify-between gap-2">
                <StatusDot status={node.status} />

                {isRenderer && !isExited ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-6 px-2 text-[10px] font-mono"
                    icon={<Flame className="w-3 h-3" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPidToKill(node.pid);
                      setKillModalOpen(true);
                    }}
                  >
                    Kill
                  </Button>
                ) : (
                  <span
                    className="text-[10px] text-[var(--well-muted)]"
                    title="Supervisor/driver process protection"
                  >
                    Protected
                  </span>
                )}
              </div>
            </td>
          </tr>

          {node.children && renderTreeRows(node.children, depth + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: 'Console', to: '/console' }, { label: 'Processes' }]} />
          <h1 className="text-2xl font-serif font-semibold text-[var(--ink-1)] tracking-tight mt-1">
            Process Inspector
          </h1>
          <p className="text-xs text-[var(--ink-2)] mt-0.5">
            Snapshot at t = 3.9 s for crashed session ses_7Q2K9M. Supervised Chromium processes.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<GitCompare className="w-3.5 h-3.5" />}
            onClick={() => setBaselineDrawerOpen(true)}
          >
            Compare against baseline
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Camera className="w-3.5 h-3.5" />}
            onClick={() => setCaptureModalOpen(true)}
          >
            Capture trace
          </Button>
        </div>
      </div>

      {error ? (
        <ErrorPanel message={error} onRetry={loadData} />
      ) : loading ? (
        <Skeleton height={380} className="rounded-[var(--radius-xl)]" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Process Tree Table (8 cols) inside dark well */}
          <div className="lg:col-span-8 dark-well overflow-hidden">
            <div className="p-3 border-b border-[var(--well-line)] bg-[var(--well-raised)] flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--well-muted)] uppercase tracking-wider text-[10px]">
                Process Hierarchy Tree (PID / Site Isolation Boundary)
              </span>
              <span className="text-emerald-400 font-semibold">Cgroup: /sys/fs/cgroup/shm64</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--well-line)] text-[10px] font-mono uppercase text-[var(--well-muted)] bg-[var(--well-raised)]">
                    <th className="py-2 px-3 bg-transparent text-[var(--well-muted)]">PID</th>
                    <th className="py-2 px-3 bg-transparent text-[var(--well-muted)]">Process Type</th>
                    <th className="py-2 px-3 bg-transparent text-[var(--well-muted)]">Site / Domain Role</th>
                    <th className="py-2 px-3 bg-transparent text-[var(--well-muted)]">Resident RSS</th>
                    <th className="py-2 px-3 bg-transparent text-[var(--well-muted)]">CPU</th>
                    <th className="py-2 px-3 bg-transparent text-[var(--well-muted)]">Threads</th>
                    <th className="py-2 px-3 bg-transparent text-[var(--well-muted)]">Status / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--well-line)]/50">
                  {renderTreeRows(processTree)}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-[var(--well-raised)] border-t border-[var(--well-line)] flex items-center justify-between text-[11px] font-mono text-[var(--well-muted)]">
              <span>Killing a renderer triggers supervisor site isolation respawn.</span>
              <span>Memory limit: 64 MB /dev/shm</span>
            </div>
          </div>

          {/* Details Panel for selected process (4 cols, 360px) */}
          <div className="lg:col-span-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <span className="font-mono text-xs text-[var(--ink-3)] uppercase block">
                  Selected Process
                </span>
                <h3 className="text-base font-semibold text-[var(--ink-1)] flex items-center gap-2">
                  <span>PID {selectedProcess?.pid}</span>
                  <StatusDot status={selectedProcess?.status || 'Healthy'} />
                </h3>
              </div>
              <span className="font-mono text-xs font-semibold text-[var(--primary)] bg-[var(--sunken)] px-2 py-0.5 rounded">
                {selectedProcess?.type}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-[var(--sunken)] border border-[var(--line)] rounded-[var(--radius-md)] font-mono text-xs">
              <div>
                <span className="text-[10px] text-[var(--ink-3)] uppercase block">Resident Set</span>
                <span className="text-sm font-semibold text-[var(--ink-1)]">
                  {formatMemory(selectedProcess?.residentMB || 0)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--ink-3)] uppercase block">CPU Utilization</span>
                <span className="text-sm font-semibold text-[var(--ink-1)]">
                  {selectedProcess?.cpuPercent}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--ink-3)] uppercase block">Active Threads</span>
                <span className="text-sm font-semibold text-[var(--ink-1)]">
                  {selectedProcess?.threads}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--ink-3)] uppercase block">Process Origin</span>
                <span className="text-xs font-semibold text-[var(--ink-1)] truncate block">
                  {selectedProcess?.siteOrRole}
                </span>
              </div>
            </div>

            {/* Resident Memory Sparkline if available */}
            {selectedProcess?.sparkline && (
              <div>
                <span className="text-[11px] font-mono uppercase text-[var(--ink-3)] block mb-1">
                  Resident Memory Growth (14s)
                </span>
                <div className="dark-well p-3 flex flex-col gap-1">
                  <div className="flex justify-between font-mono text-[10px] text-[var(--well-muted)]">
                    <span>120 MB</span>
                    <span className="text-rose-400 font-bold">398 MB</span>
                  </div>
                  <svg viewBox="0 0 100 24" className="w-full h-6 overflow-visible" preserveAspectRatio="none">
                    <polyline
                      points={selectedProcess.sparkline
                        .map((val, i) => `${(i / (selectedProcess.sparkline!.length - 1)) * 100},${24 - ((val - 120) / 278) * 20 - 2}`)
                        .join(' ')}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Chromium Source Directory & Labelled Pseudocode */}
            <div>
              <span className="text-[11px] font-mono uppercase text-[var(--ink-3)] block mb-1">
                Implementation Path
              </span>
              <CodeWell
                path={selectedProcess?.livesIn || 'content/renderer/'}
                code={
                  selectedProcess?.pseudocode ||
                  `// Process lifecycle handler for ${selectedProcess?.type}
void HandleProcessTask() {
  base::AutoLock lock(process_lock_);
  ExecuteMainThreadLoop();
}`
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Workflow 2: Capture Trace Modal (520px) */}
      <Dialog
        open={captureModalOpen}
        onClose={() => !isCapturing && setCaptureModalOpen(false)}
        size="md"
        title="Capture Real-Time Trace"
        description="Stream Chromium DevTools Protocol trace events from active fleet session."
      >
        {isCapturing ? (
          <div className="py-8 space-y-4 text-center">
            <h4 className="text-base font-semibold text-[var(--ink-1)]">
              Streaming trace buffers...
            </h4>
            <p className="text-xs font-mono text-[var(--ink-3)]">
              Recording categories: {captureCategories.join(', ')}
            </p>

            <div className="w-full bg-[var(--sunken)] h-2 rounded overflow-hidden">
              <div
                className="h-full bg-[var(--primary)] transition-all duration-300"
                style={{ width: `${captureProgress}%` }}
              />
            </div>

            <div className="text-xs font-mono text-[var(--ink-2)] flex justify-between">
              <span>Duration: 10s compressed</span>
              <span>Buffer: {Math.round((captureProgress / 100) * 14)} MB recorded</span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsCapturing(false);
                setCaptureModalOpen(false);
                addToast({ title: 'Trace captured early (partial)', type: 'info' });
              }}
            >
              Stop early & keep partial
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-xs font-medium text-[var(--ink-2)] block mb-1">
                Target Session
              </label>
              <Select
                options={['ses_7Q2K9M (checkout.halcyon.test)', 'ses_4F8TW1 (baseline)', 'ses_3M9KP2']}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--ink-2)] block mb-1.5">
                Trace Categories (Choose at least one)
              </label>
              <div className="flex flex-wrap gap-2">
                {['Network', 'Renderer', 'GPU', 'IPC', 'Memory', 'V8'].map((cat) => {
                  const isSelected = captureCategories.includes(cat);
                  return (
                    <Chip
                      key={cat}
                      active={isSelected}
                      onClick={() => {
                        if (isSelected) {
                          setCaptureCategories(captureCategories.filter((c) => c !== cat));
                        } else {
                          setCaptureCategories([...captureCategories, cat]);
                        }
                      }}
                    >
                      {cat}
                    </Chip>
                  );
                })}
              </div>
              {captureCategories.length === 0 && (
                <span className="text-xs text-[var(--error)] mt-1 block">
                  Choose at least one category.
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[var(--ink-2)] block mb-1.5">
                  Duration
                </label>
                <Segmented
                  size="sm"
                  value={captureDuration}
                  onChange={(val) => setCaptureDuration(val as any)}
                  options={['5s', '10s', '30s']}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--ink-2)] block mb-1">
                  Buffer Limit
                </label>
                <Select
                  options={['64 MB', '256 MB', '512 MB']}
                  value={captureBuffer}
                  onChange={(e) => setCaptureBuffer(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--line)] flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setCaptureModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={captureCategories.length === 0}
                onClick={handleStartCapture}
              >
                Start capture
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Workflow 3: Kill Renderer Confirmation Modal (440px) */}
      <Dialog
        open={killModalOpen}
        onClose={() => !killing && setKillModalOpen(false)}
        size="sm"
        title={`Kill renderer ${pidToKill}?`}
        description="This ends checkout.halcyon.test in this session. The browser will observe the SIGSEGV/IPC disconnect and execute the site isolation respawn policy."
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-[var(--radius-md)] flex items-start gap-2.5 text-rose-900">
            <AlertTriangle className="w-4 h-4 text-[var(--error)] shrink-0 mt-0.5" />
            <span>
              Simulated fault: The renderer process terminates immediately. Its child frame will collapse, followed by an automatic supervisor respawn in ~1.4 seconds.
            </span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={killing}
              onClick={() => setKillModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              loading={killing}
              onClick={handleConfirmKill}
            >
              Kill renderer
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Compare Against Baseline Drawer */}
      <Drawer
        open={baselineDrawerOpen}
        onClose={() => setBaselineDrawerOpen(false)}
        title="Process Tree Delta vs Baseline"
        subtitle="Comparing ses_7Q2K9M (Container) against ses_4F8TW1 (Bare-Metal)"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-[var(--sunken)] border border-[var(--line)] rounded-[var(--radius-lg)] space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-[var(--ink-3)]">Renderer Count:</span>
              <span className="text-[var(--ink-1)] font-semibold">3 (Container) vs 2 (Baseline)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ink-3)]">Peak Renderer RSS:</span>
              <span className="text-rose-600 font-semibold">398 MB vs 412 MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ink-3)]">GPU Process Backend:</span>
              <span className="text-rose-600 font-semibold">Software Rasterizer vs Hardware Vulkan</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ink-3)]">Shared Memory Limit:</span>
              <span className="text-rose-600 font-semibold">64 MB (/dev/shm) vs 8,192 MB</span>
            </div>
          </div>

          <p className="text-[var(--ink-2)] leading-relaxed">
            In bare-metal sessions, software compositing is inactive and /dev/shm has gigabytes of headroom. In the container pool, software compositing writes tiles to shared memory, causing exhaustion under long cart renders.
          </p>
        </div>
      </Drawer>
    </div>
  );
};
