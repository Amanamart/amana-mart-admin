'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface Tab {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (id: string) => void;
  variant?: 'underline' | 'pills' | 'cards';
  className?: string;
}

export function Tabs({ tabs, defaultTab, activeTab: controlledActive, onChange, variant = 'underline', className }: TabsProps) {
  const [internalActive, setInternalActive] = useState(defaultTab || tabs[0]?.id);
  const active = controlledActive ?? internalActive;

  const handleChange = (id: string) => {
    setInternalActive(id);
    onChange?.(id);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-0',
        variant === 'underline' && 'border-b border-[var(--border)]',
        variant === 'pills' && 'gap-1 p-1 bg-[var(--muted)] rounded-[var(--radius-md)] w-fit',
        variant === 'cards' && 'gap-2',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleChange(tab.id)}
          className={cn(
            'inline-flex items-center gap-1.5 font-medium text-sm transition-all duration-150 cursor-pointer whitespace-nowrap',
            variant === 'underline' && [
              'px-4 py-2.5 border-b-2 -mb-px',
              active === tab.id
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]',
            ],
            variant === 'pills' && [
              'px-3 py-1.5 rounded-[var(--radius)] text-[13px]',
              active === tab.id
                ? 'bg-white text-[var(--foreground)] shadow-[var(--shadow-xs)]'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
            ],
            variant === 'cards' && [
              'px-4 py-2 rounded-[var(--radius)] border text-[13px]',
              active === tab.id
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-white text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]',
            ]
          )}
        >
          {tab.icon && <span className="shrink-0">{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                'text-[11px] font-semibold px-1.5 py-0.5 rounded-full',
                active === tab.id ? 'bg-white/20 text-inherit' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
