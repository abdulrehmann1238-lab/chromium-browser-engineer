import React, { useState } from 'react';
import { cn } from '../lib/cn';
import { Copy, Check } from 'lucide-react';
import { IconButton } from '../design/IconButton';

export interface CodeWellProps {
  code: string;
  language?: string;
  path?: string;
  className?: string;
  showPseudocodeNotice?: boolean;
}

export const CodeWell: React.FC<CodeWellProps> = ({
  code,
  language = 'cpp',
  path,
  className,
  showPseudocodeNotice = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className={cn('dark-well flex flex-col overflow-hidden text-xs', className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[var(--well-line)] bg-[var(--well-raised)]">
        <div className="flex items-center gap-2 min-w-0">
          {path ? (
            <span className="font-mono text-[var(--well-muted)] truncate">{path}</span>
          ) : (
            <span className="font-mono text-[var(--well-muted)] uppercase text-[11px]">{language}</span>
          )}
          {showPseudocodeNotice && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--well-line)] text-[var(--well-muted)] border border-[var(--well-line)]">
              Illustrative pseudocode, not Chromium source
            </span>
          )}
        </div>
        <IconButton
          label={copied ? 'Copied' : 'Copy code'}
          size="sm"
          className="text-[var(--well-muted)] hover:text-[var(--well-text)] hover:bg-[var(--well-line)]"
          onClick={handleCopy}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </IconButton>
      </div>

      {/* Code body */}
      <div className="p-3.5 overflow-x-auto font-mono text-[13px] leading-relaxed text-[var(--well-text)] selection:bg-[var(--primary)] selection:text-white">
        <pre className="m-0">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
