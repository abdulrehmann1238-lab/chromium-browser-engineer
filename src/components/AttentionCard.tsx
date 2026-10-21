import React from 'react';
import { cn } from '../lib/cn';
import { StatusDot } from '../design/StatusDot';
import { ArrowRight } from 'lucide-react';

export interface AttentionCardProps {
  status: string;
  title: string;
  meta: string;
  ctaText?: string;
  onClick: () => void;
  accent?: boolean;
}

export const AttentionCard: React.FC<AttentionCardProps> = ({
  status,
  title,
  meta,
  ctaText = 'Investigate',
  onClick,
  accent = false,
}) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        'group relative bg-[var(--surface)] border rounded-[var(--radius-lg)] p-4 flex flex-col justify-between cursor-pointer transition-all duration-[var(--dur-fast)] hover:border-[var(--primary)] hover:bg-[var(--elevated)]',
        accent ? 'border-[var(--accent)] bg-[var(--accent-tint)]/20' : 'border-[var(--line)]'
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <StatusDot status={status} />
          <span className="text-[11px] font-mono text-[var(--ink-3)]">{meta}</span>
        </div>
        <h4 className="text-sm font-semibold text-[var(--ink-1)] group-hover:text-[var(--primary)] transition-colors">
          {title}
        </h4>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs font-medium text-[var(--primary)] border-t border-[var(--line)]/60 pt-2.5">
        <span>{ctaText}</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1" />
      </div>
    </div>
  );
};
