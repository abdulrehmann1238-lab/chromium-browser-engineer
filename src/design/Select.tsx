import React from 'react';
import { cn } from '../lib/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (string | SelectOption)[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className, id, ...props }, ref) => {
    const selectId = id || React.useId();

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-medium text-[var(--ink-2)] tracking-[0.04em]">
            {label}
          </label>
        )}
        <div className="relative inline-flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'h-10 pl-3 pr-8 bg-[var(--elevated)] border border-[var(--line-strong)] rounded-[var(--radius-md)] text-sm text-[var(--ink-1)] appearance-none cursor-pointer transition-colors duration-[var(--dur-fast)] hover:border-[var(--ink-3)] focus:border-[var(--primary)] focus:outline-none',
              className
            )}
            {...props}
          >
            {options.map((opt) => {
              const val = typeof opt === 'string' ? opt : opt.value;
              const lbl = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={val} value={val}>
                  {lbl}
                </option>
              );
            })}
          </select>
          <ChevronDown className="w-4 h-4 text-[var(--ink-3)] absolute right-2.5 pointer-events-none" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
