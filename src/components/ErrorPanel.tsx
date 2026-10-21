import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../design/Button';

export interface ErrorPanelProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorPanel: React.FC<ErrorPanelProps> = ({
  title = "Couldn't load data",
  message = 'The request failed before any data came back. Try again.',
  onRetry,
  className,
}) => {
  return (
    <div
      role="alert"
      className={`w-full p-6 bg-[var(--surface)] border border-[var(--error-tint)] rounded-[var(--radius-lg)] flex flex-col items-center justify-center text-center ${className || ''}`}
    >
      <div className="w-9 h-9 rounded-full bg-[var(--error-tint)] flex items-center justify-center text-[var(--error)] mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-[var(--ink-1)]">{title}</h4>
      <p className="text-xs text-[var(--ink-2)] max-w-sm mt-1 mb-2">{message}</p>
      <div className="inline-block font-mono text-[10px] text-[var(--ink-3)] bg-[var(--sunken)] px-2 py-0.5 rounded mb-4">
        demo, simulated failure
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
};
