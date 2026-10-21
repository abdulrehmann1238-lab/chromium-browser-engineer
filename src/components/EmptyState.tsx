import React from 'react';
import { Button } from '../design/Button';
import { Layers } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="w-full py-12 px-6 flex flex-col items-center justify-center text-center bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)]">
      <div className="w-10 h-10 rounded-full bg-[var(--sunken)] flex items-center justify-center text-[var(--ink-3)] mb-3">
        {icon || <Layers className="w-5 h-5" />}
      </div>
      <h4 className="text-base font-semibold text-[var(--ink-1)]">{title}</h4>
      <p className="text-xs text-[var(--ink-3)] max-w-sm mt-1 mb-5">{description}</p>
      {actionText && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
