import { useEffect } from 'react';

export function usePerf() {
  useEffect(() => {
    // Check user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSaveData = (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData;

    if (prefersReducedMotion || isSaveData) {
      document.documentElement.setAttribute('data-perf', 'lite');
      return;
    }

    // Sample first 20 frames
    let frameCount = 0;
    let lastTime = performance.now();
    let totalDelta = 0;

    function sample(time: DOMHighResTimeStamp) {
      const delta = time - lastTime;
      lastTime = time;
      totalDelta += delta;
      frameCount++;

      if (frameCount < 20) {
        requestAnimationFrame(sample);
      } else {
        const avgFrameTime = totalDelta / 20;
        if (avgFrameTime > 24) {
          // Drops below ~42 FPS -> switch to lite mode
          document.documentElement.setAttribute('data-perf', 'lite');
        }
      }
    }

    const rafId = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(rafId);
  }, []);
}
