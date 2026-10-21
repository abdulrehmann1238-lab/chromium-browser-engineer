import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/cn';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  width?: 'md' | 'lg'; // md=480px, lg=560px
  actions?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 'md',
  actions,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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
  }, [open, onClose]);

  if (!open) return null;

  const widthClass = width === 'lg' ? 'md:w-[560px]' : 'md:w-[480px]';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[var(--z-drawer)] flex justify-end"
    >
      {/* Scrim */}
      <div
        className="fixed inset-0 bg-[#1D2327]/30 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel: Bottom sheet on mobile (<768px), Right panel on desktop */}
      <div
        ref={drawerRef}
        className={cn(
          'relative w-full bg-[var(--elevated)] border-l border-[var(--line)] shadow-[var(--shadow-overlay)] z-10 flex flex-col h-full',
          'max-md:h-[85vh] max-md:mt-auto max-md:rounded-t-[var(--radius-xl)] max-md:border-t animate-overlay',
          widthClass
        )}
      >
        {/* Mobile drag handle */}
        <div className="md:hidden flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 bg-[var(--line-strong)] rounded-full" />
        </div>

        {/* Drawer header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[var(--line)]">
          <div>
            <h3 className="text-base font-semibold text-[var(--ink-1)] flex items-center gap-2">
              {title}
            </h3>
            {subtitle && <div className="text-xs text-[var(--ink-3)] mt-1">{subtitle}</div>}
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <IconButton label="Close drawer" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </IconButton>
          </div>
        </div>

        {/* Drawer body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
