import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import { Loader } from './features/loader/Loader';
import { usePerf } from './lib/usePerf';
import './index.css';

const AppRoot: React.FC = () => {
  const [loaderComplete, setLoaderComplete] = useState(() => {
    return Boolean(sessionStorage.getItem('cairn_loader_seen'));
  });

  // Adaptive performance monitoring (switches to data-perf="lite" if frames > 24ms)
  usePerf();

  return (
    <>
      {!loaderComplete && <Loader onComplete={() => setLoaderComplete(true)} />}
      <RouterProvider router={router} />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);
