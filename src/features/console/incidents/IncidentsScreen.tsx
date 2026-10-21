import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../../../mock/api';
import { Incident } from '../../../mock/types';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { StatusDot } from '../../../design/StatusDot';
import { Chip } from '../../../design/Chip';
import { Drawer } from '../../../design/Drawer';
import { Button } from '../../../design/Button';
import { Skeleton } from '../../../design/Skeleton';
import { ErrorPanel } from '../../../components/ErrorPanel';
import { ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';

export const IncidentsScreen: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const navigate = useNavigate();

  const loadIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockApi.listIncidents(statusFilter);
      setIncidents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load incidents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: 'Console', to: '/console' }, { label: 'Incidents' }]} />
          <h1 className="text-2xl font-serif font-semibold text-[var(--ink-1)] tracking-tight mt-1">
            Incidents & Investigations
          </h1>
          <p className="text-xs text-[var(--ink-2)] mt-0.5">
            Fleet reliability, memory regressions, and compatibility drift tracking.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5">
          {['All', 'Investigating', 'Monitoring', 'Resolved'].map((st) => (
            <Chip
              key={st}
              active={statusFilter === st}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </Chip>
          ))}
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-xl)] p-5">
        {error ? (
          <ErrorPanel message={error} onRetry={loadIncidents} />
        ) : loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={44} className="rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th scope="col">Incident ID</th>
                  <th scope="col">Title</th>
                  <th scope="col">Status</th>
                  <th scope="col">Owner</th>
                  <th scope="col">Opened Date</th>
                  <th scope="col">Builds Affected</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] font-mono text-xs">
                {incidents.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => {
                      if (inc.linkToCaseFile) {
                        navigate('/case-files/014');
                      } else {
                        setSelectedIncident(inc);
                      }
                    }}
                    className={`cursor-pointer hover:bg-[var(--hover)] transition-colors ${
                      inc.id === 'INC-014' ? 'bg-[var(--accent-tint)]/20' : ''
                    }`}
                  >
                    <td className="font-semibold text-[var(--primary)]">{inc.id}</td>
                    <td className="font-sans font-medium text-[var(--ink-1)] max-w-sm truncate">
                      {inc.title}
                    </td>
                    <td>
                      <StatusDot status={inc.status} />
                    </td>
                    <td className="font-sans text-[var(--ink-2)]">{inc.owner}</td>
                    <td className="text-[var(--ink-3)]">{inc.opened}</td>
                    <td className="text-[var(--ink-2)]">{inc.buildsAffected}</td>
                    <td>
                      {inc.linkToCaseFile ? (
                        <span className="text-[var(--accent-text)] font-semibold flex items-center gap-1 font-sans">
                          Read Case 014 <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="text-[var(--primary)] flex items-center gap-1 font-sans">
                          Details →
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Incident Details Drawer (480px) */}
      {selectedIncident && (
        <Drawer
          open={Boolean(selectedIncident)}
          onClose={() => setSelectedIncident(null)}
          title={<span className="font-mono text-sm">{selectedIncident.id}</span>}
          subtitle={`Owner: ${selectedIncident.owner} · Opened: ${selectedIncident.opened}`}
        >
          <div className="space-y-5 text-xs font-mono">
            <div>
              <span className="text-[10px] uppercase text-[var(--ink-3)] block mb-1">
                Incident Summary
              </span>
              <p className="text-sm font-sans text-[var(--ink-1)] leading-relaxed">
                {selectedIncident.summary}
              </p>
            </div>

            <div className="p-3 bg-[var(--sunken)] border border-[var(--line)] rounded-[var(--radius-md)] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[var(--ink-3)]">Status:</span>
                <StatusDot status={selectedIncident.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-3)]">Affected Builds:</span>
                <span className="font-semibold text-[var(--ink-1)]">{selectedIncident.buildsAffected}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center"
                onClick={() => navigate('/console/sessions')}
              >
                View affected fleet sessions
              </Button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
