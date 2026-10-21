import { CrashRatePoint, OverviewMetrics } from '../types';

export const crashRateData: CrashRatePoint[] = [
  { date: '2026-10-08', 'M146+p14': 99.78, 'M145+p11': 99.61, 'M147+p14-rc': 99.44 },
  { date: '2026-10-09', 'M146+p14': 99.77, 'M145+p11': 99.60, 'M147+p14-rc': 99.46 },
  { date: '2026-10-10', 'M146+p14': 99.79, 'M145+p11': 99.62, 'M147+p14-rc': 99.45 },
  { date: '2026-10-11', 'M146+p14': 99.76, 'M145+p11': 99.58, 'M147+p14-rc': 99.47 },
  { date: '2026-10-12', 'M146+p14': 99.77, 'M145+p11': 99.60, 'M147+p14-rc': 99.49 },
  { date: '2026-10-13', 'M146+p14': 99.75, 'M145+p11': 99.59, 'M147+p14-rc': 99.48 },
  { date: '2026-10-14', 'M146+p14': 99.52, 'M145+p11': 99.36, 'M147+p14-rc': 99.31 },
  { date: '2026-10-15', 'M146+p14': 99.48, 'M145+p11': 99.31, 'M147+p14-rc': 99.25 },
  { date: '2026-10-16', 'M146+p14': 99.45, 'M145+p11': 99.29, 'M147+p14-rc': 99.22 },
  { date: '2026-10-17', 'M146+p14': 99.47, 'M145+p11': 99.30, 'M147+p14-rc': 99.24 },
  { date: '2026-10-18', 'M146+p14': 99.50, 'M145+p11': 99.34, 'M147+p14-rc': 99.29 },
  { date: '2026-10-19', 'M146+p14': 99.74, 'M145+p11': 99.55, 'M147+p14-rc': 99.58 },
  { date: '2026-10-20', 'M146+p14': 99.77, 'M145+p11': 99.58, 'M147+p14-rc': 99.66 },
  { date: '2026-10-21', 'M146+p14': 99.78, 'M145+p11': 99.59, 'M147+p14-rc': 99.70 },
];

export const defaultOverviewMetrics: OverviewMetrics = {
  crashFreeRate7d: 99.56,
  crashFreeDelta: -0.21,
  p95ColdStartSec: 1.84,
  p95ColdStartDelta: 0.06,
  activeSessions: 8214,
  p95RendererMemoryMB: 412,
  openDifferences: 37,
  behavioralDifferences: 9,
  chartData: crashRateData,
  crashesByNodeType: [
    { nodeType: 'container-shm64', rate: 3.1, totalCrashes: 184 },
    { nodeType: 'container-shm2g', rate: 0.05, totalCrashes: 3 },
    { nodeType: 'bare-metal', rate: 0.03, totalCrashes: 2 },
    { nodeType: 'microvm', rate: 0.04, totalCrashes: 2 },
  ],
};
