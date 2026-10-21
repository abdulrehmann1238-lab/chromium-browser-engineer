import { cn } from '../lib/cn';

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string = string> {
  options: (SegmentedOption<T> | T)[];
  value: T;
  onChange: (val: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function Segmented<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cn(
        'inline-flex p-1 bg-[var(--sunken)] rounded-[var(--radius-md)] border border-[var(--line)]',
        className
      )}
    >
      {options.map((opt) => {
        const optVal = (typeof opt === 'string' ? opt : opt.value) as T;
        const optLabel = typeof opt === 'string' ? opt : opt.label;
        const isSelected = optVal === value;

        return (
          <button
            key={optVal}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(optVal)}
            className={cn(
              'px-3 rounded-[var(--radius-sm)] font-medium transition-all duration-[var(--dur-fast)] text-xs select-none',
              size === 'sm' ? 'py-1' : 'py-1.5',
              isSelected
                ? 'bg-[var(--elevated)] text-[var(--ink-1)] shadow-sm'
                : 'text-[var(--ink-3)] hover:text-[var(--ink-1)]'
            )}
          >
            {optLabel}
          </button>
        );
      })}
    </div>
  );
}
