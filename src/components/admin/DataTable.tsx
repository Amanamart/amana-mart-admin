import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectAll?: (checked: boolean) => void;
  onSelectRow?: (id: string, checked: boolean) => void;
  className?: string;
  stickyHeader?: boolean;
}

const SKELETONS = Array.from({ length: 5 });

export function DataTable<T extends object>({
  columns,
  data,
  keyField = 'id' as keyof T,
  loading = false,
  emptyMessage = 'No data found',
  emptyIcon,
  sortKey,
  sortDir,
  onSort,
  selectable = false,
  selectedIds = [],
  onSelectAll,
  onSelectRow,
  className,
  stickyHeader = false,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && data.every((row) => selectedIds.includes(row[keyField] as string));
  const someSelected = selectedIds.length > 0 && !allSelected;

  const getCellValue = (row: T, col: Column<T>): unknown => {
    if (typeof col.key === 'string' && col.key.includes('.')) {
      return col.key.split('.').reduce<unknown>((obj, k) => {
        if (obj && typeof obj === 'object') return (obj as Record<string, unknown>)[k];
        return undefined;
      }, row);
    }
    return row[col.key as keyof T];
  };

  return (
    <div className={cn('overflow-auto rounded-[var(--radius-lg)] border border-[var(--border)]', className)}>
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr className="bg-[#f8f9fb] border-b border-[var(--border)]">
            {selectable && (
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  className="rounded border-[var(--border)] accent-[var(--primary)] cursor-pointer"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected; }}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  aria-label="Select all"
                />
              </th>
            )}
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn(
                  'px-4 py-3 text-[12px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wide text-left whitespace-nowrap',
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right',
                  col.sortable && 'cursor-pointer select-none hover:text-[var(--foreground)] transition-colors',
                  stickyHeader && 'sticky top-0 z-10 bg-[#f8f9fb]'
                )}
                style={{ width: col.width }}
                onClick={() => col.sortable && onSort?.(col.key as string)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <span className="flex flex-col gap-0">
                      <ChevronUp
                        className={cn('w-3 h-3', sortKey === col.key && sortDir === 'asc' ? 'text-[var(--primary)]' : 'opacity-30')}
                      />
                      <ChevronDown
                        className={cn('w-3 h-3 -mt-1', sortKey === col.key && sortDir === 'desc' ? 'text-[var(--primary)]' : 'opacity-30')}
                      />
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)] bg-white">
          {loading ? (
            SKELETONS.map((_, i) => (
              <tr key={i}>
                {selectable && (
                  <td className="px-4 py-3">
                    <div className="skeleton w-4 h-4 rounded" />
                  </td>
                )}
                {columns.map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="skeleton h-4 rounded w-full max-w-[120px]" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-16 text-center">
                <div className="flex flex-col items-center gap-3 text-[var(--muted-foreground)]">
                  {emptyIcon && <div className="opacity-40">{emptyIcon}</div>}
                  <p className="text-sm">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, ri) => {
              const id = row[keyField] as string;
              const isSelected = selectedIds.includes(id);
              return (
                <tr
                  key={id || ri}
                  className={cn(
                    'transition-colors duration-100',
                    isSelected ? 'bg-[var(--primary-light)]' : 'hover:bg-[#fafafa]'
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        className="rounded border-[var(--border)] accent-[var(--primary)] cursor-pointer"
                        checked={isSelected}
                        onChange={(e) => onSelectRow?.(id, e.target.checked)}
                        aria-label={`Select row ${ri + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((col, ci) => {
                    const val = getCellValue(row, col);
                    return (
                      <td
                        key={ci}
                        className={cn(
                          'px-4 py-3 text-[13px] text-[var(--foreground)]',
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right'
                        )}
                      >
                        {col.render ? col.render(val, row, ri) : (val as React.ReactNode) ?? '—'}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export function TablePagination({
  page,
  perPage,
  total,
  onPageChange,
}: {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] bg-white rounded-b-[var(--radius-lg)]">
      <p className="text-[12px] text-[var(--muted-foreground)]">
        Showing <span className="font-medium text-[var(--foreground)]">{start}–{end}</span> of{' '}
        <span className="font-medium text-[var(--foreground)]">{total}</span> results
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 rounded-[var(--radius)] text-[13px] flex items-center justify-center border border-[var(--border)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--muted)] transition-colors"
        >
          ‹
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let p = i + 1;
          if (totalPages > 5 && page > 3) p = page - 2 + i;
          if (p > totalPages) return null;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'w-8 h-8 rounded-[var(--radius)] text-[13px] flex items-center justify-center border transition-colors',
                p === page
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'border-[var(--border)] hover:bg-[var(--muted)]'
              )}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-[var(--radius)] text-[13px] flex items-center justify-center border border-[var(--border)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--muted)] transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
}
