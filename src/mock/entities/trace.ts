import { TraceData, TraceSpan } from '../types';

export const heroTrace: TraceData = {
  sessionId: 'ses_7Q2K9M',
  targetHost: 'https://checkout.halcyon.test/cart',
  totalDuration: 4.86,
  ceilingMB: 64,
  sharedMemorySeries: [
    { time: 0.0, mb: 4 },
    { time: 0.8, mb: 9 },
    { time: 1.4, mb: 15 },
    { time: 2.0, mb: 24 },
    { time: 2.6, mb: 33 },
    { time: 3.2, mb: 46 },
    { time: 3.8, mb: 58 },
    { time: 4.4, mb: 63 },
    { time: 4.82, mb: 64 },
  ],
  spans: [
    // CDP Lane
    {
      id: 'span_cdp_1',
      lane: 'cdp',
      name: 'Page.navigate',
      start_s: 0.0,
      end_s: 0.04,
      detail: 'url=https://checkout.halcyon.test/cart',
      summary: 'Automation driver initiates top-level frame navigation via DevTools protocol.',
      componentPath: 'content/browser/devtools/protocol/page_handler.cc',
      pseudocode: `DispatchResponse PageHandler::Navigate(const String& url) {
  NavigationController::LoadURLParams params(url);
  params.transition_type = ui::PAGE_TRANSITION_TYPED;
  web_contents()->GetController().LoadURLWithParams(params);
  return Response::Success();
}`,
      whyItMatters: 'Marks the exact kickoff moment of user navigation from Playwright.',
    },
    {
      id: 'span_cdp_2',
      lane: 'cdp',
      name: 'Runtime.evaluate',
      start_s: 3.9,
      end_s: 3.93,
      detail: 'expression length 212',
      summary: 'Script injection poll query checking checkout state machine readiness.',
      componentPath: 'third_party/blink/renderer/core/inspector/v8_inspector.cc',
      pseudocode: `v8::Local<v8::Value> EvaluateScript(v8::Context context, String source) {
  v8::ScriptCompiler::Source script_source(ToV8String(source));
  return v8::ScriptCompiler::Compile(context, &script_source)->Run(context);
}`,
      whyItMatters: 'Automation driver polling state before renderer crash.',
    },
    {
      id: 'span_cdp_3',
      lane: 'cdp',
      name: 'Page.captureScreenshot',
      start_s: 4.6,
      end_s: 4.78,
      detail: 'format=png',
      summary: 'Driver requested viewport snapshot, allocating shared raster memory backing.',
      componentPath: 'content/browser/renderer_host/render_widget_host_view_aura.cc',
      pseudocode: `void CopyFromSurface(const gfx::Rect& src_rect, CopyFromSurfaceCallback callback) {
  viz::CopyOutputRequest request(viz::CopyOutputRequest::ResultFormat::RGBA);
  request.set_result_selection(src_rect);
  surface_layer_->RequestCopyOfOutput(std::move(request));
}`,
      whyItMatters: 'High-memory snapshot request accelerated /dev/shm partition exhaustion.',
    },
    {
      id: 'span_cdp_4',
      lane: 'cdp',
      name: 'Inspector.targetCrashed',
      start_s: 4.82,
      end_s: 4.82,
      detail: 'event',
      summary: 'DevTools session notified that target renderer process terminated unexpectedly.',
      componentPath: 'content/browser/devtools/devtools_session.cc',
      pseudocode: `void DevToolsSession::TargetCrashed() {
  SendNotification(Inspector::targetCrashed::Notification::Create());
}`,
      whyItMatters: 'The exact point where Playwright test framework receives failure notification.',
    },

    // Browser Lane
    {
      id: 'span_browser_1',
      lane: 'browser',
      name: 'Navigation start',
      start_s: 0.0,
      end_s: 0.12,
      detail: 'NavigationRequest created',
      summary: 'Browser process allocates NavigationRequest and checks isolation policy.',
      componentPath: 'content/browser/renderer_host/navigation_request.cc',
      pseudocode: `std::unique_ptr<NavigationRequest> NavigationRequest::Create(
    NavigationControllerImpl* controller, const LoadURLParams& params) {
  auto request = std::make_unique<NavigationRequest>(controller, params);
  request->CheckSiteIsolationPolicy();
  return request;
}`,
      whyItMatters: 'Initializes Mojo pipe to Network Service for document loader.',
    },
    {
      id: 'span_browser_2',
      lane: 'browser',
      name: 'Renderer process launch',
      start_s: 0.02,
      end_s: 0.31,
      detail: 'child process launcher; sandbox init',
      summary: 'ChildProcessLauncher forks sandboxed renderer with seccomp-bpf filters.',
      componentPath: 'content/browser/child_process_launcher.cc',
      pseudocode: `void LaunchRenderer(CommandLine cmd_line) {
  cmd_line.AppendSwitch(switches::kProcessTypeRenderer);
  sandbox::policy::InitSeccompFilters(&cmd_line);
  base::LaunchProcess(cmd_line, options);
}`,
      whyItMatters: 'Spawns PID 4131 sandboxed inside container cgroup.',
    },
    {
      id: 'span_browser_3',
      lane: 'browser',
      name: 'Commit navigation',
      start_s: 0.71,
      end_s: 0.74,
      detail: 'frame host commit',
      summary: 'Frame host commits URL security origin and binds Blink document loader.',
      componentPath: 'content/browser/renderer_host/render_frame_host_impl.cc',
      pseudocode: `void CommitNavigation(mojom::DidCommitProvisionalLoadParamsPtr params) {
  SetLastCommittedOrigin(params->origin);
  NotifyNavigationFinished(NavigationHandle::From(params));
}`,
      whyItMatters: 'Locks renderer process to checkout.halcyon.test origin.',
    },
    {
      id: 'span_browser_4',
      lane: 'browser',
      name: 'Process exit observed',
      start_s: 4.82,
      end_s: 4.86,
      detail: 'SIGBUS; sad tab shown',
      summary: 'Browser observed child IPC disconnect: child terminated with signal 7 (SIGBUS).',
      componentPath: 'content/browser/renderer_host/render_process_host_impl.cc',
      pseudocode: `void RenderProcessHostImpl::ProcessDied(ChildProcessTerminationInfo info) {
  RecordCrashSignature(info.exit_code, info.exit_status);
  NotifyRenderProcessGone(info);
  ShowSadTab(render_widget_host());
  ScheduleRespawnIfPolicyAllows(site_instance_);
}`,
      whyItMatters: 'The browser caught the abnormal termination and logged exit status.',
    },

    // Network Lane
    {
      id: 'span_net_1',
      lane: 'network',
      name: 'DNS lookup',
      start_s: 0.12,
      end_s: 0.19,
      detail: 'checkout.halcyon.test',
      summary: 'Async host resolver queried local DNS daemon for checkout domain IP.',
      componentPath: 'net/dns/host_resolver_manager.cc',
    },
    {
      id: 'span_net_2',
      lane: 'network',
      name: 'TCP connect',
      start_s: 0.19,
      end_s: 0.26,
      detail: 'SYN/ACK 70ms RTT',
      componentPath: 'net/socket/tcp_client_socket.cc',
    },
    {
      id: 'span_net_3',
      lane: 'network',
      name: 'TLS handshake',
      start_s: 0.26,
      end_s: 0.38,
      detail: 'h2 negotiated',
      summary: 'TLS 1.3 session established with ALPN selecting HTTP/2 protocol.',
      componentPath: 'net/ssl/ssl_client_socket_impl.cc',
    },
    {
      id: 'span_net_4',
      lane: 'network',
      name: 'Request: document',
      start_s: 0.38,
      end_s: 0.71,
      detail: 'first byte after 0.29 s',
      summary: 'Streamed HTML payload from edge caching gateway.',
      componentPath: 'services/network/url_loader.cc',
    },
    {
      id: 'span_net_5',
      lane: 'network',
      name: 'Request: app.js',
      start_s: 0.78,
      end_s: 1.31,
      detail: '412 KB',
      componentPath: 'services/network/url_loader.cc',
    },
    {
      id: 'span_net_6',
      lane: 'network',
      name: 'Request: styles.css',
      start_s: 0.78,
      end_s: 0.95,
      detail: '38 KB',
      componentPath: 'services/network/url_loader.cc',
    },
    {
      id: 'span_net_7',
      lane: 'network',
      name: 'Request: hero.avif',
      start_s: 0.95,
      end_s: 2.1,
      detail: '1.2 MB',
      componentPath: 'services/network/url_loader.cc',
    },
    {
      id: 'span_net_8',
      lane: 'network',
      name: 'Request: /api/cart',
      start_s: 1.4,
      end_s: 2.05,
      detail: 'JSON',
      componentPath: 'services/network/url_loader.cc',
    },

    // Renderer Lane
    {
      id: 'span_rend_1',
      lane: 'renderer',
      name: 'Parse HTML',
      start_s: 0.74,
      end_s: 0.92,
      detail: 'Tokens: 4,120',
      summary: 'Blink HTMLTokenizer parses incoming document stream into DOM tree.',
      componentPath: 'third_party/blink/renderer/core/html/parser/html_document_parser.cc',
    },
    {
      id: 'span_rend_2',
      lane: 'renderer',
      name: 'Style and layout',
      start_s: 0.92,
      end_s: 1.1,
      detail: 'Recalc 380 elements',
      componentPath: 'third_party/blink/renderer/core/css/style_engine.cc',
    },
    {
      id: 'span_rend_3',
      lane: 'renderer',
      name: 'Evaluate app.js',
      start_s: 1.31,
      end_s: 2.05,
      detail: '0.74 s of script',
      summary: 'V8 runtime initializes React checkout bundle and cart state controllers.',
      componentPath: 'third_party/blink/renderer/bindings/core/v8/v8_script_runner.cc',
    },
    {
      id: 'span_rend_4',
      lane: 'renderer',
      name: 'Layout',
      start_s: 2.05,
      end_s: 2.3,
      detail: 'LayoutNG block formatting',
      componentPath: 'third_party/blink/renderer/core/layout/ng/ng_block_layout_algorithm.cc',
    },
    {
      id: 'span_rend_5',
      lane: 'renderer',
      name: 'Script: render cart',
      start_s: 2.5,
      end_s: 3.7,
      detail: '1.2 s long task; allocates large buffers',
      summary: 'Long task in Blink main thread rendering items, image decodes, and state graphs.',
      componentPath: 'third_party/blink/renderer/core/scheduler/main_thread_task_queue.cc',
      pseudocode: `void ExecuteLongCartRender() {
  auto* buffer = AllocateOffscreenCanvas(1920, 1080);
  RenderProductThumbnails(buffer);
  base::SharedMemoryCreate(buffer->ByteLength());
}`,
      whyItMatters: 'Allocates multiple offscreen canvas backing buffers in shared memory.',
    },
    {
      id: 'span_rend_6',
      lane: 'renderer',
      name: 'Paint',
      start_s: 3.7,
      end_s: 3.9,
      detail: 'Display item list generated',
      componentPath: 'third_party/blink/renderer/core/paint/paint_layer.cc',
    },

    // GPU Lane
    {
      id: 'span_gpu_1',
      lane: 'gpu',
      name: 'Raster (software)',
      start_s: 1.0,
      end_s: 1.22,
      detail: 'Software rasterizer fallback',
      summary: 'Container lacks hardware GPU node; Skia software rasterizer writes tiles to shm.',
      componentPath: 'gpu/command_buffer/service/raster_decoder.cc',
    },
    {
      id: 'span_gpu_2',
      lane: 'gpu',
      name: 'Raster (software)',
      start_s: 2.3,
      end_s: 2.62,
      detail: 'Software rasterizer fallback',
      componentPath: 'gpu/command_buffer/service/raster_decoder.cc',
    },
    {
      id: 'span_gpu_3',
      lane: 'gpu',
      name: 'Raster and composite (software)',
      start_s: 3.75,
      end_s: 3.98,
      detail: 'Large tile allocations',
      summary: 'Software rasterizer composites layer tree directly into shared memory buffers.',
      componentPath: 'components/viz/service/display/software_renderer.cc',
    },
    {
      id: 'span_gpu_4',
      lane: 'gpu',
      name: 'Frame submission',
      start_s: 3.98,
      end_s: 4.05,
      detail: 'last frame before exit',
      summary: 'Viz compositor submitted frame #41; subsequent buffer alloc failed with SIGBUS.',
      componentPath: 'components/viz/service/frame_sinks/compositor_frame_sink_support.cc',
      whyItMatters: 'Final successful frame rendered before shared memory exhaustion.',
    },
  ],
};

