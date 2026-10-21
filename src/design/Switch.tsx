import React from 'react';
import { cn } from '../lib/cn';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  id,
  disabled = false,
  className,
}) => {
  const switchId = id || React.useId();

  return (
    <label
      htmlFor={switchId}
      className={cn(
        'inline-flex items-center gap-2.5 cursor-pointer select-none text-sm text-[var(--ink-1)]',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-[var(--dur-base)] focus-visible:outline-none',
          checked ? 'bg-[var(--primary)]' : 'bg-[var(--line-strong)]'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-[var(--dur-base)]',
            checked ? 'translate-x-4' : 'translate-x-0.5',
            'mt-0.5'
          )}
        />
      </button>
      {label && <span className="font-medium text-xs text-[var(--ink-2)]">{label}</span>}
    </label>
  );
};
