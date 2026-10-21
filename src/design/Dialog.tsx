import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/cn';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  dismissible = true,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissible) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose, dismissible]);

  if (!open) return null;

  const sizeClasses = {
    sm: 'max-w-[440px]',
    md: 'max-w-[520px]',
    lg: 'max-w-[720px]',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Scrim */}
      <div
        className="fixed inset-0 bg-[#1D2327]/40 backdrop-fade transition-opacity duration-200"
        onClick={dismissible ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Card / Bottom Sheet on mobile */}
      <div
        ref={dialogRef}
        className={cn(
          'relative w-full bg-[var(--elevated)] border border-[var(--line)] rounded-[var(--radius-xl)] shadow-[var(--shadow-overlay)] z-10 flex flex-col max-h-[90vh] overflow-hidden animate-overlay',
          sizeClasses[size]
        )}
      >
        <div className="flex items-start justify-between p-5 pb-4 border-b border-[var(--line)]">
          <div>
            <h3 id="dialog-title" className="text-lg font-semibold text-[var(--ink-1)]">
              {title}
            </h3>
            {description && <p className="text-xs text-[var(--ink-3)] mt-1">{description}</p>}
          </div>
          {dismissible && (
            <IconButton label="Close" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </IconButton>
          )}
        </div>

        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
