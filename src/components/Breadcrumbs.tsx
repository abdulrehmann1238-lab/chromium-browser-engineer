import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs font-medium text-[var(--ink-3)]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-[var(--line-strong)]" />}
            {isLast || !item.to ? (
              <span className="text-[var(--ink-1)] font-mono">{item.label}</span>
            ) : (
              <Link
                to={item.to}
                className="hover:text-[var(--ink-1)] hover:underline transition-colors duration-[var(--dur-fast)]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
