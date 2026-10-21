import React, { useEffect, useState, useCallback } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'stones' | 'wordmark' | 'caption' | 'exiting' | 'done'>('stones');
  const [progress, setProgress] = useState(15);

  const handleFinish = useCallback(() => {
    setStage('exiting');
    setTimeout(() => {
      setStage('done');
      sessionStorage.setItem('cairn_loader_seen', 'true');
      onComplete();
    }, 450);
  }, [onComplete]);

  useEffect(() => {
    // Check if returning visitor in same session (unless ?intro=1)
    const hasSeen = sessionStorage.getItem('cairn_loader_seen');
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const forceIntro = searchParams.get('intro') === '1';

    if (hasSeen && !forceIntro) {
      onComplete();
      return;
    }

    // Keydown or click skips instantly
    const handleSkip = () => {
      handleFinish();
    };
    window.addEventListener('keydown', handleSkip);
    window.addEventListener('click', handleSkip);

    // Sequence stages
    const tWordmark = setTimeout(() => {
      setStage('wordmark');
      setProgress(50);
    }, 450);

    const tCaption = setTimeout(() => {
      setStage('caption');
      setProgress(85);
    }, 750);

    const tExit = setTimeout(() => {
      setProgress(100);
      handleFinish();
    }, 1100);

    return () => {
      clearTimeout(tWordmark);
      clearTimeout(tCaption);
      clearTimeout(tExit);
      window.removeEventListener('keydown', handleSkip);
      window.removeEventListener('click', handleSkip);
    };
  }, [handleFinish, onComplete]);

  if (stage === 'done') return null;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      className={`fixed inset-0 z-[var(--z-loader)] bg-[var(--paper)] flex flex-col items-center justify-center select-none transition-transform duration-[450ms] ${
        stage === 'exiting' ? '-translate-y-full' : 'translate-y-0'
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(.7, 0, .2, 1)',
      }}
    >
      <div className="flex flex-col items-center">
        {/* Cairn Animated Stones */}
        <div className="flex items-center gap-4 mb-4">
          <svg viewBox="0 0 64 56" className="w-12 h-12 overflow-visible" fill="none">
            {/* Top stone */}
            <rect
              x="20"
              y="12"
              width="24"
              height="10"
              rx="5"
              className="fill-[var(--ink-1)] transition-all duration-300"
              style={{
                opacity: stage !== 'stones' || progress > 20 ? 1 : 0,
                transform: stage !== 'stones' || progress > 20 ? 'translateY(0)' : 'translateY(-12px)',
                transitionDelay: '240ms',
              }}
            />
            {/* Middle stone */}
            <rect
              x="12"
              y="25"
              width="40"
              height="12"
              rx="6"
              className="fill-[var(--ink-1)] transition-all duration-300"
              style={{
                opacity: stage !== 'stones' || progress > 15 ? 1 : 0,
                transform: stage !== 'stones' || progress > 15 ? 'translateY(0)' : 'translateY(-12px)',
                transitionDelay: '120ms',
              }}
            />
            {/* Bottom stone */}
            <rect
              x="4"
              y="40"
              width="56"
              height="13"
              rx="6.5"
              className="fill-[var(--ink-1)] transition-all duration-300"
              style={{
                opacity: 1,
                transform: 'translateY(0)',
              }}
            />
          </svg>

          {/* Wordmark */}
          <div className="flex flex-col">
            <span
              className="font-serif text-3xl font-medium tracking-tight text-[var(--ink-1)] transition-all duration-300"
              style={{
                opacity: stage !== 'stones' ? 1 : 0,
                transform: stage !== 'stones' ? 'translateY(0)' : 'translateY(4px)',
              }}
            >
              Cairn
            </span>
          </div>
        </div>

        {/* Caption */}
        <span
          className="font-mono text-xs text-[var(--ink-3)] tracking-wide transition-opacity duration-300 mb-6"
          style={{
            opacity: stage === 'caption' || stage === 'exiting' ? 1 : 0,
          }}
        >
          browser infrastructure, observed
        </span>

        {/* 1px Progress line */}
        <div className="w-40 h-[1px] bg-[var(--line-strong)] overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 text-[10px] font-mono text-[var(--ink-3)] opacity-60">
          Press any key or click to skip
        </div>
      </div>
    </div>
  );
};
