import React from 'react';
import { cn } from '../lib/cn';
import { ArrowUpRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
    period?: string;
  };
  sparkline?: number[];
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  delta,
  sparkline,
  onClick,
  className,
}) => {
  const isClickable = Boolean(onClick);

  // Sparkline path generator
  let sparklinePath = '';
  if (sparkline && sparkline.length > 1) {
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const width = 120;
    const height = 28;

    const points = sparkline.map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    sparklinePath = `M ${points.join(' L ')}`;
  }

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={cn(
        'group relative bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] p-4 flex flex-col justify-between transition-all duration-[var(--dur-fast)] select-none',
        isClickable && 'cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--elevated)]',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-[var(--ink-3)] tracking-wide uppercase">
          {label}
        </span>
        {isClickable && (
          <ArrowUpRight className="w-4 h-4 text-[var(--ink-3)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--primary)] transition-opacity duration-[var(--dur-fast)]" />
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-2xl font-semibold font-mono tabular-nums text-[var(--ink-1)] tracking-tight">
          {value}
        </div>

        {sparklinePath && (
          <svg className="w-[100px] h-[28px] overflow-visible" aria-hidden="true">
            <path
              d={sparklinePath}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {delta && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-medium tabular-nums px-1.5 py-0.5 rounded-[var(--radius-sm)]',
              delta.isNeutral
                ? 'bg-[var(--sunken)] text-[var(--ink-2)]'
                : delta.isPositive
                ? 'bg-[var(--success-tint)] text-[var(--success)]'
                : 'bg-[var(--error-tint)] text-[var(--error-text)]'
            )}
          >
            {delta.isNeutral ? (
              <Minus className="w-3 h-3" />
            ) : delta.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {delta.value}
          </span>
          {delta.period && <span className="text-[var(--ink-3)] text-[11px]">{delta.period}</span>}
        </div>
      )}
    </div>
  );
};
