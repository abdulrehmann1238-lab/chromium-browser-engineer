import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDemoStore } from '../store/demoStore';
import { config } from '../config';
import { CairnMark } from '../components/CairnMark';
import { CommandPalette } from '../components/CommandPalette';
import { DemoControls } from '../components/DemoControls';
import { ToastContainer } from '../design/Toast';
import { IconButton } from '../design/IconButton';
import {
  LayoutDashboard,
  Globe,
  Layers,
  GitBranch,
  ShieldAlert,
  SlidersHorizontal,
  Search,
  Bell,
  ArrowLeft,
  FileText,
  Check,
  Menu,
} from 'lucide-react';

export const ConsoleLayout: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notifPopoverOpen, setNotifPopoverOpen] = useState(false);
  const [clockString, setClockString] = useState('2026-10-21 09:41:00 UTC');

  const {
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
  } = useDemoStore();

  const location = useLocation();
  const navigate = useNavigate();

  // Ticking demo clock
  useEffect(() => {
    const INITIAL_DEMO_TIME = new Date('2026-10-21T09:41:00Z').getTime();
    const START_WALL = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - START_WALL;
      const current = new Date(INITIAL_DEMO_TIME + elapsed);
      const y = current.getUTCFullYear();
      const m = String(current.getUTCMonth() + 1).padStart(2, '0');
      const d = String(current.getUTCDate()).padStart(2, '0');
      const hh = String(current.getUTCHours()).padStart(2, '0');
      const mm = String(current.getUTCMinutes()).padStart(2, '0');
      const ss = String(current.getUTCSeconds()).padStart(2, '0');
      setClockString(`${y}-${m}-${d} ${hh}:${mm}:${ss} UTC`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Global keyboard shortcut: Cmd/Ctrl + K and navigation keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const NAV_ITEMS = [
    { label: 'Overview', route: '/console', icon: LayoutDashboard },
    { label: 'Sessions', route: '/console/sessions', icon: Globe },
    { label: 'Processes', route: '/console/processes', icon: Layers },
    { label: 'Consistency', route: '/console/consistency', icon: SlidersHorizontal },
    { label: 'Builds & Patches', route: '/console/builds', icon: GitBranch },
    { label: 'Incidents', route: '/console/incidents', icon: ShieldAlert, badge: 2 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink-1)] select-none">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Desktop / Tablet) */}
        <aside
          aria-label="Console Sidebar"
          className="hidden md:flex flex-col w-[232px] lg:w-[232px] bg-[var(--surface)] border-r border-[var(--line)] shrink-0 select-none z-20"
        >
          {/* Header */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-[var(--line)]">
            <Link to="/" className="flex items-center gap-2.5 group">
              <CairnMark className="w-5 h-5 text-[var(--ink-1)]" />
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif font-semibold text-lg tracking-tight text-[var(--ink-1)]">
                  Cairn
                </span>
                <span className="font-mono text-[10px] text-[var(--ink-3)] uppercase tracking-wider">
                  Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Console Primary" className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.route === '/console'
                  ? location.pathname === '/console'
                  : location.pathname.startsWith(item.route);

              return (
                <Link
                  key={item.route}
                  to={item.route}
                  className={`flex items-center justify-between h-9 px-3 rounded-[var(--radius-md)] text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--primary-subtle)] text-[var(--primary)] font-semibold border-l-2 border-[var(--primary)]'
                      : 'text-[var(--ink-2)] hover:bg-[var(--hover)] hover:text-[var(--ink-1)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.badge === 'number' && (
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--error-tint)] text-[var(--error-text)] font-semibold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer Links & User Chip */}
          <div className="p-3 border-t border-[var(--line)] space-y-2 bg-[var(--surface)]">
            <Link
              to="/case-files/014"
              className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] text-xs text-[var(--ink-2)] hover:bg-[var(--hover)] hover:text-[var(--ink-1)] transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Case File 014</span>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] text-xs text-[var(--ink-2)] hover:bg-[var(--hover)] hover:text-[var(--ink-1)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to site</span>
            </Link>

            {/* Viewer Chip */}
            <div className="pt-2 border-t border-[var(--line)]/60 flex items-center gap-2.5 px-2 py-1">
              <div className="w-7 h-7 rounded-full bg-[var(--sunken)] border border-[var(--line-strong)] flex items-center justify-center font-mono text-[11px] font-semibold text-[var(--ink-1)]">
                SR
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[var(--ink-1)] truncate">
                  {config.yourName}
                </span>
                <span className="text-[10px] font-mono text-[var(--ink-3)] truncate">
                  Contract engineer
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <header className="h-14 px-4 sm:px-6 bg-[var(--paper)] border-b border-[var(--line)] flex items-center justify-between shrink-0 gap-4">
            {/* Search trigger field */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center justify-between w-full max-w-[320px] h-9 px-3 bg-[var(--elevated)] border border-[var(--line-strong)] hover:border-[var(--ink-3)] rounded-[var(--radius-md)] text-xs text-[var(--ink-3)] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-[var(--ink-3)]" />
                <span>Search sessions, components...</span>
              </span>
              <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-[var(--line-strong)] bg-[var(--sunken)] text-[var(--ink-2)]">
                ⌘K
              </kbd>
            </button>

            {/* Right Tools */}
            <div className="flex items-center gap-3">
              {/* Environment badge */}
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--line)] text-xs font-mono text-[var(--ink-2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Production fleet (41 nodes)</span>
              </div>

              {/* Notifications Bell */}
              <div className="relative">
                <IconButton
                  label="Notifications"
                  size="sm"
                  onClick={() => setNotifPopoverOpen(!notifPopoverOpen)}
                >
                  <Bell className="w-4 h-4" />
                </IconButton>
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--accent)]" />
                )}

                {/* Notifications Popover */}
                {notifPopoverOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--elevated)] border border-[var(--line)] rounded-[var(--radius-lg)] shadow-[var(--shadow-overlay)] p-3 z-[var(--z-popover)] animate-overlay text-xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--line)]">
                      <span className="font-semibold text-[var(--ink-1)]">Notifications</span>
                      {unreadNotifs > 0 && (
                        <button
                          type="button"
                          onClick={() => markAllNotificationsRead()}
                          className="text-[11px] font-mono text-[var(--primary)] hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.targetRoute) navigate(n.targetRoute);
                            setNotifPopoverOpen(false);
                          }}
                          className={`p-2 rounded-[var(--radius-sm)] flex items-start justify-between cursor-pointer transition-colors ${
                            n.read ? 'hover:bg-[var(--hover)] text-[var(--ink-2)]' : 'bg-[var(--primary-subtle)] text-[var(--ink-1)] font-medium'
                          }`}
                        >
                          <div>
                            <div>{n.title}</div>
                            <span className="text-[10px] font-mono text-[var(--ink-3)]">{n.timeAgo}</span>
                          </div>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--primary)] shrink-0 mt-1" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Persistent Honesty Chip */}
              <span className="px-2 py-0.5 rounded bg-[var(--sunken)] text-[11px] font-mono font-medium text-[var(--ink-2)] border border-[var(--line-strong)]">
                Illustrative data
              </span>
            </div>
          </header>

          {/* Page Body Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>

          {/* Footer Strip */}
          <footer className="h-9 px-4 sm:px-6 bg-[var(--surface)] border-t border-[var(--line)] flex items-center justify-between shrink-0 text-xs font-mono text-[var(--ink-3)] select-none">
            <div className="flex items-center gap-4">
              <span>{clockString}</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline text-[var(--ink-2)]">All data is illustrative</span>
            </div>

            <div className="flex items-center gap-3">
              <DemoControls />
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (<768px) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden h-14 bg-[var(--surface)] border-t border-[var(--line)] flex items-center justify-around px-2 z-30 shrink-0 select-none"
      >
        <Link
          to="/console"
          className={`flex flex-col items-center gap-1 text-[11px] ${
            location.pathname === '/console' ? 'text-[var(--primary)] font-semibold' : 'text-[var(--ink-3)]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </Link>
        <Link
          to="/console/sessions"
          className={`flex flex-col items-center gap-1 text-[11px] ${
            location.pathname.startsWith('/console/sessions') ? 'text-[var(--primary)] font-semibold' : 'text-[var(--ink-3)]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Sessions</span>
        </Link>
        <Link
          to="/console/sessions/ses_7Q2K9M"
          className={`flex flex-col items-center gap-1 text-[11px] ${
            location.pathname.includes('ses_7Q2K9M') ? 'text-[var(--primary)] font-semibold' : 'text-[var(--ink-3)]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Trace</span>
        </Link>
        <Link
          to="/console/consistency"
          className={`flex flex-col items-center gap-1 text-[11px] ${
            location.pathname.startsWith('/console/consistency') ? 'text-[var(--primary)] font-semibold' : 'text-[var(--ink-3)]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Lab</span>
        </Link>
        <Link
          to="/case-files/014"
          className={`flex flex-col items-center gap-1 text-[11px] ${
            location.pathname.startsWith('/case-files') ? 'text-[var(--primary)] font-semibold' : 'text-[var(--ink-3)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Case 014</span>
        </Link>
      </nav>

      {/* Overlays */}
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <ToastContainer />
    </div>
  );
};
