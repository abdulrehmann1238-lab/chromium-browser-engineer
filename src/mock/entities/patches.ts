import { Patch } from '../types';

export const initialPatches: Patch[] = [
  {
    id: 'p01',
    title: 'Make crash report upload configurable',
    touches: 'components/crash/',
    risk: 'Low',
    owner: 'Priya Raman',
    upstreamStatus: 'Upstreamable',
    rebaseStatus: 'Clean',
    linesAdded: 34,
    linesRemoved: 6,
    description: 'Allows fleet agent to inject crash report destination URLs and suppress user-facing crash dialogs in headless automation mode.',
  },
  {
    id: 'p02',
    title: 'Stable process naming for fleet telemetry',
    touches: 'content/browser/',
    risk: 'Low',
    owner: 'Tomas Becker',
    upstreamStatus: 'Downstream only',
    rebaseStatus: 'Clean',
    linesAdded: 48,
    linesRemoved: 12,
    description: 'Embeds deterministic node identifiers and session UUIDs into OS process title strings (/proc/self/cmdline).',
  },
  {
    id: 'p03',
    title: 'Expose per-process memory counters',
    touches: 'base/trace_event/',
    risk: 'Low',
    owner: 'Lena Sorensen',
    upstreamStatus: 'Upstreamable',
    rebaseStatus: 'Clean',
    linesAdded: 82,
    linesRemoved: 15,
    description: 'Hooks into base::trace_event::MemoryDumpProvider to emit periodic shared-memory and resident set metrics.',
  },
  {
    id: 'p04',
    title: 'Quieter first-run and profile bootstrap',
    touches: 'chrome/browser/',
    risk: 'Low',
    owner: 'Tomas Becker',
    upstreamStatus: 'Downstream only',
    rebaseStatus: 'Clean',
    linesAdded: 22,
    linesRemoved: 9,
    description: 'Suppresses first-run import wizards, default browser prompts, and metric consent popups on ephemeral profile creation.',
  },
  {
    id: 'p05',
    title: 'Disable background networking unused in fleet',
    touches: 'components/',
    risk: 'Low',
    owner: 'Lena Sorensen',
    upstreamStatus: 'Downstream only',
    rebaseStatus: 'Clean',
    linesAdded: 18,
    linesRemoved: 54,
    description: 'Strips out NTP sync, captive portal probes, and safe browsing download verifications inside container nodes.',
  },
  {
    id: 'p06',
    title: 'Deterministic locale and timezone handoff',
    touches: 'content/browser/, content/renderer/',
    risk: 'Medium',
    owner: 'Aiyana Whitfield',
    upstreamStatus: 'Downstream only',
    rebaseStatus: 'Clean',
    linesAdded: 95,
    linesRemoved: 24,
    description: 'Passes host profile timezone and ICU format definitions directly to Blink workers to prevent container UTC drift.',
  },
  {
    id: 'p07',
    title: 'Container-aware GPU initialization fallback',
    touches: 'gpu/, content/browser/gpu/',
    risk: 'Medium',
    owner: 'Marek Dvorak',
    upstreamStatus: 'Upstreamable',
    rebaseStatus: 'Clean',
    linesAdded: 112,
    linesRemoved: 30,
    description: 'Detects missing DRI/DRM device nodes in Linux containers and immediately selects Skia software rasterizer without blocking GL probe timeouts.',
  },
  {
    id: 'p08',
    title: 'Socket pool telemetry',
    touches: 'services/network/, net/socket/',
    risk: 'Medium',
    owner: 'Lena Sorensen',
    upstreamStatus: 'Downstream only',
    rebaseStatus: 'Clean',
    linesAdded: 76,
    linesRemoved: 18,
    description: 'Instruments ClientSocketPool to expose socket queue depth, stall times, and TCP handshake latency metrics over IPC.',
  },
  {
    id: 'p09',
    title: 'Renderer launch flag plumbing',
    touches: 'content/browser/renderer_host/',
    risk: 'Medium',
    owner: 'Priya Raman',
    upstreamStatus: 'Downstream only',
    rebaseStatus: 'Conflict',
    linesAdded: 64,
    linesRemoved: 14,
    description: 'Propagates custom supervisor cgroup restrictions and shared-memory allocator flags into RenderProcessHostImpl.',
    conflictDetails: {
      file: 'content/browser/renderer_host/render_process_host_impl.cc',
      upstreamSnippet: `// Upstream M147 refactored child process launch options
void RenderProcessHostImpl::AppendExtraCommandLineSwitches(base::CommandLine* cmd_line) {
  cmd_line->AppendSwitch(switches::kEnableUnsafeWebGPU);
  mojo::BinderMap::RegisterProcess(cmd_line);
}`,
      patchSnippet: `// Our downstream patch p09
void RenderProcessHostImpl::AppendExtraCommandLineSwitches(base::CommandLine* cmd_line) {
  cmd_line->AppendSwitchASCII(switches::kShmQuotaLimit, GetShmQuota());
  cmd_line->AppendSwitch(switches::kFleetManagedSupervisor);
}`,
      suggestion: 'Merge both switch blocks, preserving upstream Mojo registration while maintaining fleet quota switches.',
      mergedSnippet: `void RenderProcessHostImpl::AppendExtraCommandLineSwitches(base::CommandLine* cmd_line) {
  cmd_line->AppendSwitch(switches::kEnableUnsafeWebGPU);
  mojo::BinderMap::RegisterProcess(cmd_line);
  cmd_line->AppendSwitchASCII(switches::kShmQuotaLimit, GetShmQuota());
  cmd_line->AppendSwitch(switches::kFleetManagedSupervisor);
}`,
    },
  },
  {
    id: 'p10',
    title: 'Crash signature enrichment (shared memory usage)',
    touches: 'components/crash/, base/',
    risk: 'Medium',
    owner: 'Priya Raman',
    upstreamStatus: 'Upstreamable',
    rebaseStatus: 'Clean',
    linesAdded: 88,
    linesRemoved: 12,
    description: 'Enriches minidump crash keys with current /dev/shm allocated byte counts upon SIGBUS and SIGSEGV catches.',
  },
  {
    id: 'p11',
    title: 'DevTools event passthrough for fleet supervisor',
    touches: 'content/browser/devtools/',
    risk: 'Medium',
    owner: 'Aiyana Whitfield',
    upstreamStatus: 'Downstream only',
    rebaseStatus: 'Conflict',
    linesAdded: 104,
    linesRemoved: 28,
    description: 'Bypasses CDP JSON serialization overhead for internal supervisor telemetry streams.',
    conflictDetails: {
      file: 'content/browser/devtools/devtools_instrumentation.cc',
      upstreamSnippet: `// Upstream M147 signature update
void OnFrameNavigated(RenderFrameHostImpl* frame, const GURL& url) {
  DevToolsAgentHostImpl::NotifyNavigated(frame, url);
}`,
      patchSnippet: `// Our downstream patch p11
void OnFrameNavigated(RenderFrameHostImpl* frame, const GURL& url) {
  NotifyFleetSupervisorFastPath(frame->GetProcess()->GetID(), url);
  DevToolsAgentHostImpl::NotifyNavigated(frame, url);
}`,
      suggestion: 'Preserve NotifyFleetSupervisorFastPath call before upstream DevToolsAgentHostImpl dispatch.',
      mergedSnippet: `void OnFrameNavigated(RenderFrameHostImpl* frame, const GURL& url) {
  NotifyFleetSupervisorFastPath(frame->GetProcess()->GetID(), url);
  DevToolsAgentHostImpl::NotifyNavigated(frame, url);
}`,
    },
  },
  {
    id: 'p12',
    title: 'Headless profile storage quota policy',
    touches: 'components/',
    risk: 'Low',
    owner: 'Tomas Becker',
    upstreamStatus: 'Downstream only',
    rebaseStatus: 'Clean',
    linesAdded: 42,
    linesRemoved: 8,
    description: 'Enforces hard 500 MB quota on ephemeral IndexedDB storage per session to prevent disk bloat.',
  },
  {
    id: 'p13',
    title: 'Disable unneeded component updater checks',
    touches: 'components/component_updater/',
    risk: 'Low',
    owner: 'Tomas Becker',
    upstreamStatus: 'Downstream only',
    rebaseStatus: 'Clean',
    linesAdded: 16,
    linesRemoved: 40,
    description: 'Disables background CRLSet and Widevine component update pings across ephemeral worker sessions.',
  },
  {
    id: 'p14',
    title: 'Backoff on renderer respawn loops',
    touches: 'content/browser/renderer_host/',
    risk: 'High',
    owner: 'Priya Raman',
    upstreamStatus: 'Downstream only',
    rebaseStatus: 'Conflict',
    linesAdded: 130,
    linesRemoved: 44,
    description: 'Implements exponential backoff when a site repeatedly crashes within a 10-second threshold to prevent thrashing.',
    conflictDetails: {
      file: 'content/browser/renderer_host/render_process_host_impl.cc',
      upstreamSnippet: `// Upstream M147 restart policy
bool ShouldRestartProcess(RenderProcessHostImpl* host) {
  return host->GetFastShutdownCount() < 3;
}`,
      patchSnippet: `// Our downstream patch p14 backoff loop
bool ShouldRestartProcess(RenderProcessHostImpl* host) {
  return FleetBackoffController::CanRestart(host->GetID());
}`,
      suggestion: 'Delegate to FleetBackoffController with fallback to upstream fast shutdown counter.',
      mergedSnippet: `bool ShouldRestartProcess(RenderProcessHostImpl* host) {
  if (!FleetBackoffController::CanRestart(host->GetID())) return false;
  return host->GetFastShutdownCount() < 3;
}`,
    },
  },
];
