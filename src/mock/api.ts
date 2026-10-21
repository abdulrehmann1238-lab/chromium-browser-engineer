import { simulate, MockError } from './simulate';
import { useDemoStore } from '../store/demoStore';
import { defaultOverviewMetrics, crashRateData } from './entities/overview';
import { allSeededSessions, authoredSessions } from './entities/sessions';
import { heroTrace, baselineTrace } from './entities/trace';
import { consistencyDifferences } from './entities/consistency';
import { initialIncidents } from './entities/incidents';
import { initialPatches } from './entities/patches';
import {
  Session,
  TraceData,
  ProcessNode,
  Patch,
  ConsistencyDifference,
  Incident,
  OverviewMetrics,
} from './types';

export interface SessionFilters {
  search?: string;
  status?: string[];
  build?: string[];
  nodeType?: string[];
  driver?: string[];
  region?: string[];
  sortBy?: 'duration' | 'memory' | 'started';
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const mockApi = {
  async getOverview(buildFilter?: string): Promise<OverviewMetrics> {
    return simulate(() => {
      const isNull = useDemoStore.getState().dataMode === 'empty';
      if (isNull) {
        return {
          ...defaultOverviewMetrics,
          activeSessions: 0,
          chartData: [],
          crashesByNodeType: [],
        };
      }

      if (buildFilter && buildFilter !== 'All builds') {
        return {
          ...defaultOverviewMetrics,
          chartData: crashRateData.map((d) => ({
            ...d,
            // Keep selected build active
          })),
        };
      }
      return defaultOverviewMetrics;
    });
  },

  async listSessions(filters: SessionFilters = {}): Promise<{ sessions: Session[]; total: number }> {
    return simulate(() => {
      if (useDemoStore.getState().dataMode === 'empty') {
        return { sessions: [], total: 0 };
      }

      let result = [...allSeededSessions];

      // Filter by search
      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        result = result.filter(
          (s) =>
            s.id.toLowerCase().includes(q) ||
            s.targetHost.toLowerCase().includes(q) ||
            s.nodeId.toLowerCase().includes(q) ||
            s.driver.toLowerCase().includes(q)
        );
      }

      // Filter by status
      if (filters.status && filters.status.length > 0) {
        result = result.filter((s) => filters.status!.includes(s.status));
      }

      // Filter by build
      if (filters.build && filters.build.length > 0) {
        result = result.filter((s) => filters.build!.includes(s.build));
      }

      // Filter by nodeType
      if (filters.nodeType && filters.nodeType.length > 0) {
        result = result.filter((s) => filters.nodeType!.includes(s.nodeType));
      }

      // Filter by driver
      if (filters.driver && filters.driver.length > 0) {
        result = result.filter((s) => filters.driver!.includes(s.driver));
      }

      // Filter by region
      if (filters.region && filters.region.length > 0) {
        result = result.filter((s) => filters.region!.includes(s.region));
      }

      // Sorting
      if (filters.sortBy) {
        const dir = filters.sortDir === 'asc' ? 1 : -1;
        if (filters.sortBy === 'duration') {
          result.sort((a, b) => (a.durationSec - b.durationSec) * dir);
        } else if (filters.sortBy === 'memory') {
          result.sort((a, b) => (a.peakMemoryMB - b.peakMemoryMB) * dir);
        } else if (filters.sortBy === 'started') {
          result.sort(
            (a, b) =>
              (new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) * dir
          );
        }
      }

      const total = result.length;
      const page = filters.page || 1;
      const pageSize = filters.pageSize || 25;
      const paginated = result.slice((page - 1) * pageSize, page * pageSize);

      return {
        sessions: paginated,
        total,
      };
    });
  },

  async getSession(id: string): Promise<Session> {
    return simulate(() => {
      const session = allSeededSessions.find((s) => s.id === id);
      if (!session) {
        throw new MockError(`Session ${id} not found`, 'NOT_FOUND');
      }
      return session;
    });
  },

  async getTrace(id: string): Promise<TraceData> {
    return simulate(() => {
      if (id === 'ses_7Q2K9M') {
        return heroTrace;
      }
      if (id === 'ses_4F8TW1') {
        return baselineTrace;
      }
      // For any other session, generate a synthetic trace based on baseline
      const session = allSeededSessions.find((s) => s.id === id);
      return {
        ...baselineTrace,
        sessionId: id,
        targetHost: session ? `https://${session.targetHost}` : 'https://catalog.northwind.test',
        totalDuration: session ? session.durationSec : 5.4,
      };
    });
  },

  async getProcessTree(): Promise<ProcessNode[]> {
    return simulate(() => {
      if (useDemoStore.getState().dataMode === 'empty') {
        return [];
      }
      return useDemoStore.getState().processTree;
    });
  },

