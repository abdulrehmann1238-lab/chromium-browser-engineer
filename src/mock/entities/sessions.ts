import { Session, BuildId, NodeType, Region, Driver, ExitSignal, SessionStatus } from '../types';
import { createMulberry32 } from '../seed';

const prng = createMulberry32(0xCA17);

const BASE32_CHARS = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
function randomBase32(len: number): string {
  let res = '';
  for (let i = 0; i < len; i++) {
    res += BASE32_CHARS[Math.floor(prng() * BASE32_CHARS.length)];
  }
  return res;
}

const TARGET_HOSTS = [
  'checkout.halcyon.test',
  'catalog.northwind.test',
  'ads.example.test',
  'pay.halcyon.test',
  'account.northwind.test',
  'inventory.halcyon.test',
];

const REGIONS: Region[] = ['us-east', 'eu-west', 'ap-south'];
const DRIVERS: Driver[] = ['Playwright', 'Puppeteer', 'Raw CDP'];

export const HERO_SESSION_ID = 'ses_7Q2K9M';
export const BASELINE_SESSION_ID = 'ses_4F8TW1';

export const authoredSessions: Session[] = [
  {
    id: HERO_SESSION_ID,
    startTime: '2026-10-18T16:52:14Z',
    durationSec: 4.86,
    status: 'crashed',
    build: 'M146+p14',
    nodeType: 'container-shm64',
    nodeId: 'use1-n07',
    region: 'us-east',
    driver: 'Playwright',
    targetHost: 'checkout.halcyon.test/cart',
    exitSignal: 'SIGBUS',
    peakMemoryMB: 398,
    longestTaskSec: 1.2,
  },
  {
    id: BASELINE_SESSION_ID,
    startTime: '2026-10-18T17:10:05Z',
    durationSec: 5.9,
    status: 'completed',
    build: 'M146+p14',
    nodeType: 'bare-metal',
    nodeId: 'use1-n01',
    region: 'us-east',
    driver: 'Playwright',
    targetHost: 'checkout.halcyon.test/cart',
    exitSignal: 'none',
    peakMemoryMB: 412,
    longestTaskSec: 0.82,
  },
  {
    id: 'ses_3M9KP2',
    startTime: '2026-10-21T09:35:12Z',
    durationSec: 8.42,
    status: 'completed',
    build: 'M146+p14',
    nodeType: 'container-shm2g',
    nodeId: 'euw1-n14',
    region: 'eu-west',
    driver: 'Playwright',
    targetHost: 'catalog.northwind.test/search',
    exitSignal: 'none',
    peakMemoryMB: 284,
    longestTaskSec: 0.44,
  },
  {
    id: 'ses_8B2X7V',
    startTime: '2026-10-21T09:38:40Z',
    durationSec: 14.1,
    status: 'running',
    build: 'M147+p14-rc',
    nodeType: 'microvm',
    nodeId: 'aps1-n03',
    region: 'ap-south',
    driver: 'Puppeteer',
    targetHost: 'account.northwind.test/login',
    exitSignal: 'none',
    peakMemoryMB: 195,
    longestTaskSec: 0.28,
  },
  {
    id: 'ses_5D1R8J',
    startTime: '2026-10-17T11:20:00Z',
    durationSec: 4.12,
    status: 'crashed',
    build: 'M146+p14',
    nodeType: 'container-shm64',
    nodeId: 'use1-n09',
    region: 'us-east',
    driver: 'Raw CDP',
    targetHost: 'pay.halcyon.test/checkout',
    exitSignal: 'SIGBUS',
    peakMemoryMB: 382,
    longestTaskSec: 0.95,
  },
  {
    id: 'ses_9Y4L1Q',
    startTime: '2026-10-20T14:15:22Z',
    durationSec: 32.0,
    status: 'timed out',
    build: 'M145+p11',
    nodeType: 'container-shm2g',
    nodeId: 'euw1-n08',
    region: 'eu-west',
    driver: 'Puppeteer',
    targetHost: 'inventory.halcyon.test/stream',
    exitSignal: 'none',
    peakMemoryMB: 512,
    longestTaskSec: 2.1,
  },
];

export function generateSessions(): Session[] {
  const sessions: Session[] = [...authoredSessions];
  const targetCount = 240;

  // Generate remaining sessions up to 240
  for (let i = sessions.length; i < targetCount; i++) {
    const id = `ses_${randomBase32(6)}`;

    // Build distribution: M146+p14 (78%), M145+p11 (9%), M147+p14-rc (13%)
    const bRoll = prng();
    let build: BuildId = 'M146+p14';
    if (bRoll < 0.09) build = 'M145+p11';
    else if (bRoll < 0.22) build = 'M147+p14-rc';

    // Region & Node
    const region = REGIONS[Math.floor(prng() * REGIONS.length)];
    const nodeIndex = Math.floor(prng() * 41) + 1;
    const prefix = region === 'us-east' ? 'use1' : region === 'eu-west' ? 'euw1' : 'aps1';
    const nodeId = `${prefix}-n${String(nodeIndex).padStart(2, '0')}`;

    // Node type distribution
    const nRoll = prng();
    let nodeType: NodeType = 'container-shm2g';
    if (nRoll < 0.35) nodeType = 'container-shm64';
    else if (nRoll < 0.65) nodeType = 'container-shm2g';
    else if (nRoll < 0.85) nodeType = 'bare-metal';
    else nodeType = 'microvm';

    const driver = DRIVERS[Math.floor(prng() * DRIVERS.length)];
    const host = TARGET_HOSTS[Math.floor(prng() * TARGET_HOSTS.length)];

    // Timestamp between Oct 8 and Oct 21
    const dayOffset = Math.floor(prng() * 14); // 0 to 13
    const day = 8 + dayOffset;
    const hour = Math.floor(prng() * 24);
    const minute = Math.floor(prng() * 60);
    const second = Math.floor(prng() * 60);
    const dateStr = `2026-10-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}Z`;

    // Crash rules
    // On container-shm64 between Oct 14 and Oct 19: ~3.1% crash with SIGBUS
    let status: SessionStatus = 'completed';
    let exitSignal: ExitSignal = 'none';

    if (nodeType === 'container-shm64' && day >= 14 && day <= 19) {
      if (prng() < 0.031) {
        status = 'crashed';
        exitSignal = 'SIGBUS';
      }
    } else {
      const cRoll = prng();
      if (cRoll < 0.0004) {
        status = 'crashed';
        exitSignal = prng() > 0.5 ? 'SIGSEGV' : 'OOM';
      } else if (cRoll < 0.008) {
        status = 'timed out';
      }
    }

    const durationSec = status === 'crashed' ? +(3.2 + prng() * 3.5).toFixed(2) : +(4.0 + prng() * 18.0).toFixed(2);
    const peakMemoryMB = status === 'crashed' && exitSignal === 'SIGBUS' ? Math.floor(360 + prng() * 70) : Math.floor(180 + prng() * 260);
    const longestTaskSec = +(0.15 + prng() * 1.2).toFixed(2);

    sessions.push({
      id,
      startTime: dateStr,
      durationSec,
      status,
      build,
      nodeType,
      nodeId,
      region,
      driver,
      targetHost: host,
      exitSignal,
      peakMemoryMB,
      longestTaskSec,
    });
  }

  // Sort descending by start time so newest are first
  return sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
}

export const allSeededSessions: Session[] = generateSessions();
