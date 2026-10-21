import { Incident } from '../types';

export const initialIncidents: Incident[] = [
  {
    id: 'INC-015',
    title: 'Compatibility drift on checkout flow after M147 canary',
    status: 'Investigating',
    owner: 'Aiyana Whitfield',
    opened: 'Oct 20, 2026',
    buildsAffected: 'M147+p14-rc',
    summary:
      'Checkout renders differently in the M147 canary on fleet nodes; the Consistency Lab found 9 behavior-changing differences so far.',
  },
  {
    id: 'INC-014',
    title: 'Renderer exits under load on container nodes',
    status: 'Monitoring',
    owner: 'Priya Raman',
    opened: 'Oct 15, 2026',
    buildsAffected: 'M146+p14',
    summary:
      'Renderer processes terminated with SIGBUS on container-shm64 nodes under heavy checkout cart script memory pressure. Traced to 64MB /dev/shm container filesystem quota limit. Fixed by resizing pool to 2GB and adding crash signature enrichment patch p10.',
    linkToCaseFile: true,
  },
  {
    id: 'INC-013',
    title: 'Cold start p95 regression on ap-south',
    status: 'Resolved',
    owner: 'Tomas Becker',
    opened: 'Oct 6, 2026',
    buildsAffected: 'M146+p14',
    summary:
      'p95 cold start rose 0.4 s on ap-south after a base image update; traced to a slow NFS disk mount for profile cache and fixed by moving profile directory to local ephemeral NVMe SSD.',
  },
  {
    id: 'INC-012',
    title: 'Intermittent TLS handshake timeouts via egress proxy',
    status: 'Resolved',
    owner: 'Aiyana Whitfield',
    opened: 'Sep 29, 2026',
    buildsAffected: 'M146+p14',
    summary:
      'Intermittent TLS handshake timeouts traced to an egress proxy connection limit capping parallel TCP sockets; proxy socket pool limit raised to 10,000.',
  },
  {
    id: 'INC-011',
    title: 'GPU process restarts after driver update',
    status: 'Resolved',
    owner: 'Marek Dvorak',
    opened: 'Sep 22, 2026',
    buildsAffected: 'M145+p11',
    summary:
      'GPU process restarted repeatedly after host NVIDIA driver update; driver version pinned and patch p07 graceful software fallback was introduced.',
  },
  {
    id: 'INC-010',
    title: 'Memory growth in sessions longer than 6 hours',
    status: 'Resolved',
    owner: 'Lena Sorensen',
    opened: 'Sep 8, 2026',
    buildsAffected: 'M145+p11',
    summary:
      'Renderer memory grew unbounded in sessions longer than 6 hours; a page-level font cache was never evicted; periodic process recycling was added.',
  },
];
