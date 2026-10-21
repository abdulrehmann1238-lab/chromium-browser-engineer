import React, { useState } from 'react';
import { cn } from '../../lib/cn';

interface ProblemClass {
  id: string;
  tabLabel: string;
  symptom: string;
  whereILook: string;
  whatIShip: string;
}

const PROBLEMS: ProblemClass[] = [
  {
    id: 'debug',
    tabLabel: 'Debugging and modifying',
    symptom: 'It works in a headful browser and hangs in the container.',
    whereILook: 'Launch flags, sandbox setup, shared memory (/dev/shm partition capacity), GPU initialization fallbacks.',
    whatIShip: 'A minimal patch with a regression guard, written so it can go upstream when it should.',
  },
  {
    id: 'internals',
    tabLabel: 'Internals investigation',
    symptom: 'One navigation in 500 stalls for 30 seconds.',
    whereILook: 'Socket pools and HTTP/2 sessions in the network stack; request queues in the network service.',
    whatIShip: 'A trace, a hypothesis log, and the shortest path to reproduce.',
  },
  {
    id: 'fingerprint',
    tabLabel: 'Fingerprinting and compatibility',
    symptom: 'The same page behaves differently in two environments.',
    whereILook: 'A layer-by-layer comparison: network, navigator, rendering, fonts, locale.',
    whatIShip: 'A report that names the layer that disagrees and the component to inspect.',
  },
  {
    id: 'reliability',
    tabLabel: 'Reliability at scale',
    symptom: 'Crash-free rate dips on one build and nobody knows why.',
    whereILook: 'Crash signatures by build and node type, memory per renderer, cold-start percentiles.',
    whatIShip: 'Views that answer which build, which node, since when.',
  },
  {
    id: 'crossprocess',
    tabLabel: 'Cross-process diagnosis',
    symptom: 'A renderer exits and the parent logs almost nothing.',
    whereILook: 'Process supervision in the browser, IPC disconnects, minidumps.',
    whatIShip: 'Failure reporting that says what died and why.',
  },
];

export const ProblemClasses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('debug');
  const activeProblem = PROBLEMS.find((p) => p.id === activeTab) || PROBLEMS[0];

  return (
    <section className="py-20 border-t border-[var(--line)]">
      <div className="container-site">
        <div className="mb-10">
          <span className="eyebrow">PROBLEM CLASSES</span>
          <h2 className="text-3xl font-serif font-medium text-[var(--ink-1)] tracking-tight">
            Common fleet failure modes I solve.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tab buttons */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            {PROBLEMS.map((prob) => {
              const isSelected = prob.id === activeTab;
              return (
                <button
                  key={prob.id}
                  type="button"
                  onClick={() => setActiveTab(prob.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-[var(--radius-md)] text-xs font-medium transition-all duration-[var(--dur-fast)] cursor-pointer select-none border',
                    isSelected
                      ? 'bg-[var(--primary-subtle)] border-[var(--primary)] text-[var(--primary)] font-semibold'
                      : 'bg-[var(--surface)] border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--line-strong)]'
                  )}
                >
                  {prob.tabLabel}
                </button>
              );
            })}
          </div>

          {/* Definition Panel */}
          <div className="lg:col-span-8 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] p-6 flex flex-col gap-5 transition-all">
            {/* Symptom */}
            <div className="flex flex-col gap-1 border-b border-[var(--line)] pb-4">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-3)]">
                Symptom
              </span>
              <p className="text-base font-semibold text-[var(--ink-1)]">
                {activeProblem.symptom}
              </p>
            </div>

            {/* Where I Look */}
            <div className="flex flex-col gap-1 border-b border-[var(--line)] pb-4">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--primary)]">
                Where I Look
              </span>
              <p className="text-sm text-[var(--ink-2)] leading-relaxed font-mono">
                {activeProblem.whereILook}
              </p>
            </div>

            {/* What I Would Ship */}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-3)]">
                What I Would Ship
              </span>
              <p className="text-sm text-[var(--ink-1)] font-medium leading-relaxed">
                {activeProblem.whatIShip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
