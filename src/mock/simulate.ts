import { useDemoStore } from '../store/demoStore';

export class MockError extends Error {
  code: string;
  constructor(message: string, code: string = 'SIMULATED_DEMO_ERROR') {
    super(message);
    this.name = 'MockError';
    this.code = code;
  }
}

export async function simulate<T>(fn: () => T | Promise<T>): Promise<T> {
  const store = useDemoStore.getState();

  // Check error injection
  if (store.consumeError()) {
    // Add artificial delay before throwing
    await new Promise((r) => setTimeout(r, 400));
    throw new MockError('The request failed before any data came back. (demo, simulated failure)');
  }

  // Calculate delay based on latency mode
  let minDelay = 300;
  let maxDelay = 800;
  if (store.latency === 'fast') {
    minDelay = 80;
    maxDelay = 200;
  } else if (store.latency === 'slow') {
    minDelay = 1200;
    maxDelay = 2500;
  }

  const delay = Math.floor(minDelay + Math.random() * (maxDelay - minDelay));
  await new Promise((resolve) => setTimeout(resolve, delay));

  return fn();
}
