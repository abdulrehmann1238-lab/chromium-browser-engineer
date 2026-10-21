import React, { useState } from 'react';
import { cn } from '../lib/cn';
import { Check, Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  success?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      success = false,
      icon,
      iconPosition = 'right',
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [justSuccess, setJustSuccess] = useState(false);

    // If success prop flips, trigger a 1.2s checkmark state
    React.useEffect(() => {
      if (success) {
        setJustSuccess(true);
        const timer = setTimeout(() => setJustSuccess(false), 1200);
        return () => clearTimeout(timer);
      }
    }, [success]);

    const sizeClasses = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
    };

    const variantClasses = {
      primary:
        'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)] active:translate-y-[1px]',
      secondary:
        'bg-[var(--elevated)] text-[var(--ink-1)] border border-[var(--line-strong)] hover:bg-[var(--hover)] hover:border-[var(--ink-2)] active:bg-[var(--sunken)]',
      ghost:
        'bg-transparent text-[var(--primary)] hover:underline hover:text-[var(--primary-hover)] active:text-[var(--primary-active)] p-0 h-auto',
      destructive:
        'bg-[var(--error)] text-white hover:opacity-90 active:translate-y-[1px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-[var(--radius-md)] transition-colors duration-[var(--dur-fast)] cursor-pointer select-none',
          variant !== 'ghost' && sizeClasses[size],
          variantClasses[variant],
          disabled && 'opacity-45 cursor-not-allowed active:translate-y-0',
          className
        )}
        onClick={onClick}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : justSuccess ? (
          <Check className="w-4 h-4 text-emerald-400" />
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="inline-flex">{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
              <span className="inline-flex transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5">
                {icon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
