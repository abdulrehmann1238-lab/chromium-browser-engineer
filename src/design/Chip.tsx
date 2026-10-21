import React from 'react';
import { cn } from '../lib/cn';
import { X } from 'lucide-react';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  onRemove?: () => void;
  count?: number;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ children, active = false, onRemove, count, className, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn(
          'inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-[var(--radius-sm)] border transition-all duration-[var(--dur-fast)] cursor-pointer select-none',
          active
            ? 'bg-[var(--primary-subtle)] border-[var(--primary)] text-[var(--primary)]'
            : 'bg-[var(--surface)] border-[var(--line-strong)] text-[var(--ink-2)] hover:bg-[var(--hover)] hover:border-[var(--ink-3)]',
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {typeof count === 'number' && (
          <span className="tabular-nums font-mono text-[10px] px-1 py-0.2 bg-[var(--sunken)] rounded-[2px] text-[var(--ink-2)]">
            {count}
          </span>
        )}
        {onRemove && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Remove filter"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-0.5 hover:bg-[var(--hover)] rounded-full text-[var(--ink-3)] hover:text-[var(--ink-1)]"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>
    );
  }
);

Chip.displayName = 'Chip';
