import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatusDot } from '../../design/StatusDot';
import { Button } from '../../design/Button';
import { CodeWell } from '../../components/CodeWell';
import { AnswerCards } from '../landing/Closing/AnswerCards';
import { ContactForm } from '../landing/Closing/ContactForm';
import {
  XCircle,
  CheckCircle2,
  MinusCircle,
  ArrowRight,
  ExternalLink,
  Flame,
  Check,
  Activity,
  Layers,
} from 'lucide-react';

export const CaseFile014: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('symptom');

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const SECTIONS = [
    { id: 'symptom', label: '1. Symptom' },
    { id: 'scope', label: '2. Fleet Scope' },
    { id: 'hypotheses', label: '3. Hypothesis Board' },
    { id: 'evidence', label: '4. Trace Evidence' },
    { id: 'root-cause', label: '5. Root Cause' },
    { id: 'fix', label: '6. Shipped Fix' },
    { id: 'result', label: '7. Result & Recovery' },
    { id: 'components', label: '8. Components Involved' },
  ];

  return (
    <div className="relative flex flex-col">
      {/* 2px Reading Progress Bar at viewport top */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[var(--z-nav)] bg-transparent">
        <div
          className="h-full bg-[var(--primary)] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Article Header */}
      <header className="border-b border-[var(--line)] bg-[var(--surface)] py-16">
        <div className="container-site max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="eyebrow">CASE FILE 014 / WORKED INVESTIGATION</span>
            <span className="px-2 py-0.5 rounded bg-[var(--sunken)] font-mono text-[10px] text-[var(--ink-2)] border border-[var(--line-strong)]">
              Illustrative case
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[var(--ink-1)] tracking-tight leading-tight mb-4">
            Renderer exits under load on container nodes
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--ink-3)] pt-2 border-t border-[var(--line)]">
            <div className="flex items-center gap-1.5">
              <span>Status:</span>
              <StatusDot status="Monitoring" />
            </div>
            <span>·</span>
            <div>Opened: Oct 15, 2026</div>
            <span>·</span>
            <div>Owner: Priya Raman / [YOUR NAME]</div>
            <span>·</span>
            <div className="text-[var(--primary)] font-semibold">
              Components: base/, content/browser/, gpu/
            </div>
          </div>
        </div>
      </header>

      {/* Article Content & Index */}
      <div className="container-site max-w-5xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Reading Column (66ch editorial Newsreader) */}
          <article className="lg:col-span-8 space-y-12 font-serif text-[18px] sm:text-[19px] leading-[1.65] text-[var(--ink-1)]">
            {/* Section 1: Symptom */}
            <section id="symptom" className="space-y-4">
              <h2 className="text-2xl font-serif font-medium text-[var(--ink-1)] tracking-tight border-b border-[var(--line)] pb-2 font-ui">
                1. Observable Symptom
              </h2>
              <p>
                During the rollout of automation suites on the newly provisioned container pool, automation drivers reported frequent abnormal process terminations with error code <code className="font-mono text-sm bg-[var(--sunken)] px-1.5 py-0.5 rounded">Target.targetCrashed</code>. The browser supervisor logged exit signal <code className="font-mono text-sm bg-[var(--sunken)] px-1.5 py-0.5 rounded text-rose-700 font-bold">SIGBUS</code> (Bus Error), accompanied by a "sad tab" display.
              </p>
              <p>
                Critically, the issue was strictly confined to fleet container workers: the exact same script payloads executed cleanly in developer workstation tabs and bare-metal nodes without raising exceptions.
              </p>

              {/* Two Stats Callout */}
              <div className="grid grid-cols-2 gap-4 p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] font-ui not-italic my-6">
                <div>
                  <div className="text-3xl font-mono font-bold tabular-nums text-[var(--error)]">
                    3.1%
                  </div>
                  <div className="text-xs text-[var(--ink-3)] font-mono mt-1">
                    Crash rate on container-shm64 nodes
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-mono font-bold tabular-nums text-emerald-600">
                    0.04%
                  </div>
                  <div className="text-xs text-[var(--ink-3)] font-mono mt-1">
                    Fleet baseline crash rate
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Fleet Scope */}
            <section id="scope" className="space-y-4">
              <h2 className="text-2xl font-serif font-medium text-[var(--ink-1)] tracking-tight border-b border-[var(--line)] pb-2 font-ui">
                2. Fleet Scope & Impact Analysis
              </h2>
              <p>
                Telemetry aggregations isolated the anomaly to node pool <code className="font-mono text-sm bg-[var(--sunken)] px-1.5 py-0.5 rounded">container-shm64</code> starting on October 14. Other pools—including high-memory container workers and microVMs—maintained standard 99.9% uptime.
              </p>

              {/* Bar figure */}
              <div className="dark-well p-5 font-mono text-xs space-y-3 font-ui not-italic my-6">
                <span className="text-[10px] uppercase text-[var(--well-muted)] tracking-wider block">
                  Exits per 1,000 Sessions by Node Type
                </span>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-rose-400 font-semibold">container-shm64</span>
                    <span className="tabular-nums">31 exits (3.1%)</span>
                  </div>
                  <div className="w-full bg-[var(--well-raised)] h-2 rounded overflow-hidden">
                    <div className="bg-[var(--error)] h-full w-[88%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--well-text)]">container-shm2g</span>
                    <span className="tabular-nums">0.5 exits (0.05%)</span>
                  </div>
                  <div className="w-full bg-[var(--well-raised)] h-2 rounded overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[5%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--well-text)]">bare-metal</span>
                    <span className="tabular-nums">0.3 exits (0.03%)</span>
                  </div>
                  <div className="w-full bg-[var(--well-raised)] h-2 rounded overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[3%]" />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Hypothesis Board (P0 interactive) */}
            <section id="hypotheses" className="space-y-4">
              <h2 className="text-2xl font-serif font-medium text-[var(--ink-1)] tracking-tight border-b border-[var(--line)] pb-2 font-ui">
                3. Hypothesis Board
              </h2>
              <p>
                An engineering investigation demands systematic falsification before drawing conclusions. We tracked four competing hypotheses against production telemetry:
              </p>

              {/* Hypothesis Board Cards */}
              <div className="space-y-3 font-ui not-italic my-6">
                {/* H1 */}
                <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[var(--ink-3)]">H1</span>
                      <h4 className="text-sm font-semibold line-through text-[var(--ink-3)]">
                        Memory leak in the renderer process
                      </h4>
                    </div>
                    <p className="text-xs text-[var(--ink-2)]">
                      <strong>Test:</strong> Plotted resident memory (RSS) slopes between crashed and completed runs. Resident memory growth was flat to moderate (under 400 MB), ruling out traditional V8/DOM heap leaks.
                    </p>
                  </div>
                  <span className="font-mono text-xs text-rose-600 font-semibold flex items-center gap-1 shrink-0">
                    <XCircle className="w-4 h-4" /> Ruled out
                  </span>
                </div>

                {/* H2 */}
                <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[var(--ink-3)]">H2</span>
                      <h4 className="text-sm font-semibold line-through text-[var(--ink-3)]">
                        Downstream patch regression in M146
                      </h4>
                    </div>
                    <p className="text-xs text-[var(--ink-2)]">
                      <strong>Test:</strong> Executed reproducible test payload against a clean, vanilla upstream Chromium M146 build. The crash reproduced identically on container nodes.
                    </p>
                  </div>
                  <span className="font-mono text-xs text-rose-600 font-semibold flex items-center gap-1 shrink-0">
                    <XCircle className="w-4 h-4" /> Ruled out
                  </span>
                </div>

                {/* H3 */}
                <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[var(--ink-3)]">H3</span>
                      <h4 className="text-sm font-semibold text-[var(--ink-1)]">
                        GPU process failure propagating to renderers
                      </h4>
                    </div>
                    <p className="text-xs text-[var(--ink-2)]">
                      <strong>Test:</strong> Inspected GPU process crash signatures. The GPU process did not restart; however, fallback software rasterization did increase shared-memory buffer creation.
                    </p>
                  </div>
                  <span className="font-mono text-xs text-amber-700 font-semibold flex items-center gap-1 shrink-0">
                    <MinusCircle className="w-4 h-4" /> Narrowed
                  </span>
                </div>

                {/* H4 */}
                <div className="p-4 bg-[var(--accent-tint)]/30 border-2 border-[var(--accent)] rounded-[var(--radius-lg)] flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[var(--accent-text)]">H4</span>
                      <h4 className="text-sm font-semibold text-[var(--ink-1)]">
                        Shared-memory exhaustion in container /dev/shm filesystem
                      </h4>
                    </div>
                    <p className="text-xs text-[var(--ink-2)]">
                      <strong>Test:</strong> Correlated per-process shared memory allocations against node cgroup tmpfs limits. Every single crashed session touched the exact 64 MB ceiling at the millisecond of death.
                    </p>
                  </div>
                  <span className="font-mono text-xs text-emerald-600 font-semibold flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Confirmed
                  </span>
                </div>
              </div>
            </section>

            {/* Section 4: Trace Evidence */}
            <section id="evidence" className="space-y-4">
              <h2 className="text-2xl font-serif font-medium text-[var(--ink-1)] tracking-tight border-b border-[var(--line)] pb-2 font-ui">
                4. Trace Evidence (ses_7Q2K9M)
              </h2>
              <p>
                In the multi-process trace of session <code className="font-mono text-sm bg-[var(--sunken)] px-1.5 py-0.5 rounded">ses_7Q2K9M</code>, the shared-memory counter climbs steadily as the checkout cart script executes large offscreen canvas decodes.
              </p>

              {/* Trace Excerpt figure */}
              <div className="p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] font-ui not-italic my-6 space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-semibold text-[var(--ink-1)]">
                    Excerpt: Shared Memory Allocation vs 64 MB Ceiling
                  </span>
                  <Link
                    to="/console/sessions/ses_7Q2K9M"
                    className="text-[var(--primary)] hover:underline flex items-center gap-1"
                  >
                    Open the full interactive trace →
                  </Link>
                </div>

                <div className="dark-well p-4 font-mono text-xs space-y-2">
                  <div className="flex justify-between text-[11px] text-[var(--well-muted)]">
                    <span>t = 0.0s (4 MB)</span>
                    <span>t = 2.6s (33 MB)</span>
                    <span>t = 4.4s (63 MB)</span>
                    <span className="text-rose-400 font-bold">t = 4.82s (64 MB LIMIT - SIGBUS)</span>
                  </div>
                  <div className="w-full bg-[var(--well-raised)] h-4 rounded overflow-hidden relative">
                    <div className="h-full bg-[var(--accent)] w-full transition-all" />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Root Cause */}
            <section id="root-cause" className="space-y-4">
              <h2 className="text-2xl font-serif font-medium text-[var(--ink-1)] tracking-tight border-b border-[var(--line)] pb-2 font-ui">
                5. Technical Root Cause
              </h2>
              <p>
                On Linux, Chromium allocates shared-memory segments through POSIX shared memory backed by the <code className="font-mono text-sm bg-[var(--sunken)] px-1.5 py-0.5 rounded">/dev/shm</code> mountpoint (a tmpfs filesystem). This memory backs IPC buffers, Skia software raster tiles, offscreen canvases, and DevTools screenshot snapshots.
              </p>
              <p>
                Standard Docker and OCI container runtimes configure <code className="font-mono text-sm bg-[var(--sunken)] px-1.5 py-0.5 rounded">/dev/shm</code> with a legacy default size of only <strong>64 Megabytes</strong>. When the filesystem exhausts available blocks, the Linux kernel's <code className="font-mono text-sm bg-[var(--sunken)] px-1.5 py-0.5 rounded">mmap()</code> call does not return <code className="font-mono text-sm bg-[var(--sunken)] px-1.5 py-0.5 rounded">NULL</code>; instead, subsequent page writes to the mapped address trigger a synchronous <strong>SIGBUS (Signal 7)</strong> fault.
              </p>

              <CodeWell
                path="base/memory/platform_shared_memory_region_posix.cc"
                code={`// Chromium Posix Shared Memory Allocation
ScopedFD CreateSharedMemoryRegion(size_t size) {
  FilePath path = GetShmDirectory().Append(GenerateUniqueShmFilename());
  ScopedFD fd(HANDLE_EINTR(open(path.value().c_str(), O_RDWR | O_CREAT | O_EXCL, 0600)));
  if (HANDLE_EINTR(ftruncate(fd.get(), size)) < 0) {
    // When /dev/shm is full (64MB), ftruncate fails with ENOSPC
    // If not guarded, subsequent mmap() page fault raises SIGBUS
    return ScopedFD();
  }
  return fd;
}`}
              />
            </section>

            {/* Section 6: Fix */}
            <section id="fix" className="space-y-4">
              <h2 className="text-2xl font-serif font-medium text-[var(--ink-1)] tracking-tight border-b border-[var(--line)] pb-2 font-ui">
                6. Two-Part Remediation
              </h2>
              <p>
                A robust solution requires both infrastructure configuration hardening and downstream Chromium crash telemetry guards:
              </p>
              <ol className="list-decimal pl-6 space-y-3 font-serif">
                <li>
                  <strong>Infrastructure Remediation:</strong> Updated container orchestrator spec to mount an explicit 2 GB <code className="font-mono text-sm bg-[var(--sunken)] px-1.5 py-0.5 rounded">tmpfs</code> volume at <code className="font-mono text-sm bg-[var(--sunken)] px-1.5 py-0.5 rounded">/dev/shm</code> across all worker pools, accompanied by a bootstrap preflight sanity check.
                </li>
                <li>
                  <strong>Downstream Patch p10:</strong> Enriched crash minidump signatures in <code className="font-mono text-sm bg-[var(--sunken)] px-1.5 py-0.5 rounded">components/crash/</code> to query <code className="font-mono text-sm bg-[var(--sunken)] px-1.5 py-0.5 rounded">statvfs("/dev/shm")</code> and attach filesystem capacity watermarks to crash keys upon SIGBUS catches.
                </li>
              </ol>
            </section>

            {/* Section 7: Result */}
            <section id="result" className="space-y-4">
              <h2 className="text-2xl font-serif font-medium text-[var(--ink-1)] tracking-tight border-b border-[var(--line)] pb-2 font-ui">
                7. Verification & Recovery
              </h2>
              <p>
                Following deployment on October 19, the crash-free session rate for build <code className="font-mono text-sm bg-[var(--sunken)] px-1.5 py-0.5 rounded">M146+p14</code> recovered immediately from 99.45% back to 99.78%, matching bare-metal baseline metrics. Zero SIGBUS exit signatures have been observed since deployment.
              </p>
            </section>

            {/* Section 8: Components Involved */}
            <section id="components" className="space-y-4">
              <h2 className="text-2xl font-serif font-medium text-[var(--ink-1)] tracking-tight border-b border-[var(--line)] pb-2 font-ui">
                8. Chromium Components Involved
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs font-ui not-italic">
                <div className="p-3 rounded bg-[var(--surface)] border border-[var(--line)]">
                  <div className="font-semibold text-[var(--primary)]">base/memory/</div>
                  <div className="text-[var(--ink-3)] mt-0.5">POSIX shared memory allocator</div>
                </div>
                <div className="p-3 rounded bg-[var(--surface)] border border-[var(--line)]">
                  <div className="font-semibold text-[var(--primary)]">content/browser/renderer_host/</div>
                  <div className="text-[var(--ink-3)] mt-0.5">Child process termination supervisor</div>
                </div>
                <div className="p-3 rounded bg-[var(--surface)] border border-[var(--line)]">
                  <div className="font-semibold text-[var(--primary)]">components/crash/</div>
                  <div className="text-[var(--ink-3)] mt-0.5">Minidump crash keys & enrichment</div>
                </div>
                <div className="p-3 rounded bg-[var(--surface)] border border-[var(--line)]">
                  <div className="font-semibold text-[var(--primary)]">gpu/, components/viz/</div>
                  <div className="text-[var(--ink-3)] mt-0.5">Software tile rasterization buffer sink</div>
                </div>
              </div>
            </section>
          </article>

          {/* Sticky On This Page Index (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] font-mono text-xs">
              <span className="text-[10px] uppercase text-[var(--ink-3)] font-bold block mb-3">
                On This Page
              </span>
              <nav className="space-y-1.5">
                {SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block text-[var(--ink-2)] hover:text-[var(--primary)] transition-colors py-0.5"
                  >
                    {sec.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="p-4 bg-[var(--sunken)] border border-[var(--line)] rounded-[var(--radius-lg)] text-xs font-mono space-y-2">
              <span className="font-semibold text-[var(--ink-1)] block">Diagnostic Takeaway</span>
              <p className="text-[var(--ink-2)] leading-relaxed">
                When containerized Chromium crashes with SIGBUS under canvas/image load, check <code className="text-[var(--primary)] font-bold">/dev/shm</code> before hunting memory leaks.
              </p>
            </div>

            <Link to="/console/sessions/ses_7Q2K9M">
              <Button variant="primary" size="sm" className="w-full justify-center">
                Open ses_7Q2K9M Trace
              </Button>
            </Link>
          </aside>
        </div>
      </div>

      {/* Closing Section attached to Case File */}
      <section className="bg-[var(--well-bg)] text-[var(--well-text)] py-20 border-t border-[var(--well-line)] mt-12">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-8">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--well-ring)]">
              PROPOSAL & NEXT STEPS
            </span>
            <h3 className="text-2xl font-serif font-medium text-[var(--well-text)] mt-1">
              Ready to discuss your Chromium infrastructure challenges.
            </h3>
          </div>
          <AnswerCards />
          <div className="mt-12 pt-8 border-t border-[var(--well-line)]">
            <ContactForm onSuccess={() => {}} />
          </div>
        </div>
      </section>
    </div>
  );
};
