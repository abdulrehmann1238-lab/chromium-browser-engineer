// Mulberry32 seeded pseudo-random number generator
// Seed 0xCA17 as specified in Section 11 of the PRD

export function createMulberry32(seed: number = 0xCA17) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const prng = createMulberry32(0xCA17);
