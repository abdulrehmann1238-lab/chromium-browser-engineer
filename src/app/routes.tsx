import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';
import { ConsoleLayout } from './ConsoleLayout';
import { Skeleton } from '../design/Skeleton';

// Lazy loaded routes for optimal bundle code-splitting
const LandingPage = lazy(() =>
  import('../features/landing/LandingPage').then((m) => ({ default: m.LandingPage }))
);
const CaseFile014 = lazy(() =>
  import('../features/caseFile/CaseFile014').then((m) => ({ default: m.CaseFile014 }))
);
const OverviewScreen = lazy(() =>
  import('../features/console/overview/OverviewScreen').then((m) => ({ default: m.OverviewScreen }))
);
const SessionsScreen = lazy(() =>
  import('../features/console/sessions/SessionsScreen').then((m) => ({ default: m.SessionsScreen }))
);
const SessionTraceScreen = lazy(() =>
  import('../features/console/trace/SessionTraceScreen').then((m) => ({ default: m.SessionTraceScreen }))
);
const ProcessInspectorScreen = lazy(() =>
  import('../features/console/processes/ProcessInspectorScreen').then((m) => ({ default: m.ProcessInspectorScreen }))
);
const ConsistencyLabScreen = lazy(() =>
  import('../features/console/consistency/ConsistencyLabScreen').then((m) => ({ default: m.ConsistencyLabScreen }))
);
const BuildsScreen = lazy(() =>
  import('../features/console/builds/BuildsScreen').then((m) => ({ default: m.BuildsScreen }))
);
const IncidentsScreen = lazy(() =>
  import('../features/console/incidents/IncidentsScreen').then((m) => ({ default: m.IncidentsScreen }))
);
const NotFoundScreen = lazy(() =>
  import('../features/notFound/NotFoundScreen').then((m) => ({ default: m.NotFoundScreen }))
);

const LoadingFallback = () => (
  <div className="container-site py-16 space-y-4">
    <Skeleton height={48} width="40%" className="rounded" />
    <Skeleton height={200} className="rounded-[var(--radius-xl)]" />
    <Skeleton height={140} className="rounded-[var(--radius-xl)]" />
  </div>
);

export const router = createBrowserRouter([
  // Site Shell Routes
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: 'case-files/014',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CaseFile014 />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFoundScreen />
          </Suspense>
        ),
      },
    ],
  },

  // Console Shell Routes
  {
    path: '/console',
    element: <ConsoleLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <OverviewScreen />
          </Suspense>
        ),
      },
      {
        path: 'sessions',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SessionsScreen />
          </Suspense>
        ),
      },
      {
        path: 'sessions/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SessionTraceScreen />
          </Suspense>
        ),
      },
      {
        path: 'processes',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProcessInspectorScreen />
          </Suspense>
        ),
      },
      {
        path: 'consistency',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ConsistencyLabScreen />
          </Suspense>
        ),
      },
      {
        path: 'builds',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BuildsScreen />
          </Suspense>
        ),
      },
      {
        path: 'incidents',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <IncidentsScreen />
          </Suspense>
        ),
      },
    ],
  },
]);
