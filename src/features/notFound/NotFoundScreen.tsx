import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../design/Button';
import { Home, LayoutDashboard } from 'lucide-react';

export const NotFoundScreen: React.FC = () => {
  return (
    <div className="container-site py-24 flex flex-col items-center justify-center text-center">
      {/* Static SVG with one dashed, empty node */}
      <svg viewBox="0 0 320 180" className="w-64 h-36 mb-6 select-none" fill="none">
        {/* Node 1 */}
        <rect x="20" y="60" width="80" height="40" rx="6" fill="var(--surface)" stroke="var(--line-strong)" strokeWidth="1" />
        <text x="60" y="84" textAnchor="middle" fill="var(--ink-2)" fontSize="11" fontFamily="var(--font-mono)">Browser</text>

        {/* Edge */}
        <path d="M 100 80 L 180 80" stroke="var(--line)" strokeWidth="1.25" strokeDasharray="3,3" />

        {/* Empty dashed 404 node */}
        <rect x="180" y="55" width="100" height="50" rx="6" fill="var(--sunken)" stroke="var(--error)" strokeWidth="1.5" strokeDasharray="4,4" />
        <text x="230" y="80" textAnchor="middle" fill="var(--error-text)" fontSize="11" fontWeight="bold" fontFamily="var(--font-mono)">404</text>
        <text x="230" y="94" textAnchor="middle" fill="var(--ink-3)" fontSize="9" fontFamily="var(--font-mono)">dead branch</text>
      </svg>

      <span className="eyebrow">ROUTING ERROR</span>
      <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[var(--ink-1)] tracking-tight mb-2">
        That route isn't in the process tree.
      </h1>
      <p className="text-sm text-[var(--ink-3)] font-mono max-w-md mb-8">
        Check the address, or head back to the console or landing page.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Link to="/">
          <Button variant="secondary" size="md" icon={<Home className="w-4 h-4" />}>
            Go home
          </Button>
        </Link>
        <Link to="/console">
          <Button variant="primary" size="md" icon={<LayoutDashboard className="w-4 h-4" />}>
            Open the console
          </Button>
        </Link>
      </div>
    </div>
  );
};
