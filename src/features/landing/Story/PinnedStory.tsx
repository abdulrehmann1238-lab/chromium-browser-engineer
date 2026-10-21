import React, { useState } from 'react';
import { cn } from '../../../lib/cn';

export const PinnedStory: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <section className="py-24 border-t border-[var(--line)]">
      <div className="container-site">
        <div className="mb-12">
          <span className="eyebrow">HOW I READ A BROWSER</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[var(--ink-1)] tracking-tight max-w-2xl">
            A methodical inward traversal: from network sockets to the display frame.
          </h2>
        </div>

        {/* Step Selector / Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Steps column (left) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Step 1 */}
            <div
              onClick={() => setActiveStep(1)}
              role="button"
              tabIndex={0}
              className={cn(
                'p-6 rounded-[var(--radius-lg)] border transition-all duration-[var(--dur-base)] cursor-pointer text-left',
                activeStep === 1
                  ? 'bg-[var(--surface)] border-[var(--primary)] shadow-sm'
                  : 'bg-transparent border-[var(--line)] hover:border-[var(--line-strong)]'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={cn(
                    'font-mono text-sm font-semibold tabular-nums',
                    activeStep === 1 ? 'text-[var(--primary)]' : 'text-[var(--ink-3)]'
                  )}
                >
                  01
                </span>
                <h3 className="text-base font-semibold text-[var(--ink-1)]">Networking</h3>
              </div>
              <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                Start where the bytes enter. Many bugs that look like rendering problems are requests that waited for the wrong thing. I trace outward from the network service: connection reuse, queueing, priority, then the hand-off to the renderer.
              </p>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => setActiveStep(2)}
              role="button"
              tabIndex={0}
              className={cn(
                'p-6 rounded-[var(--radius-lg)] border transition-all duration-[var(--dur-base)] cursor-pointer text-left',
                activeStep === 2
                  ? 'bg-[var(--surface)] border-[var(--primary)] shadow-sm'
                  : 'bg-transparent border-[var(--line)] hover:border-[var(--line-strong)]'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={cn(
                    'font-mono text-sm font-semibold tabular-nums',
                    activeStep === 2 ? 'text-[var(--primary)]' : 'text-[var(--ink-3)]'
                  )}
                >
                  02
                </span>
                <h3 className="text-base font-semibold text-[var(--ink-1)]">Processes</h3>
              </div>
              <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                Then ask which process owns the problem. A crash, a stall and a leak look the same from a driver script. They live in different processes with different lifetimes. Find the owner first and the fix usually gets smaller.
              </p>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => setActiveStep(3)}
              role="button"
              tabIndex={0}
              className={cn(
                'p-6 rounded-[var(--radius-lg)] border transition-all duration-[var(--dur-base)] cursor-pointer text-left',
                activeStep === 3
                  ? 'bg-[var(--surface)] border-[var(--primary)] shadow-sm'
                  : 'bg-transparent border-[var(--line)] hover:border-[var(--line-strong)]'
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={cn(
                    'font-mono text-sm font-semibold tabular-nums',
                    activeStep === 3 ? 'text-[var(--accent-text)]' : 'text-[var(--ink-3)]'
                  )}
                >
                  03
                </span>
                <h3 className="text-base font-semibold text-[var(--ink-1)]">Rendering</h3>
              </div>
              <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                Finally, follow the frame. Main thread, compositor, GPU process. A dropped frame is often one thread waiting on another, not slow drawing.
              </p>
            </div>
          </div>

          {/* Visualization stage (right) */}
          <div className="lg:col-span-7 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] p-6 min-h-[420px] flex flex-col justify-center">
            {activeStep === 1 && (
              <div className="flex flex-col gap-5 animate-reveal">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                  <span className="font-mono text-xs text-[var(--ink-3)] uppercase">
                    Network Service Request Lifecycle
                  </span>
                  <span className="font-mono text-xs text-[var(--primary)]">services/network/</span>
                </div>

                {/* Waterfall dark well */}
                <div className="dark-well p-5 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[var(--well-muted)] border-b border-[var(--well-line)] pb-2">
                    <span>Phase</span>
                    <span>Timing</span>
                  </div>

                  {/* DNS */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[var(--well-text)]">
                      <span>DNS Lookup</span>
                      <span>70ms</span>
                    </div>
                    <div className="w-full bg-[var(--well-raised)] h-2 rounded overflow-hidden">
                      <div className="bg-[#8FAFCB] h-full w-[20%] transition-all duration-500" />
                    </div>
                  </div>

                  {/* TCP */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[var(--well-text)]">
                      <span>TCP Connect</span>
                      <span>70ms</span>
                    </div>
                    <div className="w-full bg-[var(--well-raised)] h-2 rounded overflow-hidden">
                      <div className="bg-[#8FAFCB] h-full w-[35%] transition-all duration-500" />
                    </div>
                  </div>

                  {/* TLS */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[var(--well-text)]">
                      <span>TLS 1.3 Handshake (h2)</span>
                      <span>120ms</span>
                    </div>
                    <div className="w-full bg-[var(--well-raised)] h-2 rounded overflow-hidden">
                      <div className="bg-[#9FC0B8] h-full w-[55%] transition-all duration-500" />
                    </div>
                  </div>

                  {/* TTFB */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[var(--well-text)]">
                      <span>Wait (TTFB / Egress Proxy)</span>
                      <span>290ms</span>
                    </div>
                    <div className="w-full bg-[var(--well-raised)] h-2 rounded overflow-hidden">
                      <div className="bg-[#D5B27A] h-full w-[80%] transition-all duration-500" />
                    </div>
                  </div>

                  {/* Stream */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[var(--well-text)]">
                      <span>Content Download (Stream)</span>
                      <span>330ms</span>
                    </div>
                    <div className="w-full bg-[var(--well-raised)] h-2 rounded overflow-hidden">
                      <div className="bg-[#B79CC4] h-full w-[100%] transition-all duration-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="flex flex-col gap-5 animate-reveal">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                  <span className="font-mono text-xs text-[var(--ink-3)] uppercase">
                    Process Ownership & Sandbox Hierarchy
                  </span>
                  <span className="font-mono text-xs text-[var(--primary)]">content/browser/</span>
                </div>

                <div className="dark-well p-5 font-mono text-xs space-y-3">
                  {/* Browser */}
                  <div className="p-2.5 rounded bg-[var(--well-raised)] border border-[var(--well-line)] flex items-center justify-between">
                    <div>
                      <span className="text-emerald-400 font-semibold">[Browser]</span> pid 1204
                      (Supervisor)
                    </div>
                    <span className="text-[var(--well-muted)]">286 MB RSS</span>
                  </div>

                  <div className="pl-6 space-y-2 border-l border-[var(--well-line)] ml-4">
                    {/* Network Service */}
                    <div className="p-2 rounded bg-[var(--well-raised)] border border-[var(--well-line)] flex items-center justify-between">
                      <div>
                        <span className="text-[#8FAFCB] font-semibold">[Network]</span> pid 1220
                        (Socket Broker)
                      </div>
                      <span className="text-[var(--well-muted)]">74 MB RSS</span>
                    </div>

                    {/* GPU */}
                    <div className="p-2 rounded bg-[var(--well-raised)] border border-[var(--well-line)] flex items-center justify-between">
                      <div>
                        <span className="text-[#B79CC4] font-semibold">[GPU/Viz]</span> pid 1228
                        (Compositor)
                      </div>
                      <span className="text-[var(--well-muted)]">143 MB RSS</span>
                    </div>

                    {/* Renderer */}
                    <div className="p-2 rounded bg-[var(--well-raised)] border border-[var(--well-line)] flex items-center justify-between">
                      <div>
                        <span className="text-[#D5B27A] font-semibold">[Renderer]</span> pid 1318
                        (checkout.halcyon.test)
                      </div>
                      <span className="text-[var(--accent-text)] font-semibold">398 MB RSS</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="flex flex-col gap-5 animate-reveal">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                  <span className="font-mono text-xs text-[var(--ink-3)] uppercase">
                    Rendering Frame Pipeline
                  </span>
                  <span className="font-mono text-xs text-[var(--accent-text)]">1 late frame observed</span>
                </div>

                <div className="dark-well p-6 flex flex-col justify-center">
                  <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
                    <div className="p-3 bg-[var(--well-raised)] border border-[var(--well-line)] rounded">
                      <div className="text-[#D5B27A] font-semibold mb-1">Blink Main</div>
                      <div className="text-[10px] text-[var(--well-muted)]">DOM, Style, V8</div>
                    </div>
                    <div className="p-3 bg-[var(--well-raised)] border border-[var(--well-line)] rounded">
                      <div className="text-[#9FC0B8] font-semibold mb-1">Compositor</div>
                      <div className="text-[10px] text-[var(--well-muted)]">Scroll, Tiling</div>
                    </div>
                    <div className="p-3 bg-[var(--well-raised)] border border-[var(--well-line)] rounded">
                      <div className="text-[#B79CC4] font-semibold mb-1">Viz / GPU</div>
                      <div className="text-[10px] text-[var(--well-muted)]">GL / Skia Raster</div>
                    </div>
                    <div className="p-3 bg-[var(--well-raised)] border border-[var(--well-line)] rounded">
                      <div className="text-emerald-400 font-semibold mb-1">Display</div>
                      <div className="text-[10px] text-[var(--well-muted)]">VSync Frame</div>
                    </div>
                  </div>

                  {/* Frame Token Simulation */}
                  <div className="mt-8 pt-4 border-t border-[var(--well-line)]">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--well-muted)] mb-2">
                      <span>Pipeline execution</span>
                      <span className="text-[var(--accent-text)] font-semibold">t = 16.6ms deadline exceeded (34.2ms)</span>
                    </div>
                    <div className="w-full bg-[var(--well-raised)] h-2 rounded overflow-hidden relative">
                      <div className="absolute left-0 top-0 bottom-0 bg-[var(--accent)] w-12 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