export const baselineTrace: TraceData = {
  sessionId: 'ses_4F8TW1',
  targetHost: 'https://checkout.halcyon.test/cart',
  totalDuration: 5.9,
  ceilingMB: 8192,
  isBaseline: true,
  sharedMemorySeries: [
    { time: 0.0, mb: 4 },
    { time: 0.8, mb: 10 },
    { time: 1.4, mb: 16 },
    { time: 2.0, mb: 26 },
    { time: 2.6, mb: 35 },
    { time: 3.2, mb: 48 },
    { time: 3.8, mb: 60 },
    { time: 4.4, mb: 68 },
    { time: 5.0, mb: 71 },
    { time: 5.9, mb: 45 },
  ],
  spans: [
    {
      id: 'base_cdp_1',
      lane: 'cdp',
      name: 'Page.navigate',
      start_s: 0.0,
      end_s: 0.04,
      detail: 'url=https://checkout.halcyon.test/cart',
    },
    {
      id: 'base_browser_1',
      lane: 'browser',
      name: 'Navigation start',
      start_s: 0.0,
      end_s: 0.1,
      detail: 'NavigationRequest created',
    },
    {
      id: 'base_net_1',
      lane: 'network',
      name: 'DNS + Connect + TLS',
      start_s: 0.1,
      end_s: 0.35,
      detail: 'Bare metal socket reuse',
    },
    {
      id: 'base_rend_1',
      lane: 'renderer',
      name: 'Parse & Style',
      start_s: 0.7,
      end_s: 1.05,
      detail: 'Fast parse',
    },
    {
      id: 'base_rend_2',
      lane: 'renderer',
      name: 'Script: render cart',
      start_s: 2.4,
      end_s: 3.1,
      detail: '0.7 s execution (0.5 s shorter than container)',
    },
    {
      id: 'base_gpu_1',
      lane: 'gpu',
      name: 'Hardware raster',
      start_s: 3.1,
      end_s: 3.3,
      detail: 'Vulkan accelerated',
    },
    {
      id: 'base_cdp_2',
      lane: 'cdp',
      name: 'Page.loadEventFired',
      start_s: 5.85,
      end_s: 5.9,
      detail: 'Completed successfully',
    },
  ],
};
