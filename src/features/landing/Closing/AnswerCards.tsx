import React, { useState } from 'react';
import { config } from '../../../config';
import { ChevronDown, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnswerCards: React.FC = () => {
  const [openCard, setOpenCard] = useState<number | null>(0); // Card 01 open by default

  const toggleCard = (index: number) => {
    setOpenCard(openCard === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Card 01 */}
      <div className="bg-[var(--well-raised)] border border-[var(--well-line)] rounded-[var(--radius-lg)] overflow-hidden">
        <button
          type="button"
          onClick={() => toggleCard(0)}
          className="w-full px-5 py-4 flex items-center justify-between text-left text-[var(--well-text)] hover:bg-[var(--well-line)]/40 transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold text-[var(--well-ring)]">01</span>
            <span className="text-sm sm:text-base font-semibold">
              My experience with Chromium, Firefox and browser internals
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[var(--well-muted)] transition-transform duration-200 ${
              openCard === 0 ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openCard === 0 && (
          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--well-muted)] leading-relaxed border-t border-[var(--well-line)]/50">
            {config.experienceAnswer}
          </div>
        )}
      </div>

      {/* Card 02 */}
      <div className="bg-[var(--well-raised)] border border-[var(--well-line)] rounded-[var(--radius-lg)] overflow-hidden">
        <button
          type="button"
          onClick={() => toggleCard(1)}
          className="w-full px-5 py-4 flex items-center justify-between text-left text-[var(--well-text)] hover:bg-[var(--well-line)]/40 transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold text-[var(--well-ring)]">02</span>
            <span className="text-sm sm:text-base font-semibold">
              A hard browser problem I investigated
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[var(--well-muted)] transition-transform duration-200 ${
              openCard === 1 ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openCard === 1 && (
          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--well-muted)] leading-relaxed border-t border-[var(--well-line)]/50 space-y-3">
            <p>
              Intermittent renderer crashes (SIGBUS) occurring exclusively on high-density container nodes under heavy offscreen canvas operations. Traced to 64MB Linux <code className="text-white">/dev/shm</code> partition exhaustion where Skia and Blink shared-memory buffers hit filesystem allocation bounds without falling back to graceful backpressure.
            </p>
            <div className="flex items-center gap-3">
              <Link
                to="/case-files/014"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--well-ring)] hover:underline"
              >
                Read Case File 014
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Card 03 */}
      <div className="bg-[var(--well-raised)] border border-[var(--well-line)] rounded-[var(--radius-lg)] overflow-hidden">
        <button
          type="button"
          onClick={() => toggleCard(2)}
          className="w-full px-5 py-4 flex items-center justify-between text-left text-[var(--well-text)] hover:bg-[var(--well-line)]/40 transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold text-[var(--well-ring)]">03</span>
            <span className="text-sm sm:text-base font-semibold">
              Open source and repositories
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[var(--well-muted)] transition-transform duration-200 ${
              openCard === 2 ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openCard === 2 && (
          <div className="px-5 pb-5 pt-1 text-xs text-[var(--well-muted)] leading-relaxed border-t border-[var(--well-line)]/50 space-y-2">
            {config.evidence.map((ev, idx) => (
              <a
                key={idx}
                href={ev.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded hover:bg-[var(--well-line)]/40 transition-colors group"
              >
                <span className="font-mono text-[var(--well-text)] group-hover:text-[var(--well-ring)]">
                  {ev.name}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[var(--well-muted)]">
                  {ev.language}
                  <ExternalLink className="w-3 h-3" />
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