  async listPatches(): Promise<Patch[]> {
    return simulate(() => {
      if (useDemoStore.getState().dataMode === 'empty') {
        return [];
      }
      return useDemoStore.getState().patches;
    });
  },

  async runComparison(
    _refEnv: string,
    _candEnv: string
  ): Promise<{ score: number; differences: ConsistencyDifference[] }> {
    return simulate(() => {
      return {
        score: 84,
        differences: consistencyDifferences,
      };
    });
  },

  async listIncidents(statusFilter?: string): Promise<Incident[]> {
    return simulate(() => {
      if (useDemoStore.getState().dataMode === 'empty') {
        return [];
      }
      if (statusFilter && statusFilter !== 'All') {
        return initialIncidents.filter((i) => i.status === statusFilter);
      }
      return initialIncidents;
    });
  },

  async search(query: string): Promise<{
    sessions: Session[];
    processes: { pid: number; name: string; role: string }[];
    patches: Patch[];
    pages: { title: string; route: string }[];
    components: { path: string; description: string; role: string; failsAs: string }[];
  }> {
    const q = query.toLowerCase().trim();
    if (!q) {
      return { sessions: [], processes: [], patches: [], pages: [], components: [] };
    }

    const sessions = allSeededSessions
      .filter((s) => s.id.toLowerCase().includes(q) || s.targetHost.toLowerCase().includes(q))
      .slice(0, 5);

    const processes = [
      { pid: 4102, name: 'Browser', role: 'Main supervisor process' },
      { pid: 4118, name: 'Network service', role: 'Utility, sandboxed socket host' },
      { pid: 4124, name: 'GPU', role: 'Software compositing' },
      { pid: 4131, name: 'Renderer', role: 'checkout.halcyon.test' },
      { pid: 4139, name: 'Renderer (child)', role: 'pay.halcyon.test' },
    ].filter((p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || String(p.pid).includes(q));

    const patches = initialPatches
      .filter((p) => p.title.toLowerCase().includes(q) || p.touches.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
      .slice(0, 4);

    const pages = [
      { title: 'Overview', route: '/console' },
      { title: 'Sessions', route: '/console/sessions' },
      { title: 'Session Trace (ses_7Q2K9M)', route: '/console/sessions/ses_7Q2K9M' },
      { title: 'Process Inspector', route: '/console/processes' },
      { title: 'Consistency Lab', route: '/console/consistency' },
      { title: 'Builds & Patches', route: '/console/builds' },
      { title: 'Incidents', route: '/console/incidents' },
      { title: 'Case File 014', route: '/case-files/014' },
      { title: 'Landing Page', route: '/' },
    ].filter((p) => p.title.toLowerCase().includes(q));

    const components = [
      {
        path: 'services/network/',
        description: 'Network Service process daemon',
        role: 'Handles sockets, TLS, HTTP/2 and caching for all renderers',
        failsAs: 'Stalls appear as slow loads in healthy renderers',
      },
      {
        path: 'content/browser/',
        description: 'Browser Process supervisor',
        role: 'Owns tabs, navigation and permissions; spawns and supervises every other process',
        failsAs: 'A hang here freezes every tab',
      },
      {
        path: 'gpu/',
        description: 'GPU process & Viz compositor',
        role: 'Rasterizes and composites frames and talks to the driver',
        failsAs: 'Falls back to software rendering; frames slow without an error',
      },
      {
        path: 'content/renderer/',
        description: 'Sandboxed site renderer',
        role: 'Runs one site DOM, style, layout and JavaScript in a sandbox',
        failsAs: 'A crash takes down only that site tabs',
      },
      {
        path: 'third_party/blink/renderer/',
        description: 'Blink layout engine & V8 bindings',
        role: 'Executes HTML parsing, CSS cascading, and JavaScript engine bindings',
        failsAs: 'Long tasks cause layout jank and high resident heap',
      },
    ].filter((c) => c.path.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));

    return { sessions, processes, patches, pages, components };
  },

  async submitContact(data: {
    name: string;
    email: string;
    organization?: string;
    message: string;
    overlapHours?: string;
  }): Promise<{ success: boolean }> {
    return simulate(() => {
      if (!data.name || data.name.trim().length < 2) {
        throw new MockError("Tell me who I'm writing back to.", 'VALIDATION_NAME');
      }
      if (!data.email || !data.email.includes('@')) {
        throw new MockError("That email doesn't look right.", 'VALIDATION_EMAIL');
      }
      if (!data.message || data.message.trim().length < 20) {
        throw new MockError('A sentence or two is enough (20 characters minimum).', 'VALIDATION_MESSAGE');
      }
      return { success: true };
    });
  },
};
