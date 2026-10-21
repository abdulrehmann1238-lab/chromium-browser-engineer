import { create } from 'zustand';
import { initialProcessTree } from '../mock/entities/processes';
import { initialPatches } from '../mock/entities/patches';
import { ProcessNode, Patch } from '../mock/types';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  type?: 'success' | 'info' | 'error' | 'warning';
  duration?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  timeAgo: string;
  read: boolean;
  targetRoute?: string;
}

export interface SavedView {
  id: string;
  name: string;
  filters: {
    status?: string[];
    nodeType?: string[];
    build?: string[];
    driver?: string[];
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  };
}

interface DemoState {
  // Demo Controls
  latency: 'fast' | 'realistic' | 'slow';
  errorNext: boolean;
  dataMode: 'normal' | 'empty';
  setLatency: (latency: 'fast' | 'realistic' | 'slow') => void;
  setErrorNext: (errorNext: boolean) => void;
  setDataMode: (dataMode: 'normal' | 'empty') => void;
  consumeError: () => boolean;

  // Process Tree State
  processTree: ProcessNode[];
  killProcess: (pid: number) => Promise<void>;
  resetProcessTree: () => void;

  // Patches & Builds State
  patches: Patch[];
  hasRebased: boolean;
  completeRebase: () => void;

  // Notifications
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'read'>) => void;

  // Toasts
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;

  // Saved Views
  savedViews: SavedView[];
  addSavedView: (view: Omit<SavedView, 'id'>) => void;
  deleteSavedView: (id: string) => void;
  renameSavedView: (id: string, newName: string) => void;

  // Reset Everything
  resetDemoState: () => void;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Build M147+p14-rc finished',
    timeAgo: '18 min ago',
    read: false,
    targetRoute: '/console/builds',
  },
  {
    id: 'notif_2',
    title: 'INC-015 was assigned to you',
    timeAgo: '1 h ago',
    read: false,
    targetRoute: '/console/incidents',
  },
  {
    id: 'notif_3',
    title: 'Crash-free sessions on M146+p14 back above 99.7%',
    timeAgo: 'yesterday',
    read: true,
    targetRoute: '/console',
  },
  {
    id: 'notif_4',
    title: 'Rebase onto M147 is blocked by 3 conflicts',
    timeAgo: 'yesterday',
    read: true,
    targetRoute: '/console/builds',
  },
];

const DEFAULT_SAVED_VIEWS: SavedView[] = [
  {
    id: 'view_crashed_container',
    name: 'Crashed on container nodes',
    filters: {
      status: ['crashed'],
      nodeType: ['container-shm64'],
    },
  },
];

export const useDemoStore = create<DemoState>((set, get) => ({
  latency: 'realistic',
  errorNext: false,
  dataMode: 'normal',

  setLatency: (latency) => set({ latency }),
  setErrorNext: (errorNext) => set({ errorNext }),
  setDataMode: (dataMode) => set({ dataMode }),
  consumeError: () => {
    const shouldError = get().errorNext;
    if (shouldError) {
      set({ errorNext: false });
    }
    return shouldError;
  },

  processTree: initialProcessTree,
  killProcess: async (pid: number) => {
    // 1. Mark target as exited with SIGSEGV
    const mutateStatus = (nodes: ProcessNode[]): ProcessNode[] => {
      return nodes.map((n) => {
        if (n.pid === pid) {
          return {
            ...n,
            status: 'Exited, SIGSEGV',
            cpuPercent: 0,
            children: [], // children collapsed
          };
        }
        if (n.children) {
          return { ...n, children: mutateStatus(n.children) };
        }
        return n;
      });
    };

    set({ processTree: mutateStatus(get().processTree) });

    // 2. Wait 1.4s then respawn with PID 4161
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const respawnTree = (nodes: ProcessNode[]): ProcessNode[] => {
      return nodes.map((n) => {
        if (n.pid === pid) {
          return {
            pid: 4161,
            type: 'Renderer',
            siteOrRole: 'checkout.halcyon.test (respawned)',
            residentMB: 128,
            threads: 18,
            cpuPercent: 12,
            status: 'Healthy',
            sparkline: [40, 65, 95, 115, 128],
            livesIn: 'content/renderer/',
            children: [
              {
                pid: 4165,
                type: 'Renderer (child frame)',
                siteOrRole: 'pay.halcyon.test',
                residentMB: 54,
                threads: 8,
                cpuPercent: 1,
                status: 'Healthy',
                livesIn: 'content/renderer/',
              },
            ],
          };
        }
        if (n.children) {
          return { ...n, children: respawnTree(n.children) };
        }
        return n;
      });
    };

    set({ processTree: respawnTree(get().processTree) });
  },

  resetProcessTree: () => set({ processTree: initialProcessTree }),

  patches: initialPatches,
  hasRebased: false,
  completeRebase: () => {
    const updatedPatches = get().patches.map((p) => {
      if (['p09', 'p11', 'p14'].includes(p.id)) {
        return { ...p, rebaseStatus: 'Resolved' as const };
      }
      return p;
    });
    set({
      patches: updatedPatches,
      hasRebased: true,
    });
    get().addNotification({
      title: 'Rebase ready: chromium-M147+p14-linux-x64',
      timeAgo: 'just now',
      targetRoute: '/console/builds',
    });
  },

  notifications: DEFAULT_NOTIFICATIONS,
  markAllNotificationsRead: () => {
    set({
      notifications: get().notifications.map((n) => ({ ...n, read: true })),
    });
  },
  markNotificationRead: (id) => {
    set({
      notifications: get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    });
  },
  addNotification: (item) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}`,
      read: false,
    };
    set({ notifications: [newNotif, ...get().notifications] });
  },

  toasts: [],
  addToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const duration = toast.duration ?? 5000;
    const newToast: ToastItem = { ...toast, id };
    set({ toasts: [...get().toasts, newToast].slice(-3) }); // max 3 stacked

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
    return id;
  },
  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },

  savedViews: DEFAULT_SAVED_VIEWS,
  addSavedView: (view) => {
    const newView: SavedView = {
      ...view,
      id: `view_${Date.now()}`,
    };
    set({ savedViews: [...get().savedViews, newView] });
  },
  deleteSavedView: (id) => {
    set({ savedViews: get().savedViews.filter((v) => v.id !== id) });
  },
  renameSavedView: (id, newName) => {
    set({
      savedViews: get().savedViews.map((v) => (v.id === id ? { ...v, name: newName } : v)),
    });
  },

  resetDemoState: () => {
    set({
      latency: 'realistic',
      errorNext: false,
      dataMode: 'normal',
      processTree: initialProcessTree,
      patches: initialPatches,
      hasRebased: false,
      notifications: DEFAULT_NOTIFICATIONS,
      toasts: [],
      savedViews: DEFAULT_SAVED_VIEWS,
    });
    sessionStorage.removeItem('cairn_saved_views');
    sessionStorage.removeItem('cairn_density');
  },
}));
