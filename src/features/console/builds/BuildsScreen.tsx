import React, { useState, useEffect } from 'react';
import { mockApi } from '../../../mock/api';
import { Patch } from '../../../mock/types';
import { useDemoStore } from '../../../store/demoStore';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { Button } from '../../../design/Button';
import { Dialog } from '../../../design/Dialog';
import { Drawer } from '../../../design/Drawer';
import { Chip } from '../../../design/Chip';
import { CodeWell } from '../../../components/CodeWell';
import { ErrorPanel } from '../../../components/ErrorPanel';
import { Skeleton } from '../../../design/Skeleton';
import {
  GitBranch,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  Layers,
  ChevronDown,
  ArrowRight,
  Package,
} from 'lucide-react';

export const BuildsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatch, setSelectedPatch] = useState<Patch | null>(null);

  // Workflow 1: Rebase Modal state
  const [rebaseModalOpen, setRebaseModalOpen] = useState(false);
  const [rebaseStep, setRebaseStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Preflight check progress
  const [preflightChecks, setPreflightChecks] = useState<number>(0);

  // Apply patches log
  const [applyLogs, setApplyLogs] = useState<string[]>([]);
  const [isApplying, setIsApplying] = useState(false);

  // Conflict resolutions (p09, p11, p14)
  const [conflictDecisions, setConflictDecisions] = useState<Record<string, string>>({
    p09: 'merge',
    p11: 'merge',
    p14: 'merge',
  });
  const [resolvedConflicts, setResolvedConflicts] = useState<string[]>([]);

  // Build streaming log & progress
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [buildEta, setBuildEta] = useState(7);

  // Verification step state
  const [verifyStepProgress, setVerifyStepProgress] = useState(0);

  const { patches, hasRebased, completeRebase, addToast } = useDemoStore();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      await mockApi.listPatches();
    } catch (err: any) {
      setError(err.message || 'Failed to load patch stack.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Preflight sequence runner
  useEffect(() => {
    if (rebaseModalOpen && rebaseStep === 1) {
      setPreflightChecks(0);
      const t1 = setTimeout(() => setPreflightChecks(1), 300);
      const t2 = setTimeout(() => setPreflightChecks(2), 700);
      const t3 = setTimeout(() => setPreflightChecks(3), 1100);
      const t4 = setTimeout(() => setPreflightChecks(4), 1500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [rebaseModalOpen, rebaseStep]);

  // Apply patches log streamer
  const handleStartApply = () => {
    setRebaseStep(2);
    setApplyLogs([]);
    setIsApplying(true);

    const patchNames = [
      'p01  Make crash report upload configurable ... ok',
      'p02  Stable process naming for fleet telemetry ... ok',
      'p03  Expose per-process memory counters ... ok',
      'p04  Quieter first-run and profile bootstrap ... ok',
      'p05  Disable background networking unused in fleet ... ok',
      'p06  Deterministic locale and timezone handoff ... ok',
      'p07  Container-aware GPU initialization fallback ... ok',
      'p08  Socket pool telemetry ... ok',
      'p09  Renderer launch flag plumbing ... CONFLICT (render_process_host_impl.cc)',
      'p10  Crash signature enrichment (shared memory) ... ok',
      'p11  DevTools event passthrough ... CONFLICT (devtools_instrumentation.cc)',
      'p12  Headless profile storage quota policy ... ok',
      'p13  Disable component updater checks ... ok',
      'p14  Backoff on renderer respawn loops ... CONFLICT (render_process_host_impl.cc)',
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < patchNames.length) {
        setApplyLogs((prev) => [...prev, patchNames[idx]]);
        idx++;
      } else {
        clearInterval(interval);
        setIsApplying(false);
      }
    }, 120);
  };

  // Build streaming simulation
  const handleStartBuild = () => {
    setRebaseStep(4);
    setBuildProgress(0);
    setBuildLogs([]);

    const logTemplates = [
      '[  1204/41203] CXX obj/content/browser/browser_main.o',
      '[  3412/41203] CXX obj/content/browser/renderer_host/render_process_host_impl.o',
      '[  9182/41203] CXX obj/content/browser/devtools/devtools_instrumentation.o',
      '[ 16420/41203] CXX obj/components/crash/crash_reporter.o',
      '[ 28190/41203] CXX obj/services/network/network_service.o',
      '[ 35800/41203] CXX obj/third_party/blink/renderer/core/frame.o',
      '[ 40100/41203] LINK ./chrome',
      '[ 41203/41203] STAMP obj/chrome/chrome.stamp',
    ];

    let p = 0;
    let logIdx = 0;
    const interval = setInterval(() => {
      p += 14;
      setBuildProgress(Math.min(100, p));
      setBuildEta((eta) => Math.max(0, eta - 1));

      if (logIdx < logTemplates.length) {
        setBuildLogs((prev) => [...prev, logTemplates[logIdx]]);
        logIdx++;
      }

      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => handleStartVerify(), 500);
      }
    }, 700);
  };

  // Verify step
  const handleStartVerify = () => {
    setRebaseStep(5);
    setVerifyStepProgress(0);
    setTimeout(() => setVerifyStepProgress(1), 400); // smoke tests
    setTimeout(() => setVerifyStepProgress(2), 900); // browser tests (retried 1, then pass)
    setTimeout(() => setVerifyStepProgress(3), 1400); // fleet canary healthy
  };

  const handleFinishRebase = () => {
    completeRebase();
    setRebaseModalOpen(false);
    addToast({
      title: 'Rebase ready: chromium-M147+p14-linux-x64.tar.zst',
      description: 'Artifact built and 3 conflicts resolved successfully.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: 'Console', to: '/console' }, { label: 'Builds & Patches' }]} />
          <h1 className="text-2xl font-serif font-semibold text-[var(--ink-1)] tracking-tight mt-1">
            Builds & Downstream Patches
          </h1>
          <p className="text-xs text-[var(--ink-2)] mt-0.5">
            14 downstream patches maintained over upstream Chromium. Automated rebase workflow.
          </p>
        </div>

        {/* Action Button */}
        <div>
          <Button
            variant="primary"
            size="sm"
            icon={<GitBranch className="w-3.5 h-3.5" />}
            onClick={() => {
              setRebaseStep(1);
              setRebaseModalOpen(true);
            }}
          >
            {hasRebased ? 'Rebase complete (M147+p14)' : 'Rebase onto M147'}
          </Button>
        </div>
      </div>

      {/* Upstream Base / Target Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] font-mono text-xs space-y-1">
          <span className="text-[10px] uppercase text-[var(--ink-3)] block">Active Base</span>
          <div className="text-sm font-semibold text-[var(--ink-1)]">Upstream Chromium M146</div>
          <p className="text-[11px] text-[var(--ink-2)] font-sans">
            Production branch: 14 downstream patches applied. 78% fleet session share.
          </p>
        </div>

        <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] font-mono text-xs space-y-1">
          <span className="text-[10px] uppercase text-[var(--primary)] font-semibold block">Target Milestone</span>
          <div className="text-sm font-semibold text-[var(--ink-1)]">
            Upstream Chromium M147 {hasRebased && <span className="text-emerald-600">(Rebased!)</span>}
          </div>
          <p className="text-[11px] text-[var(--ink-2)] font-sans">
            {hasRebased
              ? 'Downstream patch stack successfully resolved and verified on M147.'
              : 'Upstream git tag fetched. Dry run predicts 3 patch conflicts in RenderProcessHost and DevTools.'}
          </p>
        </div>
      </div>

      {/* Builds Table */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] p-5">
        <h3 className="text-sm font-semibold text-[var(--ink-1)] mb-3">
          Fleet Chromium Builds
        </h3>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th scope="col">Build ID</th>
                <th scope="col">Fleet Role</th>
                <th scope="col">Patches</th>
                <th scope="col">Built</th>
                <th scope="col">Session Share</th>
                <th scope="col">Artifact Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] font-mono text-xs">
              {hasRebased && (
                <tr className="bg-[var(--primary-subtle)] text-[var(--primary)] font-semibold">
                  <td className="font-bold">M147+p14</td>
                  <td>Ready (Canary candidate)</td>
                  <td>14 (3 resolved)</td>
                  <td>just now</td>
                  <td>0%</td>
                  <td>214 MB</td>
                </tr>
              )}
              <tr>
                <td className="font-semibold text-[var(--ink-1)]">M146+p14</td>
                <td>Production (stable)</td>
                <td>14 patches</td>
                <td className="text-[var(--ink-3)]">12 days ago</td>
                <td className="tabular-nums font-semibold">78%</td>
                <td>209 MB</td>
              </tr>
              <tr>
                <td className="font-semibold text-[var(--ink-1)]">M147+p14-rc</td>
                <td className="text-amber-800">Canary ({hasRebased ? 'Superseded' : 'Testing'})</td>
                <td>14 patches</td>
                <td className="text-[var(--ink-3)]">18 min ago</td>
                <td className="tabular-nums font-semibold">13%</td>
                <td>214 MB</td>
              </tr>
              <tr>
                <td className="font-semibold text-[var(--ink-1)]">M145+p11</td>
                <td className="text-[var(--ink-3)]">Legacy pool</td>
                <td>11 patches</td>
                <td className="text-[var(--ink-3)]">34 days ago</td>
                <td className="tabular-nums font-semibold">9%</td>
                <td>203 MB</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Downstream Patch Stack */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--ink-1)]">
              Downstream Patch Stack ({patches.length} patches)
            </h3>
            <p className="text-xs text-[var(--ink-3)] font-mono">
              Maintained in downstream git repository. Click any patch for diff analysis.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={38} className="rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th scope="col">Patch ID</th>
                  <th scope="col">Title</th>
                  <th scope="col">Touches Path</th>
                  <th scope="col">Risk</th>
                  <th scope="col">Owner</th>
                  <th scope="col">Upstream Status</th>
                  <th scope="col">M147 Rebase Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] font-mono text-xs">
                {patches.map((patch) => {
                  const isConflict = patch.rebaseStatus === 'Conflict';
                  const isResolved = patch.rebaseStatus === 'Resolved';

                  return (
                    <tr
                      key={patch.id}
                      onClick={() => setSelectedPatch(patch)}
                      className="cursor-pointer hover:bg-[var(--hover)] transition-colors"
                    >
                      <td className="font-semibold text-[var(--primary)]">{patch.id}</td>
                      <td className="font-sans font-medium text-[var(--ink-1)]">{patch.title}</td>
                      <td className="text-[var(--ink-2)]">{patch.touches}</td>
                      <td>
                        <span
                          className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                            patch.risk === 'High'
                              ? 'bg-[var(--error-tint)] text-[var(--error-text)]'
                              : patch.risk === 'Medium'
                              ? 'bg-[var(--warning-tint)] text-[var(--warning-text)]'
                              : 'bg-[var(--sunken)] text-[var(--ink-3)]'
                          }`}
                        >
                          {patch.risk}
                        </span>
                      </td>
                      <td className="font-sans text-[var(--ink-2)]">{patch.owner}</td>
                      <td>
                        <span
                          className={`text-[11px] ${
                            patch.upstreamStatus === 'Upstreamable' ? 'text-emerald-700 font-semibold' : 'text-[var(--ink-3)]'
                          }`}
                        >
                          {patch.upstreamStatus}
                        </span>
                      </td>
                      <td>
                        {isConflict ? (
                          <span className="text-rose-600 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-[var(--error)]" />
                            Conflict
                          </span>
                        ) : isResolved ? (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Resolved
                          </span>
                        ) : (
                          <span className="text-[var(--ink-3)] flex items-center gap-1">
                            <Check className="w-3 h-3 text-[var(--success)]" />
                            Clean
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Workflow 1: Rebase Modal (720px with 6-step stepper) */}
      <Dialog
        open={rebaseModalOpen}
        onClose={() => setRebaseModalOpen(false)}
        size="lg"
        title="Rebase Patch Stack onto Chromium M147"
        description="Automated 6-step rebase pipeline: preflight, patch application, conflict resolution, incremental build, test verification, and artifact emission."
      >
        <div className="space-y-6">
          {/* Stepper indicator */}
          <div className="grid grid-cols-6 gap-1 font-mono text-[10px] text-center border-b border-[var(--line)] pb-3">
            {[
              { num: 1, label: 'Preflight' },
              { num: 2, label: 'Apply' },
              { num: 3, label: 'Conflicts' },
              { num: 4, label: 'Build' },
              { num: 5, label: 'Verify' },
              { num: 6, label: 'Done' },
            ].map((st) => (
              <div
                key={st.num}
                className={`flex flex-col items-center gap-1 ${
                  rebaseStep === st.num
                    ? 'text-[var(--primary)] font-bold'
                    : rebaseStep > st.num
                    ? 'text-emerald-600 font-medium'
                    : 'text-[var(--ink-3)] opacity-60'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border text-[11px] ${
                    rebaseStep === st.num
                      ? 'border-[var(--primary)] bg-[var(--primary-subtle)]'
                      : rebaseStep > st.num
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-[var(--line-strong)] bg-[var(--sunken)]'
                  }`}
                >
                  {rebaseStep > st.num ? '✓' : st.num}
                </div>
                <span>{st.label}</span>
              </div>
            ))}
          </div>

          {/* STEP 1: Preflight */}
          {rebaseStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-[var(--ink-1)]">
                Preflight Environment Verification
              </h4>
              <div className="dark-well p-4 font-mono text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span>1. Upstream Chromium M147 git tag fetched</span>
                  {preflightChecks >= 1 ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">✓ OK</span>
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--well-muted)]" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>2. Working tree status clean (no unstaged changes)</span>
                  {preflightChecks >= 2 ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">✓ OK</span>
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--well-muted)]" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>3. Downstream patch stack: 14 commits verified</span>
                  {preflightChecks >= 3 ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">✓ OK</span>
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--well-muted)]" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>4. Distributed remote ccache warm (41,203 targets)</span>
                  {preflightChecks >= 4 ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">✓ OK</span>
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--well-muted)]" />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setRebaseModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={preflightChecks < 4}
                  onClick={handleStartApply}
                >
                  Continue to patch application
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Apply Patches */}
          {rebaseStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-[var(--ink-1)]">
                Applying Patch Stack onto M147
              </h4>
              <div className="dark-well p-4 font-mono text-xs max-h-56 overflow-y-auto space-y-1">
                {applyLogs.map((log, i) => (
                  <div
                    key={i}
                    className={
                      log.includes('CONFLICT')
                        ? 'text-rose-400 font-semibold'
                        : 'text-[var(--well-text)]'
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>

              {!isApplying && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-[var(--radius-md)] text-xs text-amber-900 font-mono">
                  Summary: 11 patches applied cleanly, 3 conflicts require resolution (p09, p11, p14).
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isApplying}
                  onClick={() => setRebaseStep(3)}
                >
                  Resolve 3 conflicts →
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Resolve Conflicts */}
          {rebaseStep === 3 && (
            <div className="space-y-4 text-xs">
              <h4 className="text-sm font-semibold text-[var(--ink-1)]">
                Resolve 3 Git Merge Conflicts
              </h4>

              {/* Conflict Accordions */}
              {['p09', 'p11', 'p14'].map((patchId) => {
                const patch = patches.find((p) => p.id === patchId);
                const isResolved = resolvedConflicts.includes(patchId);
                const details = patch?.conflictDetails;

                return (
                  <div
                    key={patchId}
                    className="border border-[var(--line)] rounded-[var(--radius-lg)] p-4 bg-[var(--surface)] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[var(--primary)]">{patchId}</span>
                        <span className="font-semibold text-[var(--ink-1)]">{patch?.title}</span>
                      </div>
                      {isResolved ? (
                        <span className="text-emerald-600 font-mono text-xs font-semibold flex items-center gap-1">
                          ✓ Resolved
                        </span>
                      ) : (
                        <span className="text-rose-600 font-mono text-xs font-semibold">
                          Conflict in {details?.file}
                        </span>
                      )}
                    </div>

                    {/* Diff comparison preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-mono text-[10px] text-[var(--ink-3)] uppercase block mb-1">
                          Upstream M147
                        </span>
                        <div className="dark-well p-2 font-mono text-[11px] leading-relaxed text-[var(--well-muted)]">
                          <pre>{details?.upstreamSnippet}</pre>
                        </div>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-[var(--primary)] uppercase block mb-1">
                          Our Downstream Patch
                        </span>
                        <div className="dark-well p-2 font-mono text-[11px] leading-relaxed text-[var(--well-text)]">
                          <pre>{details?.patchSnippet}</pre>
                        </div>
                      </div>
                    </div>

                    {/* Resolution choice */}
                    <div className="p-2.5 bg-[var(--sunken)] rounded text-xs flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-[var(--ink-2)]">
                        <strong>Suggestion:</strong> {details?.suggestion}
                      </span>
                      <Button
                        variant={isResolved ? 'secondary' : 'primary'}
                        size="sm"
                        className="text-xs font-mono"
                        onClick={() => {
                          if (!resolvedConflicts.includes(patchId)) {
                            setResolvedConflicts([...resolvedConflicts, patchId]);
                          }
                        }}
                      >
                        {isResolved ? 'Decision applied' : 'Accept suggested merge'}
                      </Button>
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-xs text-[var(--ink-3)]">
                  {resolvedConflicts.length} of 3 conflicts resolved
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={resolvedConflicts.length < 3}
                  onClick={handleStartBuild}
                >
                  Proceed to build →
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Build */}
          {rebaseStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[var(--ink-1)]">
                  Compiling Chromium M147+p14 (Ninja Build)
                </h4>
                <span className="font-mono text-xs text-[var(--ink-3)]">
                  ETA: ~{buildEta}s (compressed)
                </span>
              </div>

              <div className="w-full bg-[var(--sunken)] h-2 rounded overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] transition-all duration-300"
                  style={{ width: `${buildProgress}%` }}
                />
              </div>

              <div className="dark-well p-4 font-mono text-xs max-h-48 overflow-y-auto space-y-1">
                {buildLogs.map((log, i) => (
                  <div key={i} className="text-[var(--well-text)] truncate">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Verify */}
          {rebaseStep === 5 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-[var(--ink-1)]">
                Automated Test Verification
              </h4>
              <div className="dark-well p-4 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span>1. Headless Smoke Tests (212/212)</span>
                  {verifyStepProgress >= 1 ? (
                    <span className="text-emerald-400 font-semibold">✓ 212 passed (0 failures)</span>
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--well-muted)]" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>2. Browser Tests Subtree (1,486/1,486)</span>
                  {verifyStepProgress >= 2 ? (
                    <span className="text-emerald-400 font-semibold">✓ 1,486 passed (1 retried)</span>
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--well-muted)]" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>3. Canary Node Pool Health Check (50/50 sessions)</span>
                  {verifyStepProgress >= 3 ? (
                    <span className="text-emerald-400 font-semibold">✓ 100% crash-free</span>
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--well-muted)]" />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={verifyStepProgress < 3}
                  onClick={() => setRebaseStep(6)}
                >
                  View finished artifact →
                </Button>
              </div>
            </div>
          )}

          {/* STEP 6: Done */}
          {rebaseStep === 6 && (
            <div className="space-y-5 text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div>
                <h3 className="text-lg font-serif font-semibold text-[var(--ink-1)]">
                  Rebase Finished Successfully
                </h3>
                <p className="text-xs font-mono text-[var(--ink-3)] mt-1">
                  M147+p14 ready for deployment to fleet nodes.
                </p>
              </div>

              {/* Artifact Card */}
              <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] text-left font-mono text-xs space-y-2 max-w-md mx-auto">
                <div className="flex items-center gap-2 text-[var(--ink-1)] font-semibold">
                  <Package className="w-4 h-4 text-[var(--primary)]" />
                  <span>chromium-M147+p14-linux-x64.tar.zst</span>
                </div>
                <div className="text-[11px] text-[var(--ink-2)] flex justify-between">
                  <span>Size: 214 MB</span>
                  <span>SHA256: 8a4c17e...39f1</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <Button variant="primary" size="md" onClick={handleFinishRebase}>
                  Done & update builds table
                </Button>
              </div>
            </div>
          )}
        </div>
      </Dialog>

      {/* Patch Detail Drawer (480px) */}
      {selectedPatch && (
        <Drawer
          open={Boolean(selectedPatch)}
          onClose={() => setSelectedPatch(null)}
          title={
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{selectedPatch.id}</span>
              <span className="text-sm font-semibold text-[var(--ink-1)] truncate">
                {selectedPatch.title}
              </span>
            </div>
          }
          subtitle={`Owner: ${selectedPatch.owner} · Risk: ${selectedPatch.risk}`}
        >
          <div className="space-y-5 text-xs font-mono">
            <div>
              <span className="text-[10px] uppercase text-[var(--ink-3)] block mb-1">
                Patch Description
              </span>
              <p className="text-xs text-[var(--ink-1)] font-sans leading-relaxed">
                {selectedPatch.description}
              </p>
            </div>

            <div className="p-3 bg-[var(--sunken)] border border-[var(--line)] rounded-[var(--radius-md)] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[var(--ink-3)]">Touches:</span>
                <span className="text-[var(--primary)] font-semibold">{selectedPatch.touches}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-3)]">Lines altered:</span>
                <span className="text-emerald-700">+{selectedPatch.linesAdded || 34} / -{selectedPatch.linesRemoved || 8}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-3)]">Upstream status:</span>
                <span className="font-semibold">{selectedPatch.upstreamStatus}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase text-[var(--ink-3)] block mb-1">
                Pseudocode Patch Preview
              </span>
              <CodeWell
                path={selectedPatch.touches}
                code={`// Downstream patch ${selectedPatch.id}: ${selectedPatch.title}
namespace content {
void ApplyFleetSupervisionRule() {
  if (CommandLine::ForCurrentProcess()->HasSwitch(switches::kFleetManaged)) {
    RecordFleetMetric("patch_${selectedPatch.id}_applied");
  }
}
}`}
              />
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
