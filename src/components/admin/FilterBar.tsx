'use client';

import React from 'react';
import { Search, Filter, RefreshCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface FilterBarProps {
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (val: string) => void;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  onRefresh?: () => void;
  onExport?: () => void;
  className?: string;
}

export function FilterBar({
  searchValue,
  searchPlaceholder = 'Search...',
  onSearchChange,
  filters,
  actions,
  onRefresh,
  onExport,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 p-4 bg-white rounded-t-[var(--radius-lg)] border border-b-0 border-[var(--border)]',
        className
      )}
    >
      {/* Search */}
      {onSearchChange && (
        <div className="flex-1 min-w-[200px] max-w-xs">
          <Input
            id="filter-search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      )}

      {/* Custom filters */}
      {filters && <div className="flex items-center gap-2 flex-wrap">{filters}</div>}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {actions}
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            aria-label="Refresh"
          >
            Refresh
          </Button>
        )}
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            aria-label="Export"
          >
            Export
          </Button>
        )}
        <button className="w-8 h-8 flex items-center justify-center rounded-[var(--radius)] border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors">
          <Filter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
