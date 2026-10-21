import { ProcessNode } from '../types';

export const initialProcessTree: ProcessNode[] = [
  {
    pid: 4102,
    type: 'Browser',
    siteOrRole: 'Main supervisor process',
    residentMB: 286,
    threads: 38,
    cpuPercent: 4,
    status: 'Healthy',
    livesIn: 'content/browser/',
    pseudocode: `int BrowserMain(MainFunctionParams params) {
  InitializePlatform();
  BrowserProcessSubProcessSupervisor supervisor;
  supervisor.LaunchSandboxedChildren();
  RunMainMessageLoop();
  return 0;
}`,
    children: [
      {
        pid: 4118,
        type: 'Network service',
        siteOrRole: 'Utility, sandboxed socket host',
        residentMB: 74,
        threads: 14,
        cpuPercent: 3,
        status: 'Healthy',
        livesIn: 'services/network/',
        pseudocode: `void NetworkService::CreateURLLoader(
    mojo::PendingReceiver<mojom::URLLoader> receiver,
    ResourceRequest request) {
  auto loader = std::make_unique<URLLoader>(std::move(receiver), request);
  loader->Start();
}`,
      },
      {
        pid: 4124,
        type: 'GPU',
        siteOrRole: 'Software compositing & raster',
        residentMB: 143,
        threads: 11,
        cpuPercent: 9,
        status: 'Degraded',
        livesIn: 'gpu/, components/viz/',
        pseudocode: `void GpuServiceImpl::Initialize() {
  if (!HasHardwareAccelerationNode()) {
    LOG(WARNING) << "Falling back to software compositor";
    SetRasterType(RasterType::kSoftware);
  }
}`,
      },
      {
        pid: 4131,
        type: 'Renderer',
        siteOrRole: 'checkout.halcyon.test',
        residentMB: 398,
        threads: 21,
        cpuPercent: 62,
        status: 'Healthy',
        sparkline: [120, 140, 165, 195, 220, 255, 290, 320, 350, 375, 388, 395, 398],
        livesIn: 'content/renderer/, third_party/blink/renderer/',
        pseudocode: `void RenderProcess::OnMemoryPressure(MemoryPressureLevel level) {
  if (shared_memory_used_ >= kShmQuota64MB) {
    RaiseBusErrorOrGracefulSadTab();
  }
}`,
        children: [
          {
            pid: 4139,
            type: 'Renderer (child frame)',
            siteOrRole: 'pay.halcyon.test (out-of-process iframe)',
            residentMB: 96,
            threads: 9,
            cpuPercent: 1,
            status: 'Healthy',
            livesIn: 'content/renderer/',
          },
        ],
      },
      {
        pid: 4147,
        type: 'Renderer (spare)',
        siteOrRole: 'about:blank (pre-warmed for next navigation)',
        residentMB: 38,
        threads: 6,
        cpuPercent: 0,
        status: 'Healthy',
        livesIn: 'content/browser/renderer_host/spare_render_process_host_manager.cc',
      },
      {
        pid: 4150,
        type: 'Utility',
        siteOrRole: 'Storage service (IndexedDB & CacheStorage)',
        residentMB: 29,
        threads: 8,
        cpuPercent: 0,
        status: 'Healthy',
        livesIn: 'components/services/storage/',
      },
      {
        pid: 4153,
        type: 'Utility',
        siteOrRole: 'Data decoder (isolated image/media parsing)',
        residentMB: 22,
        threads: 5,
        cpuPercent: 0,
        status: 'Healthy',
        livesIn: 'services/data_decoder/',
      },
    ],
  },
];
