import React from 'react';
import { cn } from '../lib/cn';

export type StatusType = 'Healthy' | 'Degraded' | 'Failed' | 'Running' | 'Unknown' | 'completed' | 'crashed' | 'timed out' | 'running' | 'Investigating' | 'Monitoring' | 'Resolved';

export interface StatusDotProps {
  status: StatusType | string;
  className?: string;
  showText?: boolean;
}

export const StatusDot: React.FC<StatusDotProps> = ({ status, className, showText = true }) => {
  const norm = status.toLowerCase();

  let dotColor = 'bg-[var(--ink-3)]';
  let textColor = 'text-[var(--ink-2)]';
  let label = status;

  if (norm.includes('healthy') || norm.includes('completed') || norm.includes('resolved')) {
    dotColor = 'bg-[var(--success)]';
    textColor = 'text-[var(--success)]';
  } else if (norm.includes('degraded') || norm.includes('monitoring') || norm.includes('timed out')) {
    dotColor = 'bg-[var(--warning)]';
    textColor = 'text-[var(--warning-text)]';
  } else if (norm.includes('failed') || norm.includes('crashed') || norm.includes('sigbus') || norm.includes('sigsegv')) {
    dotColor = 'bg-[var(--error)]';
    textColor = 'text-[var(--error-text)]';
  } else if (norm.includes('running') || norm.includes('investigating')) {
    dotColor = 'bg-[var(--info)]';
    textColor = 'text-[var(--info)]';
  }

  return (
    <span className={cn('inline-flex items-center gap-2 font-medium text-xs', textColor, className)}>
      <span className={cn('w-2 h-2 rounded-full shrink-0', dotColor)} />
      {showText && <span className="capitalize">{label}</span>}
    </span>
  );
};
