import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-[12px] text-[var(--muted-foreground)] mb-1.5">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-[var(--border)]">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-[var(--primary)] transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className={i === breadcrumbs.length - 1 ? 'text-[var(--foreground)] font-medium' : ''}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-[20px] font-bold text-[var(--foreground)] leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-[13px] text-[var(--muted-foreground)] mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between gap-3 mb-4', className)}>
      <div>
        <h2 className="text-[15px] font-semibold text-[var(--foreground)]">{title}</h2>
        {subtitle && <p className="text-[12px] text-[var(--muted-foreground)] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
