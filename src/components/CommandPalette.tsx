import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../mock/api';
import { Search, Globe, Layers, GitCommit, FileText, FolderGit2, X } from 'lucide-react';
import { Drawer } from '../design/Drawer';
import { CodeWell } from './CodeWell';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    sessions: any[];
    processes: any[];
    patches: any[];
    pages: any[];
    components: any[];
  }>({ sessions: [], processes: [], patches: [], pages: [], components: [] });
  const [selectedComponent, setSelectedComponent] = useState<{
    path: string;
    description: string;
    role: string;
    failsAs: string;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }

    const handler = setTimeout(async () => {
      const data = await mockApi.search(query || 's'); // default suggested if empty
      setResults(data);
    }, 120);

    return () => clearTimeout(handler);
  }, [query, open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        className="fixed inset-0 z-[var(--z-palette)] flex items-start justify-center pt-[12vh] px-4"
      >
        {/* Scrim */}
        <div
          className="fixed inset-0 bg-[#1D2327]/40 backdrop-fade"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Palette Box */}
        <div className="relative w-full max-w-[640px] bg-[var(--elevated)] border border-[var(--line)] rounded-[var(--radius-xl)] shadow-[var(--shadow-overlay)] z-10 overflow-hidden animate-overlay flex flex-col max-h-[70vh]">
          {/* Search Header */}
          <div className="flex items-center px-4 py-3 border-b border-[var(--line)] gap-3 bg-[var(--surface)]">
            <Search className="w-5 h-5 text-[var(--ink-3)] shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search sessions, processes, patches, Chromium components... (e.g. services/network)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none text-sm text-[var(--ink-1)] placeholder:text-[var(--ink-3)] focus:outline-none"
            />
            <kbd className="hidden sm:inline-block font-mono text-[11px] px-1.5 py-0.5 rounded border border-[var(--line-strong)] text-[var(--ink-3)] bg-[var(--elevated)]">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="p-3 overflow-y-auto flex-1 divide-y divide-[var(--line)]">
            {/* Pages */}
            {results.pages.length > 0 && (
              <div className="py-2 first:pt-0">
                <span className="text-[11px] font-mono uppercase text-[var(--ink-3)] px-2 block mb-1">
                  Navigation
                </span>
                {results.pages.map((p) => (
                  <button
                    key={p.route}
                    type="button"
                    onClick={() => {
                      navigate(p.route);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] text-xs text-left hover:bg-[var(--hover)] transition-colors"
                  >
                    <span className="flex items-center gap-2 text-[var(--ink-1)] font-medium">
                      <FileText className="w-3.5 h-3.5 text-[var(--ink-3)]" />
                      {p.title}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--ink-3)]">{p.route}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Chromium Components */}
            {results.components.length > 0 && (
              <div className="py-2">
                <span className="text-[11px] font-mono uppercase text-[var(--ink-3)] px-2 block mb-1">
                  Chromium Internals Components
                </span>
                {results.components.map((c) => (
                  <button
                    key={c.path}
                    type="button"
                    onClick={() => setSelectedComponent(c)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] text-xs text-left hover:bg-[var(--hover)] transition-colors group"
                  >
                    <span className="flex items-center gap-2 font-mono text-[var(--primary)] font-medium">
                      <FolderGit2 className="w-3.5 h-3.5 text-[var(--ink-3)]" />
                      {c.path}
                    </span>
                    <span className="text-[11px] text-[var(--ink-3)] group-hover:text-[var(--ink-1)]">
                      {c.description} →
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Sessions */}
            {results.sessions.length > 0 && (
              <div className="py-2">
                <span className="text-[11px] font-mono uppercase text-[var(--ink-3)] px-2 block mb-1">
                  Browser Sessions
                </span>
                {results.sessions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      navigate(`/console/sessions/${s.id}`);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] text-xs text-left hover:bg-[var(--hover)] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-[var(--ink-3)]" />
                      <span className="font-mono font-medium text-[var(--ink-1)]">{s.id}</span>
                      <span className="text-[var(--ink-2)] truncate max-w-[200px]">{s.targetHost}</span>
                    </span>
                    <span className="font-mono text-[11px] uppercase text-[var(--ink-3)]">{s.status}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Patches */}
            {results.patches.length > 0 && (
              <div className="py-2">
                <span className="text-[11px] font-mono uppercase text-[var(--ink-3)] px-2 block mb-1">
                  Downstream Patches
                </span>
                {results.patches.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      navigate('/console/builds');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] text-xs text-left hover:bg-[var(--hover)] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <GitCommit className="w-3.5 h-3.5 text-[var(--ink-3)]" />
                      <span className="font-mono font-medium text-[var(--ink-1)]">{p.id}</span>
                      <span className="text-[var(--ink-2)] truncate max-w-[240px]">{p.title}</span>
                    </span>
                    <span className="font-mono text-[11px] text-[var(--ink-3)]">{p.touches}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Empty state */}
            {query &&
              results.pages.length === 0 &&
              results.components.length === 0 &&
              results.sessions.length === 0 &&
              results.patches.length === 0 && (
                <div className="py-8 text-center text-xs text-[var(--ink-3)]">
                  No matching sessions, processes, patches, or Chromium paths found for "{query}".
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Component Explainer Drawer */}
      {selectedComponent && (
        <Drawer
          open={Boolean(selectedComponent)}
          onClose={() => setSelectedComponent(null)}
          title={<span className="font-mono">{selectedComponent.path}</span>}
          subtitle="Chromium Internals Component Explainer"
        >
          <div className="space-y-4 text-xs">
            <div>
              <span className="font-mono uppercase text-[var(--ink-3)] text-[11px] block mb-1">
                Architecture Role
              </span>
              <p className="text-[var(--ink-1)] leading-relaxed text-sm">
                {selectedComponent.role}
              </p>
            </div>

            <div className="p-3 bg-[var(--sunken)] border border-[var(--line)] rounded-[var(--radius-md)]">
              <span className="font-mono uppercase text-[var(--error-text)] text-[11px] block mb-1 font-semibold">
                Fleet Failure Mode
              </span>
              <p className="text-[var(--ink-2)] leading-relaxed">
                {selectedComponent.failsAs}
              </p>
            </div>

            <div>
              <span className="font-mono uppercase text-[var(--ink-3)] text-[11px] block mb-1">
                Source Directory Example
              </span>
              <CodeWell
                path={selectedComponent.path}
                code={`// Example interface boundary in ${selectedComponent.path}
namespace content {
class WorkerProcessHost : public ChildProcessHost {
 public:
  void InitMojoBindings(mojo::ScopedMessagePipeHandle pipe);
  void MonitorShmPartitionLimits();
};
}`}
              />
            </div>
          </div>
        </Drawer>
      )}
    </>
  );
};
