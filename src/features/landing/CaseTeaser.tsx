import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

export const CaseTeaser: React.FC = () => {
  return (
    <section className="py-20 border-t border-[var(--line)]">
      <div className="container-site">
        <div className="mb-8">
          <span className="eyebrow">CASE FILE 014 / WORKED INVESTIGATION</span>
          <h2 className="text-3xl font-serif font-medium text-[var(--ink-1)] tracking-tight">
            How I run an ambiguous browser internals investigation.
          </h2>
        </div>

        <Link
          to="/case-files/014"
          className="group block bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--primary)] rounded-[var(--radius-xl)] p-6 sm:p-8 transition-all duration-[var(--dur-fast)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Symptom & Stats */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--sunken)] text-xs font-mono text-[var(--ink-2)] mb-4">
                  <span>Case File 014</span>
                  <span>·</span>
                  <span>M146+p14 Container Crash Cluster</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-medium text-[var(--ink-1)] mb-3 group-hover:text-[var(--primary)] transition-colors">
                  Renderer exits under load on container nodes
                </h3>
                <p className="text-sm text-[var(--ink-2)] leading-relaxed mb-6">
                  Renderer processes silently terminated on container nodes under heavy checkout cart script memory pressure. Traced to 64MB /dev/shm container filesystem quota limit. Fixed by resizing pool to 2GB and adding crash signature enrichment patch p10.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[var(--line)]">
                <div>
                  <div className="text-3xl font-mono font-semibold tabular-nums text-[var(--error)]">
                    3.1%
                  </div>
                  <div className="text-xs text-[var(--ink-3)] mt-0.5">
                    Crash rate on container-shm64
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-mono font-semibold tabular-nums text-emerald-600">
                    0.04%
                  </div>
                  <div className="text-xs text-[var(--ink-3)] mt-0.5">
                    Crash rate across remainder of fleet
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[var(--primary)]">
                <span>Read the full investigation</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1" />
              </div>
            </div>

            {/* Right Column: Hypothesis Board Preview */}
            <div className="lg:col-span-6">
              <div className="dark-well p-5 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[var(--well-muted)] border-b border-[var(--well-line)] pb-2">
                  <span>Hypothesis Board</span>
                  <span className="text-emerald-400 font-semibold">1 Confirmed</span>
                </div>

                {/* H1 */}
                <div className="p-2.5 rounded bg-[var(--well-raised)] border border-[var(--well-line)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--well-muted)]">H1</span>
                    <span className="line-through text-[var(--well-muted)]">Memory leak in renderer</span>
                  </div>
                  <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Ruled out
                  </span>
                </div>

                {/* H2 */}
                <div className="p-2.5 rounded bg-[var(--well-raised)] border border-[var(--well-line)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--well-muted)]">H2</span>
                    <span className="line-through text-[var(--well-muted)]">Downstream patch regression</span>
                  </div>
                  <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Ruled out
                  </span>
                </div>

                {/* H3 */}
                <div className="p-2.5 rounded bg-[var(--well-raised)] border border-[var(--well-line)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--well-muted)]">H3</span>
                    <span className="text-[var(--well-text)]">GPU process failure propagation</span>
                  </div>
                  <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                    <MinusCircle className="w-3.5 h-3.5" /> Narrowed
                  </span>
                </div>

                {/* H4 */}
                <div className="p-2.5 rounded bg-[var(--well-raised)] border border-emerald-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-semibold">H4</span>
                    <span className="text-[var(--well-text)] font-semibold">Shared-memory /dev/shm exhaustion</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};
