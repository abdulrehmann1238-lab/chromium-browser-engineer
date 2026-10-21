import React, { useState, useEffect } from 'react';
import { mockApi } from '../../../mock/api';
import { ConsistencyDifference } from '../../../mock/types';
import { consistencyDifferences } from '../../../mock/entities/consistency';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { Button } from '../../../design/Button';
import { Switch } from '../../../design/Switch';
import { Chip } from '../../../design/Chip';
import { Drawer } from '../../../design/Drawer';
import { Select } from '../../../design/Select';
import { ErrorPanel } from '../../../components/ErrorPanel';
import { Skeleton } from '../../../design/Skeleton';
import {
  SlidersHorizontal,
  Play,
  Copy,
  Check,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const ConsistencyLabScreen: React.FC = () => {
  const [refEnv, setRefEnv] = useState('Headful desktop (M146 reference)');
  const [candEnv, setCandEnv] = useState('Container shm64 (M146+p14 fleet node)');
  const [detectionLens, setDetectionLens] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<string>('All');
  const [showMatching, setShowMatching] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(84);
  const [diffs, setDiffs] = useState<ConsistencyDifference[]>(consistencyDifferences);

  // Selected difference for drawer
  const [selectedDiff, setSelectedDiff] = useState<ConsistencyDifference | null>(null);
  const [copiedProp, setCopiedProp] = useState<string | null>(null);

  const handleRun = async () => {
    if (refEnv === candEnv) return;
    setLoading(true);
    setError(null);
    setScore(0);

    try {
      const res = await mockApi.runComparison(refEnv, candEnv);
      setDiffs(res.differences);

      // Animate score from 0 to 84
      let cur = 0;
      const interval = setInterval(() => {
        cur += 14;
        if (cur >= res.score) {
          setScore(res.score);
          clearInterval(interval);
        } else {
          setScore(cur);
        }
      }, 70);
    } catch (err: any) {
      setError(err.message || 'Comparison failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(val);
    setCopiedProp(val);
    setTimeout(() => setCopiedProp(null), 1200);
  };

  const layers = [
    'All',
    'Rendering',
    'Fonts and locale',
    'Time and international',
    'Network',
    'Navigator and client hints',
    'Automation surface',
  ];

  const filteredDiffs = diffs.filter((d) => {
    if (selectedLayer !== 'All' && d.layer !== selectedLayer) return false;
    return true;
  });

  const behavioralCount = diffs.filter((d) => d.changesPageBehavior).length;
  const cosmeticCount = diffs.length - behavioralCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: 'Console', to: '/console' }, { label: 'Consistency Lab' }]} />
          <h1 className="text-2xl font-serif font-semibold text-[var(--ink-1)] tracking-tight mt-1">
            Consistency Lab
          </h1>
          <p className="text-xs text-[var(--ink-2)] mt-0.5">
            Diagnostic comparison: explain why the same page behaves differently across two execution environments.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Switch
            label="Detection lens (9 behavioral)"
            checked={detectionLens}
            onChange={(chk) => setDetectionLens(chk)}
          />
          <Button
            variant="primary"
            size="sm"
            loading={loading}
            icon={<Play className="w-3.5 h-3.5" />}
            onClick={handleRun}
          >
            Run comparison
          </Button>
        </div>
      </div>

      {/* Top Environment Selectors & Score Summary */}
      <div className="p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] space-y-5">
        {/* Environment Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5">
            <label className="text-xs font-mono uppercase text-[var(--ink-3)] block mb-1">
              Reference Baseline
            </label>
            <Select
              options={[
                'Headful desktop (M146 reference)',
                'Bare-metal fleet node (M146+p14)',
                'Microvm node (M146+p14)',
              ]}
              value={refEnv}
              onChange={(e) => setRefEnv(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="md:col-span-2 flex justify-center">
            <span className="font-mono text-xs font-semibold px-2 py-1 rounded bg-[var(--sunken)] text-[var(--ink-3)] border border-[var(--line-strong)]">
              versus
            </span>
          </div>

          <div className="md:col-span-5">
            <label className="text-xs font-mono uppercase text-[var(--ink-3)] block mb-1">
              Candidate Fleet Environment
            </label>
            <Select
              options={[
                'Container shm64 (M146+p14 fleet node)',
                'Container shm2g (M146+p14 fleet node)',
                'Microvm node (M147+p14-rc canary)',
              ]}
              value={candEnv}
              onChange={(e) => setCandEnv(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {refEnv === candEnv && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded text-xs font-mono">
            Choose two different environments to compare layers.
          </div>
        )}

        {/* Score & Difference Stats */}
        <div className="pt-4 border-t border-[var(--line)] grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          {/* Consistency Score */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full border-2 border-[var(--primary)] flex flex-col items-center justify-center font-mono bg-[var(--elevated)]">
              <span className="text-xl font-bold tabular-nums text-[var(--primary)]">{score}</span>
              <span className="text-[9px] text-[var(--ink-3)] -mt-1">/ 100</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--ink-1)]">Consistency Score</div>
              <div className="text-[11px] text-[var(--ink-3)] font-mono">
                {score >= 90 ? 'High parity' : 'Parity drift detected'}
              </div>
            </div>
          </div>

          {/* Counts */}
          <div className="p-2.5 rounded bg-[var(--sunken)] border border-[var(--line)] font-mono text-xs">
            <span className="text-[10px] text-[var(--ink-3)] uppercase block">Total Differences</span>
            <span className="text-sm font-semibold text-[var(--ink-1)] tabular-nums">{diffs.length}</span>
          </div>

          <div className="p-2.5 rounded bg-[var(--accent-tint)]/40 border border-[var(--accent)] font-mono text-xs">
            <span className="text-[10px] text-[var(--accent-text)] uppercase block font-semibold">
              Changes Page Behavior
            </span>
            <span className="text-sm font-bold text-[var(--accent-text)] tabular-nums">
              {behavioralCount} of {diffs.length}
            </span>
          </div>

          <div className="p-2.5 rounded bg-[var(--sunken)] border border-[var(--line)] font-mono text-xs">
            <span className="text-[10px] text-[var(--ink-3)] uppercase block">Cosmetic Only</span>
            <span className="text-sm font-semibold text-[var(--ink-2)] tabular-nums">{cosmeticCount}</span>
          </div>
        </div>

        {/* Layer Filter Chips */}
        <div className="pt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono uppercase text-[var(--ink-3)] mr-1">Layer:</span>
          {layers.map((l) => (
            <Chip
              key={l}
              active={selectedLayer === l}
              onClick={() => setSelectedLayer(l)}
            >
              {l}
            </Chip>
          ))}
        </div>
      </div>

      {/* Detection Lens Banner */}
      {detectionLens && (
        <div className="p-3 bg-[var(--primary-subtle)] border border-[var(--primary)] rounded-[var(--radius-md)] flex items-center justify-between text-xs font-mono text-[var(--primary)] animate-reveal">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Detection Lens Active: Displaying only the 9 differences that change DOM layout or script branch execution.</span>
          </div>
          <button
            type="button"
            onClick={() => setDetectionLens(false)}
            className="underline cursor-pointer text-xs"
          >
            Show all differences
          </button>
        </div>
      )}

      {/* Differences Table */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] overflow-hidden">
        {error ? (
          <div className="p-8">
            <ErrorPanel message={error} onRetry={handleRun} />
          </div>
        ) : loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={44} className="rounded-[var(--radius-sm)]" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th scope="col">Layer & Property</th>
                  <th scope="col">Reference Value</th>
                  <th scope="col">Candidate Fleet Value</th>
                  <th scope="col">Severity</th>
                  <th scope="col">Behavioral Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {filteredDiffs.map((diff) => {
                  const isDimmed = detectionLens && !diff.changesPageBehavior;

                  return (
                    <tr
                      key={diff.id}
                      onClick={() => setSelectedDiff(diff)}
                      className={`cursor-pointer transition-all duration-[var(--dur-fast)] ${
                        diff.changesPageBehavior
                          ? 'bg-[var(--elevated)] hover:bg-[var(--hover)] border-l-2 border-[var(--primary)]'
                          : 'hover:bg-[var(--hover)]'
                      }`}
                      style={{ opacity: isDimmed ? 0.3 : 1 }}
                    >
                      {/* Property */}
                      <td className="font-mono text-xs">
                        <div className="text-[10px] uppercase font-semibold text-[var(--ink-3)]">
                          {diff.layer}
                        </div>
                        <div className="font-semibold text-[var(--ink-1)] mt-0.5">
                          {diff.property}
                        </div>
                      </td>

                      {/* Reference Value */}
                      <td className="font-mono text-xs text-[var(--ink-2)] max-w-xs truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate">{diff.referenceValue}</span>
                          <button
                            type="button"
                            onClick={(e) => handleCopy(diff.referenceValue, e)}
                            className="p-1 text-[var(--ink-3)] hover:text-[var(--ink-1)]"
                            title="Copy value"
                          >
                            {copiedProp === diff.referenceValue ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Candidate Value */}
                      <td className="font-mono text-xs text-[var(--ink-1)] font-medium max-w-xs truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate">{diff.fleetValue}</span>
                          <button
                            type="button"
                            onClick={(e) => handleCopy(diff.fleetValue, e)}
                            className="p-1 text-[var(--ink-3)] hover:text-[var(--ink-1)]"
                            title="Copy value"
                          >
                            {copiedProp === diff.fleetValue ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Severity Chip */}
                      <td>
                        <span
                          className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded font-semibold ${
                            diff.severity === 'High'
                              ? 'bg-[var(--error-tint)] text-[var(--error-text)] border border-[var(--error)]'
                              : diff.severity === 'Medium'
                              ? 'bg-[var(--warning-tint)] text-[var(--warning-text)] border border-[var(--warning)]'
                              : 'bg-[var(--sunken)] text-[var(--ink-3)]'
                          }`}
                        >
                          {diff.severity}
                        </span>
                      </td>

                      {/* Changes Page Behavior Indicator */}
                      <td className="font-mono text-xs">
                        {diff.changesPageBehavior ? (
                          <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--accent-text)]">
                            <AlertTriangle className="w-3.5 h-3.5 text-[var(--accent)]" />
                            Changes behavior
                          </span>
                        ) : (
                          <span className="text-[var(--ink-3)] flex items-center gap-1 text-[11px]">
                            <Info className="w-3.5 h-3.5 text-[var(--ink-3)]" />
                            Cosmetic only
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

        {/* Scope Note at bottom */}
        <div className="p-3 bg-[var(--surface)] border-t border-[var(--line)] text-center text-xs font-mono text-[var(--ink-3)]">
          This lab explains differences. It does not modify any environment.
        </div>
      </div>

      {/* Difference Detail Drawer (480px) */}
      {selectedDiff && (
        <Drawer
          open={Boolean(selectedDiff)}
          onClose={() => setSelectedDiff(null)}
          title={<span className="text-sm font-semibold">{selectedDiff.property}</span>}
          subtitle={`Layer: ${selectedDiff.layer} · Severity: ${selectedDiff.severity}`}
        >
          <div className="space-y-5 text-xs font-mono">
            {/* Values Comparison Box */}
            <div className="p-3 bg-[var(--sunken)] border border-[var(--line)] rounded-[var(--radius-lg)] space-y-2">
              <div>
                <span className="text-[10px] text-[var(--ink-3)] uppercase block">Reference Baseline</span>
                <span className="text-xs font-semibold text-[var(--ink-1)] block break-all">
                  {selectedDiff.referenceValue}
                </span>
              </div>
              <div className="pt-2 border-t border-[var(--line)]">
                <span className="text-[10px] text-[var(--ink-3)] uppercase block">Candidate Fleet Node</span>
                <span className="text-xs font-semibold text-[var(--primary)] block break-all">
                  {selectedDiff.fleetValue}
                </span>
              </div>
            </div>

            {/* Why the layers disagree */}
            <div>
              <span className="text-[11px] uppercase text-[var(--ink-3)] block mb-1">
                Why Layers Disagree
              </span>
              <p className="text-xs text-[var(--ink-1)] font-sans leading-relaxed">
                {selectedDiff.whyDisagree}
              </p>
            </div>

            {/* How it shows up */}
            <div>
              <span className="text-[11px] uppercase text-[var(--ink-3)] block mb-1">
                Observable Fleet Symptom
              </span>
              <p className="text-xs text-[var(--ink-2)] font-sans leading-relaxed">
                {selectedDiff.symptom}
              </p>
            </div>

            {/* Where to Look */}
            <div>
              <span className="text-[11px] uppercase text-[var(--primary)] block mb-1 font-semibold">
                Chromium Component to Inspect
              </span>
              <div className="p-2.5 rounded bg-[var(--elevated)] border border-[var(--line)] text-xs text-[var(--primary)]">
                {selectedDiff.componentPath}
              </div>
            </div>

            {/* Next Step */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[var(--radius-md)] text-emerald-900 font-sans">
              <span className="font-mono uppercase text-[10px] text-emerald-800 block mb-1 font-bold">
                Recommended Next Step
              </span>
              <p className="text-xs leading-relaxed">{selectedDiff.nextStep}</p>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
