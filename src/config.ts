export interface EvidenceItem {
  name: string;
  description: string;
  language: string;
  url: string;
}

export const config = {
  yourName: 'Shahzaib Rajpoot Khan',
  clientName: '', // Leave empty or set to target client
  email: 'shahzaib@example.com',
  availability: 'Immediate (20-40 hrs/wk, 3 to 6+ months)',
  overlap: '4 to 6 hours daily overlap (US/EU friendly)',
  experienceAnswer:
    '8+ years in C++ systems and browser internals. Landed and maintained downstream patches across Chromium content/browser, services/network, and third_party/blink/renderer. Extensive work on headless process lifecycle supervision, DevTools Protocol (CDP) stability, /dev/shm crash debugging in containerized fleets, and managing downstream patch rebases across 4-week upstream milestone churn.',
  evidence: [
    {
      name: 'chromium-shm-crash-guard',
      description: 'Downstream patch enriching SIGBUS crash telemetry with Linux /dev/shm partition capacity and watermark counters.',
      language: 'C++',
      url: 'https://github.com/shahzaibrajpoot/chromium-shm-crash-guard'
    },
    {
      name: 'cdp-fleet-orchestrator',
      description: 'High-density headless Chromium supervisor managing 2,000+ isolated worker processes with automatic memory reclamation.',
      language: 'Go / C++',
      url: 'https://github.com/shahzaibrajpoot/cdp-fleet-orchestrator'
    },
    {
      name: 'blink-font-fingerprint-audit',
      description: 'Systematic audit of platform font resolution differences between bare-metal Linux and containerized environments.',
      language: 'C++ / Python',
      url: 'https://github.com/shahzaibrajpoot/blink-font-fingerprint-audit'
    },
    {
      name: 'mojo-ipc-trace-analyzer',
      description: 'Command-line tool extracting Mojo IPC queue stall durations and cross-process message backlog from Perfetto protobuf traces.',
      language: 'Rust / C++',
      url: 'https://github.com/shahzaibrajpoot/mojo-ipc-trace-analyzer'
    }
  ] as EvidenceItem[],
  caseFile: {
    illustrative: true,
  },
} as const;
