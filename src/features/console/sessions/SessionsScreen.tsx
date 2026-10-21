import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockApi } from '../../../mock/api';
import { Session } from '../../../mock/types';
import { useDemoStore } from '../../../store/demoStore';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { ErrorPanel } from '../../../components/ErrorPanel';
import { EmptyState } from '../../../components/EmptyState';
import { Skeleton } from '../../../design/Skeleton';
import { Button } from '../../../design/Button';
import { Chip } from '../../../design/Chip';
import { StatusDot } from '../../../design/StatusDot';
import { Drawer } from '../../../design/Drawer';
import { Dialog } from '../../../design/Dialog';
import { Input } from '../../../design/Input';
import { formatDuration, formatMemory, formatRelativeTime } from '../../../lib/format';
import {
  Search,
  Copy,
  Check,
  ArrowUpDown,
  Filter,
  Bookmark,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Layers,
  Activity,
  Trash2,
} from 'lucide-react';

export const SessionsScreen: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters from query or state
  const search = searchParams.get('search') || '';
  const selectedStatus = searchParams.getAll('status');
  const selectedNodeType = searchParams.getAll('nodeType');
  const selectedBuild = searchParams.getAll('build');
  const selectedDriver = searchParams.getAll('driver');
  const sortBy = (searchParams.get('sortBy') as 'duration' | 'memory' | 'started') || 'started';
  const sortDir = (searchParams.get('sortDir') as 'asc' | 'desc') || 'desc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Selected session for Drawer
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Save View Dialog
  const [saveViewOpen, setSaveViewOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  const { savedViews, addSavedView, deleteSavedView, addToast } = useDemoStore();
  const navigate = useNavigate();

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await mockApi.listSessions({
        search,
        status: selectedStatus,
        nodeType: selectedNodeType,
        build: selectedBuild,
        driver: selectedDriver,
        sortBy,
        sortDir,
        page,
        pageSize: 25,
      });
      setSessions(res.sessions);
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [search, searchParams.toString(), sortBy, sortDir, page]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const toggleArrayParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    const existing = next.getAll(key);
    next.delete(key);
    if (existing.includes(value)) {
      existing.filter((v) => v !== value).forEach((v) => next.append(key, v));
    } else {
      [...existing, value].forEach((v) => next.append(key, v));
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  const toggleSort = (col: 'duration' | 'memory' | 'started') => {
    const next = new URLSearchParams(searchParams);
    if (sortBy === col) {
      next.set('sortDir', sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      next.set('sortBy', col);
      next.set('sortDir', 'desc');
    }
    setSearchParams(next);
  };

  const handleSaveViewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newViewName.trim()) return;

    addSavedView({
      name: newViewName.trim(),
      filters: {
        status: selectedStatus,
        nodeType: selectedNodeType,
        build: selectedBuild,
        driver: selectedDriver,
        search,
        sortBy,
        sortDir,
      },
    });

    addToast({
      title: 'View saved',
      description: `"${newViewName.trim()}" added to saved filters.`,
      type: 'success',
    });

    setNewViewName('');
    setSaveViewOpen(false);
  };

  const applySavedView = (view: (typeof savedViews)[0]) => {
    const next = new URLSearchParams();
    if (view.filters.search) next.set('search', view.filters.search);
    view.filters.status?.forEach((s) => next.append('status', s));
    view.filters.nodeType?.forEach((n) => next.append('nodeType', n));
    view.filters.build?.forEach((b) => next.append('build', b));
    view.filters.driver?.forEach((d) => next.append('driver', d));
    if (view.filters.sortBy) next.set('sortBy', view.filters.sortBy);
    if (view.filters.sortDir) next.set('sortDir', view.filters.sortDir);
    setSearchParams(next);
  };

  const totalPages = Math.ceil(total / 25) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: 'Console', to: '/console' }, { label: 'Sessions' }]} />
          <h1 className="text-2xl font-serif font-semibold text-[var(--ink-1)] tracking-tight mt-1">
            Browser Sessions
          </h1>
          <p className="text-xs text-[var(--ink-2)] mt-0.5">
            Every browser session across the 41-node fleet. Filter, then open a multi-process trace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Bookmark className="w-3.5 h-3.5" />}
            onClick={() => setSaveViewOpen(true)}
          >
            Save view
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] space-y-3">
        {/* Top filter row: Search & Quick chips */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search field */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[var(--ink-3)] absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ID, host or node..."
              value={search}
              onChange={(e) => updateParam('search', e.target.value || null)}
              className="w-full h-10 pl-9 pr-3 bg-[var(--elevated)] border border-[var(--line-strong)] rounded-[var(--radius-md)] text-xs text-[var(--ink-1)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          {/* Quick status chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono uppercase text-[var(--ink-3)] mr-1">Status:</span>
            {['crashed', 'completed', 'timed out', 'running'].map((st) => (
              <Chip
                key={st}
                active={selectedStatus.includes(st)}
                onClick={() => toggleArrayParam('status', st)}
              >
                {st}
              </Chip>
            ))}
          </div>

          {/* Quick Node Type chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono uppercase text-[var(--ink-3)] mr-1">Node:</span>
            {['container-shm64', 'container-shm2g', 'bare-metal', 'microvm'].map((nt) => (
              <Chip
                key={nt}
                active={selectedNodeType.includes(nt)}
                onClick={() => toggleArrayParam('nodeType', nt)}
              >
                {nt}
              </Chip>
            ))}
          </div>

          {/* Driver */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono uppercase text-[var(--ink-3)] mr-1">Driver:</span>
            {['Playwright', 'Puppeteer', 'Raw CDP'].map((dr) => (
              <Chip
                key={dr}
                active={selectedDriver.includes(dr)}
                onClick={() => toggleArrayParam('driver', dr)}
              >
                {dr}
              </Chip>
            ))}
          </div>

          {/* Clear filters */}
          {(selectedStatus.length > 0 ||
            selectedNodeType.length > 0 ||
            selectedBuild.length > 0 ||
            selectedDriver.length > 0 ||
            search) && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-mono text-[var(--primary)] hover:underline ml-auto cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Saved Views row */}
        {savedViews.length > 0 && (
          <div className="pt-2 border-t border-[var(--line)]/60 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-[var(--ink-3)] uppercase">Saved Views:</span>
            {savedViews.map((sv) => (
              <div key={sv.id} className="inline-flex items-center">
                <Chip active={false} onClick={() => applySavedView(sv)}>
                  {sv.name}
                </Chip>
                {sv.id !== 'view_crashed_container' && (
                  <button
                    type="button"
                    onClick={() => deleteSavedView(sv.id)}
                    className="p-1 text-[var(--ink-3)] hover:text-rose-500"
                    title="Delete view"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Result count line */}
      <div className="flex items-center justify-between text-xs font-mono text-[var(--ink-3)]">
        <span>
          Showing {sessions.length} of {total} sessions
        </span>
        <span>Click any row to open summary & multi-process trace</span>
      </div>

      {/* Data Table */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] overflow-hidden">
        {error ? (
          <div className="p-8">
            <ErrorPanel message={error} onRetry={fetchSessions} />
          </div>
        ) : loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} height={44} className="rounded-[var(--radius-sm)]" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <EmptyState
            title="No sessions match these filters"
            description="Widen your search query or clear one of the node/status filters."
            actionText="Clear all filters"
            onAction={clearAllFilters}
          />
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th scope="col">Session</th>
                  <th scope="col">Status</th>
                  <th scope="col">Target Host</th>
                  <th scope="col">Build</th>
                  <th scope="col">Node / Pool</th>
                  <th scope="col">Driver</th>
                  <th scope="col">
                    <button
                      type="button"
                      onClick={() => toggleSort('duration')}
                      className="flex items-center gap-1 hover:text-[var(--ink-1)] cursor-pointer"
                    >
                      Duration
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th scope="col">
                    <button
                      type="button"
                      onClick={() => toggleSort('memory')}
                      className="flex items-center gap-1 hover:text-[var(--ink-1)] cursor-pointer"
                    >
                      Peak RSS
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th scope="col">
                    <button
                      type="button"
                      onClick={() => toggleSort('started')}
                      className="flex items-center gap-1 hover:text-[var(--ink-1)] cursor-pointer"
                    >
                      Started
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((sess) => {
                  const isHero = sess.id === 'ses_7Q2K9M';
                  return (
                    <tr
                      key={sess.id}
                      onClick={() => setSelectedSession(sess)}
                      className={`cursor-pointer transition-colors duration-[var(--dur-fast)] ${
                        isHero ? 'bg-[var(--accent-tint)]/25 hover:bg-[var(--accent-tint)]/40' : ''
                      }`}
                    >
                      {/* Session ID */}
                      <td className="font-mono text-xs font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span className={isHero ? 'text-[var(--accent-text)] font-bold' : 'text-[var(--primary)]'}>
                            {sess.id}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyId(sess.id, e)}
                            className="p-1 text-[var(--ink-3)] hover:text-[var(--ink-1)] rounded cursor-pointer"
                            title="Copy session ID"
                          >
                            {copiedId === sess.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <StatusDot
                          status={sess.status === 'crashed' ? `${sess.status} (${sess.exitSignal})` : sess.status}
                        />
                      </td>

                      {/* Target Host */}
                      <td className="font-mono text-xs max-w-[220px] truncate text-[var(--ink-1)]">
                        {sess.targetHost}
                      </td>

                      {/* Build */}
                      <td className="font-mono text-xs text-[var(--ink-2)]">
                        {sess.build}
                      </td>

                      {/* Node */}
                      <td className="font-mono text-xs text-[var(--ink-2)]">
                        <div>{sess.nodeId}</div>
                        <div className="text-[10px] text-[var(--ink-3)]">{sess.nodeType}</div>
                      </td>

                      {/* Driver */}
                      <td className="text-xs text-[var(--ink-2)] font-medium">
                        {sess.driver}
                      </td>

                      {/* Duration */}
                      <td className="font-mono text-xs tabular-nums">
                        {formatDuration(sess.durationSec)}
                      </td>

                      {/* Peak Memory */}
                      <td className="font-mono text-xs tabular-nums">
                        {formatMemory(sess.peakMemoryMB)}
                      </td>

                      {/* Started */}
                      <td className="font-mono text-xs text-[var(--ink-3)] tabular-nums">
                        {formatRelativeTime(sess.startTime)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-3 border-t border-[var(--line)] bg-[var(--surface)] flex items-center justify-between text-xs font-mono text-[var(--ink-3)]">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => updateParam('page', String(page - 1))}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => updateParam('page', String(page + 1))}
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Session Drawer (480px) */}
      {selectedSession && (
        <Drawer
          open={Boolean(selectedSession)}
          onClose={() => setSelectedSession(null)}
          title={
            <div className="flex items-center gap-2">
              <span className="font-mono text-base">{selectedSession.id}</span>
              <StatusDot status={selectedSession.status} />
            </div>
          }
          subtitle={`Session duration: ${formatDuration(selectedSession.durationSec)}`}
        >
          <div className="space-y-6 text-xs">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[var(--sunken)] border border-[var(--line)] rounded-[var(--radius-lg)] font-mono">
              <div>
                <span className="text-[10px] text-[var(--ink-3)] uppercase block">Target Host</span>
                <span className="text-[var(--ink-1)] font-semibold truncate block">
                  {selectedSession.targetHost}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--ink-3)] uppercase block">Build</span>
                <span className="text-[var(--ink-1)] font-semibold">{selectedSession.build}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--ink-3)] uppercase block">Node ID</span>
                <span className="text-[var(--ink-1)]">{selectedSession.nodeId} ({selectedSession.nodeType})</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--ink-3)] uppercase block">Driver</span>
                <span className="text-[var(--ink-1)]">{selectedSession.driver}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--ink-3)] uppercase block">Peak RSS</span>
                <span className="text-[var(--ink-1)]">{formatMemory(selectedSession.peakMemoryMB)}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--ink-3)] uppercase block">Exit Signal</span>
                <span className={selectedSession.exitSignal === 'SIGBUS' ? 'text-rose-600 font-bold' : 'text-[var(--ink-1)]'}>
                  {selectedSession.exitSignal}
                </span>
              </div>
            </div>

            {/* Key Moments */}
            <div>
              <span className="font-mono uppercase text-[11px] text-[var(--ink-3)] block mb-2 font-semibold">
                Key Session Moments
              </span>
              <div className="space-y-2 font-mono">
                <div className="p-2.5 rounded bg-[var(--surface)] border border-[var(--line)] flex justify-between">
                  <span>NavigationRequest committed</span>
                  <span className="text-[var(--ink-3)]">t = 0.71s</span>
                </div>
                <div className="p-2.5 rounded bg-[var(--surface)] border border-[var(--line)] flex justify-between">
                  <span>Main thread long cart render task</span>
                  <span className="text-[var(--ink-3)]">t = 2.50s (1.2s task)</span>
                </div>
                {selectedSession.status === 'crashed' ? (
                  <div className="p-2.5 rounded bg-[var(--error-tint)] border border-[var(--error)] flex justify-between text-[var(--error-text)] font-semibold">
                    <span>Child process exited ({selectedSession.exitSignal})</span>
                    <span>t = {selectedSession.durationSec}s</span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded bg-[var(--success-tint)] border border-emerald-600 flex justify-between text-emerald-800 font-semibold">
                    <span>Page load event fired cleanly</span>
                    <span>t = {selectedSession.durationSec}s</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 pt-4 border-t border-[var(--line)]">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                icon={<Activity className="w-4 h-4" />}
                onClick={() => navigate(`/console/sessions/${selectedSession.id}`)}
              >
                Open multi-process trace
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="w-full justify-center"
                icon={<Layers className="w-4 h-4" />}
                onClick={() => navigate('/console/processes')}
              >
                Inspect process snapshot
              </Button>
            </div>
          </div>
        </Drawer>
      )}

      {/* Save View Modal (Workflow 6) */}
      <Dialog
        open={saveViewOpen}
        onClose={() => setSaveViewOpen(false)}
        title="Save Current Filter View"
        description="Save your active search query, chips, and sort order for one-click access."
      >
        <form onSubmit={handleSaveViewSubmit} className="space-y-4">
          <Input
            label="View Name"
            required
            autoFocus
            maxLength={40}
            value={newViewName}
            onChange={(e) => setNewViewName(e.target.value)}
            placeholder="e.g. Container crashes on Playwright"
            helperText={`${newViewName.length}/40 characters`}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setSaveViewOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={!newViewName.trim()}>
              Save view
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
