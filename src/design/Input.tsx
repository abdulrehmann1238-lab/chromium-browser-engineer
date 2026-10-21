import React from 'react';
import { cn } from '../lib/cn';
import { AlertCircle, Check } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  success?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, errorMessage, success, className, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const hasError = Boolean(errorMessage);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[var(--ink-2)] tracking-[0.04em]">
            {label}
            {props.required && <span className="text-[var(--error)] ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
            className={cn(
              'w-full h-10 px-3 py-2 bg-[var(--elevated)] border rounded-[var(--radius-md)] text-sm text-[var(--ink-1)] placeholder:text-[var(--ink-3)] transition-colors duration-[var(--dur-fast)] focus:outline-none',
              hasError
                ? 'border-[var(--error)] focus:ring-2 focus:ring-[var(--error-tint)]'
                : 'border-[var(--line-strong)] hover:border-[var(--ink-3)] focus:border-[var(--primary)]',
              props.disabled && 'bg-[var(--sunken)] opacity-60 cursor-not-allowed',
              className
            )}
            {...props}
          />
          {hasError && (
            <AlertCircle className="w-4 h-4 text-[var(--error)] absolute right-3 pointer-events-none" />
          )}
          {success && !hasError && (
            <Check className="w-4 h-4 text-[var(--success)] absolute right-3 pointer-events-none" />
          )}
        </div>
        {hasError ? (
          <span id={`${inputId}-error`} role="alert" className="text-xs text-[var(--error-text)] flex items-center gap-1">
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={`${inputId}-help`} className="text-xs text-[var(--ink-3)]">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  charCount?: number;
  maxChars?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, errorMessage, charCount, maxChars, className, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const hasError = Boolean(errorMessage);

    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          {label && (
            <label htmlFor={inputId} className="text-xs font-medium text-[var(--ink-2)] tracking-[0.04em]">
              {label}
              {props.required && <span className="text-[var(--error)] ml-1">*</span>}
            </label>
          )}
          {typeof charCount === 'number' && typeof maxChars === 'number' && (
            <span className="text-[11px] font-mono text-[var(--ink-3)]">
              {charCount}/{maxChars}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
          className={cn(
            'w-full min-h-[96px] px-3 py-2 bg-[var(--elevated)] border rounded-[var(--radius-md)] text-sm text-[var(--ink-1)] placeholder:text-[var(--ink-3)] transition-colors duration-[var(--dur-fast)] focus:outline-none resize-y',
            hasError
              ? 'border-[var(--error)] focus:ring-2 focus:ring-[var(--error-tint)]'
              : 'border-[var(--line-strong)] hover:border-[var(--ink-3)] focus:border-[var(--primary)]',
            className
          )}
          {...props}
        />
        {hasError ? (
          <span id={`${inputId}-error`} role="alert" className="text-xs text-[var(--error-text)] flex items-center gap-1">
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={`${inputId}-help`} className="text-xs text-[var(--ink-3)]">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
