import React from 'react';

export interface CairnMarkProps {
  className?: string;
  hasFourthStone?: boolean;
}

export const CairnMark: React.FC<CairnMarkProps> = ({ className, hasFourthStone = false }) => {
  return (
    <svg
      viewBox="0 0 64 56"
      className={className || 'w-7 h-7'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Cairn mark: three stacked stones"
      role="img"
    >
      {/* Fourth stone (appears on successful contact submit as closing reward) */}
      {hasFourthStone && (
        <rect
          x="26"
          y="2"
          width="12"
          height="7"
          rx="3.5"
          className="fill-[var(--primary)] animate-overlay"
        />
      )}

      {/* Top stone (width 24, height 10, rx 5) */}
      <rect
        x="20"
        y="12"
        width="24"
        height="10"
        rx="5"
        className="fill-[var(--ink-1)] dark:fill-[var(--well-text)]"
      />

      {/* Middle stone (width 40, height 12, rx 6) */}
      <rect
        x="12"
        y="25"
        width="40"
        height="12"
        rx="6"
        className="fill-[var(--ink-1)] dark:fill-[var(--well-text)]"
      />

      {/* Bottom stone (width 56, height 13, rx 6.5) */}
      <rect
        x="4"
        y="40"
        width="56"
        height="13"
        rx="6.5"
        className="fill-[var(--ink-1)] dark:fill-[var(--well-text)]"
      />
    </svg>
  );
};
