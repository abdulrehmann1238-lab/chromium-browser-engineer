import React from 'react';
import { cn } from '../lib/cn';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: 'sm' | 'md';
  active?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, size = 'md', active = false, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={cn(
          'inline-flex items-center justify-center rounded-[var(--radius-md)] text-[var(--ink-2)] transition-colors duration-[var(--dur-fast)] cursor-pointer',
          size === 'sm' ? 'w-8 h-8' : 'w-9 h-9',
          active ? 'bg-[var(--primary-subtle)] text-[var(--primary)]' : 'hover:bg-[var(--hover)] active:bg-[var(--sunken)]',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
