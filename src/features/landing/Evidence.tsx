import React from 'react';
import { config } from '../../config';
import { ArrowUpRight, FolderGit2 } from 'lucide-react';

export const Evidence: React.FC = () => {
  const items = config.evidence || [];

  return (
    <section className="py-20 border-t border-[var(--line)]">
      <div className="container-site">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="eyebrow">OPEN SOURCE & CONTRIBUTIONS</span>
            <h2 className="text-3xl font-serif font-medium text-[var(--ink-1)] tracking-tight">
              Evidence of past systems & browser internals work.
            </h2>
          </div>
          <p className="text-xs font-mono text-[var(--ink-3)] max-w-xs">
            Direct repositories, upstream CLs, and diagnostic tooling.
          </p>
        </div>

        <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {items.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group py-5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[var(--hover)] px-3 -mx-3 rounded transition-colors"
            >
              <div className="flex items-start md:items-center gap-3">
                <FolderGit2 className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5 md:mt-0" />
                <div>
                  <div className="font-mono text-sm font-semibold text-[var(--ink-1)] group-hover:text-[var(--primary)] transition-colors">
                    {item.name}
                  </div>
                  <div className="text-xs text-[var(--ink-2)] mt-0.5 max-w-2xl">
                    {item.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-[var(--sunken)] text-[var(--ink-2)]">
                  {item.language}
                </span>
                <span className="text-[var(--primary)] flex items-center gap-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  View repository
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          ))}

          {items.length === 0 && (
            <div className="p-8 border border-dashed border-[var(--line-strong)] text-center text-xs text-[var(--ink-3)]">
              No evidence items configured. Add repositories in src/config.ts.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
