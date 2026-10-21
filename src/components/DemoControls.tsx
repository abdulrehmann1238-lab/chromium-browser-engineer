import React, { useState, useRef, useEffect } from 'react';
import { useDemoStore } from '../store/demoStore';
import { Sliders, RefreshCw, AlertCircle, Database, Check } from 'lucide-react';
import { Segmented } from '../design/Segmented';
import { Switch } from '../design/Switch';
import { Button } from '../design/Button';

export const DemoControls: React.FC = () => {
  const [open, setOpen] = useState(false);
  const {
    latency,
    setLatency,
    errorNext,
    setErrorNext,
    dataMode,
    setDataMode,
    resetDemoState,
  } = useDemoStore();

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono text-[var(--ink-2)] hover:text-[var(--ink-1)] bg-[var(--sunken)] hover:bg-[var(--line)] border border-[var(--line-strong)] rounded-[var(--radius-sm)] transition-colors cursor-pointer"
      >
        <Sliders className="w-3 h-3 text-[var(--primary)]" />
        <span>Demo controls</span>
        {errorNext && <span className="w-1.5 h-1.5 rounded-full bg-[var(--error)]" />}
      </button>

      {open && (
        <div
          role="region"
          aria-label="Demo inspection controls"
          className="absolute bottom-full right-0 mb-2 w-72 bg-[var(--elevated)] border border-[var(--line)] rounded-[var(--radius-lg)] shadow-[var(--shadow-overlay)] p-4 z-[var(--z-popover)] animate-overlay text-xs"
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--line)]">
            <span className="font-semibold text-[var(--ink-1)] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[var(--primary)]" />
              Demo Controls
            </span>
            <span className="text-[10px] font-mono uppercase bg-[var(--primary-subtle)] text-[var(--primary)] px-1.5 py-0.5 rounded">
              reviewer tool
            </span>
          </div>

          <div className="space-y-4">
            {/* Latency mode */}
            <div>
              <label className="text-[11px] font-mono uppercase text-[var(--ink-3)] block mb-1.5">
                Simulated Latency
              </label>
              <Segmented
                size="sm"
                className="w-full justify-between"
                value={latency}
                onChange={(val) => setLatency(val as any)}
                options={[
                  { value: 'fast', label: 'Fast (120ms)' },
                  { value: 'realistic', label: 'Realistic' },
                  { value: 'slow', label: 'Slow (2s)' },
                ]}
              />
            </div>

            {/* Error next request */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex flex-col">
                <span className="font-medium text-[var(--ink-1)]">Inject Error</span>
                <span className="text-[11px] text-[var(--ink-3)]">Next call fails with MockError</span>
              </div>
              <Switch
                checked={errorNext}
                onChange={(chk) => setErrorNext(chk)}
              />
            </div>

            {/* Force empty data */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex flex-col">
                <span className="font-medium text-[var(--ink-1)]">Empty Mode</span>
                <span className="text-[11px] text-[var(--ink-3)]">Test empty list & zero states</span>
              </div>
              <Switch
                checked={dataMode === 'empty'}
                onChange={(chk) => setDataMode(chk ? 'empty' : 'normal')}
              />
            </div>

            {/* Reset state */}
            <div className="pt-2 border-t border-[var(--line)]">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center text-xs"
                icon={<RefreshCw className="w-3 h-3" />}
                onClick={() => {
                  resetDemoState();
                  setOpen(false);
                }}
              >
                Reset demo state
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
