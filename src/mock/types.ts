export type SessionStatus = 'completed' | 'crashed' | 'timed out' | 'running';
export type ExitSignal = 'none' | 'SIGBUS' | 'SIGSEGV' | 'OOM';
export type NodeType = 'bare-metal' | 'container-shm64' | 'container-shm2g' | 'microvm';
export type BuildId = 'M146+p14' | 'M145+p11' | 'M147+p14-rc' | 'M147+p14';
export type Driver = 'Playwright' | 'Puppeteer' | 'Raw CDP';
export type Region = 'us-east' | 'eu-west' | 'ap-south';

export interface Session {
  id: string; // e.g. ses_7Q2K9M
  startTime: string; // ISO string
  durationSec: number;
  status: SessionStatus;
  build: BuildId;
  nodeType: NodeType;
  nodeId: string;
  region: Region;
  driver: Driver;
  targetHost: string;
  exitSignal: ExitSignal;
  peakMemoryMB: number;
  longestTaskSec: number;
}

export type TraceLane = 'cdp' | 'browser' | 'network' | 'renderer' | 'gpu';

export interface TraceSpan {
  id: string;
  lane: TraceLane;
  name: string;
  start_s: number;
  end_s: number;
  detail: string;
  // Span detail drawer data
  summary?: string;
  componentPath?: string;
  pseudocode?: string;
  relatedSpans?: string[];
  whyItMatters?: string;
}

export interface TraceData {
  sessionId: string;
  targetHost: string;
  totalDuration: number;
  ceilingMB: number;
  spans: TraceSpan[];
  sharedMemorySeries: { time: number; mb: number }[];
  isBaseline?: boolean;
}

export interface ProcessNode {
  pid: number;
  type: 'Browser' | 'Network service' | 'GPU' | 'Renderer' | 'Renderer (child frame)' | 'Renderer (spare)' | 'Utility';
  siteOrRole: string;
  residentMB: number;
  threads: number;
  cpuPercent: number;
  status: 'Healthy' | 'Degraded' | 'Exited, SIGSEGV' | 'Exited, SIGBUS' | 'Running';
  sparkline?: number[];
  children?: ProcessNode[];
  livesIn?: string;
  pseudocode?: string;
}

export interface Patch {
  id: string; // p01 - p14
  title: string;
  touches: string; // components/crash/
  risk: 'Low' | 'Medium' | 'High';
  owner: string;
  upstreamStatus: 'Upstreamable' | 'Downstream only';
  rebaseStatus: 'Clean' | 'Conflict' | 'Resolved';
  linesAdded?: number;
  linesRemoved?: number;
  description?: string;
  conflictDetails?: {
    file: string;
    upstreamSnippet: string;
    patchSnippet: string;
    suggestion: string;
    mergedSnippet: string;
  };
}

export interface ConsistencyDifference {
  id: number;
  layer: 'Network' | 'Navigator and client hints' | 'Rendering' | 'Fonts and locale' | 'Time and international' | 'Automation surface';
  property: string;
  referenceValue: string;
  fleetValue: string;
  severity: 'High' | 'Medium' | 'Low' | 'Cosmetic';
  changesPageBehavior: boolean;
  componentPath: string; // e.g. gpu/, components/viz/
  whyDisagree: string;
  symptom: string;
  nextStep: string;
}

export interface Incident {
  id: string;
  title: string;
  status: 'Investigating' | 'Monitoring' | 'Resolved';
  owner: string;
  opened: string;
  buildsAffected: string;
  summary: string;
  linkToCaseFile?: boolean;
}

export interface CrashRatePoint {
  date: string;
  'M146+p14': number;
  'M145+p11': number;
  'M147+p14-rc': number;
}

export interface OverviewMetrics {
  crashFreeRate7d: number;
  crashFreeDelta: number;
  p95ColdStartSec: number;
  p95ColdStartDelta: number;
  activeSessions: number;
  p95RendererMemoryMB: number;
  openDifferences: number;
  behavioralDifferences: number;
  chartData: CrashRatePoint[];
  crashesByNodeType: {
    nodeType: NodeType;
    rate: number;
    totalCrashes: number;
  }[];
}
