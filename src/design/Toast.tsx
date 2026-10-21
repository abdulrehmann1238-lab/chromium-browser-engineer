import React from 'react';
import { useDemoStore } from '../store/demoStore';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { IconButton } from './IconButton';
import { Button } from './Button';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDemoStore();

  if (toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[var(--z-toast)] flex flex-col gap-2.5 max-w-[360px] w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let iconColor = 'text-[var(--success)]';
        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'text-[var(--error)]';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'text-[var(--warning)]';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'text-[var(--info)]';
        }

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[var(--elevated)] border border-[var(--line)] shadow-[var(--shadow-overlay)] rounded-[var(--radius-lg)] p-3.5 flex items-start gap-3 animate-overlay"
          >
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[var(--ink-1)]">{toast.title}</div>
              {toast.description && (
                <div className="text-xs text-[var(--ink-2)] mt-0.5">{toast.description}</div>
              )}
              {toast.action && (
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-medium text-[var(--primary)] underline"
                    onClick={() => {
                      toast.action?.onClick();
                      removeToast(toast.id);
                    }}
                  >
                    {toast.action.label}
                  </Button>
                </div>
              )}
            </div>
            <IconButton
              label="Dismiss"
              size="sm"
              className="text-[var(--ink-3)] -mr-1.5 -mt-1"
              onClick={() => removeToast(toast.id)}
            >
              <X className="w-3.5 h-3.5" />
            </IconButton>
          </div>
        );
      })}
    </div>
  );
};
