import React from 'react';

interface Phase {
  title: string;
  days: string;
  description: string;
}

const PHASES: Phase[] = [
  {
    days: 'Days 1 to 14',
    title: 'Reproduce and instrument',
    description: 'Get the build pipeline running, reproduce the top failure signatures, add the counters that are missing.',
  },
  {
    days: 'Days 15 to 45',
    title: 'Fix and guard',
    description: 'Land targeted patches, each with a regression guard and a note on whether it should go upstream.',
  },
  {
    days: 'Days 46 to 90',
    title: 'Rebase and harden',
    description: 'Make the rebase onto the next milestone routine, shrink the patch stack, write down what we learned about the internals.',
  },
];

export const Ninety: React.FC = () => {
  return (
    <section className="py-20 border-t border-[var(--line)]">
      <div className="container-site">
        <div className="mb-10">
          <span className="eyebrow">ENGAGEMENT TIMELINE</span>
          <h2 className="text-3xl font-serif font-medium text-[var(--ink-1)] tracking-tight">
            First 90 days: structured onboarding & hardening.
          </h2>
        </div>

        {/* 3 Horizontal Phases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (desktop only) */}
          <div className="hidden md:block absolute top-[21px] left-6 right-6 h-[1px] bg-[var(--line-strong)] z-0" />

          {PHASES.map((phase, idx) => (
            <div key={idx} className="relative z-10 flex flex-col pt-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[var(--elevated)] border-2 border-[var(--primary)] flex items-center justify-center font-mono text-xs font-semibold text-[var(--primary)] shadow-sm">
                  0{idx + 1}
                </span>
                <span className="font-mono text-xs text-[var(--ink-3)] uppercase tracking-wider">
                  {phase.days}
                </span>
              </div>

              <h4 className="text-base font-semibold text-[var(--ink-1)] mb-2">
                {phase.title}
              </h4>
              <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                {phase.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-xs font-mono text-[var(--ink-3)] text-center md:text-left">
          An example shape, adjusted after week one.
        </div>
      </div>
    </section>
  );
};
