// Fixed demo "now" of 2026-10-21 09:41 UTC, ticking forward in real time
const INITIAL_DEMO_TIME = new Date('2026-10-21T09:41:00Z').getTime();
const START_WALL_TIME = Date.now();

export function getDemoNow(): Date {
  const elapsed = Date.now() - START_WALL_TIME;
  return new Date(INITIAL_DEMO_TIME + elapsed);
}

export function formatDemoTime(date: Date = getDemoNow()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
}
