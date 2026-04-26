import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'muted'
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

const variantMap: Record<BadgeVariant, string> = {
  primary: 'bg-[var(--primary-light)] text-[var(--primary-dark)] border border-[var(--primary)]/20',
  secondary: 'bg-[var(--secondary-light)] text-[var(--secondary)] border border-[var(--secondary)]/20',
  success: 'bg-[var(--delivered-bg)] text-[var(--delivered-text)] border border-[var(--delivered-border)]/30',
  warning: 'bg-[var(--pending-bg)] text-[var(--pending-text)] border border-[var(--pending-border)]/30',
  danger: 'bg-[var(--cancelled-bg)] text-[var(--cancelled-text)] border border-[var(--cancelled-border)]/30',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  muted: 'bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]',
  pending: 'bg-[var(--pending-bg)] text-[var(--pending-text)] border border-[var(--pending-border)]/30',
  confirmed: 'bg-[var(--confirmed-bg)] text-[var(--confirmed-text)] border border-[var(--confirmed-border)]/30',
  processing: 'bg-[var(--processing-bg)] text-[var(--processing-text)] border border-[var(--processing-border)]/30',
  out_for_delivery: 'bg-[var(--out-delivery-bg)] text-[var(--out-delivery-text)] border border-[var(--out-delivery-border)]/30',
  delivered: 'bg-[var(--delivered-bg)] text-[var(--delivered-text)] border border-[var(--delivered-border)]/30',
  cancelled: 'bg-[var(--cancelled-bg)] text-[var(--cancelled-text)] border border-[var(--cancelled-border)]/30',
  refunded: 'bg-[var(--refunded-bg)] text-[var(--refunded-text)] border border-[var(--refunded-border)]/30',
};

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function Badge({ variant = 'muted', size = 'sm', dot = false, className, style, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        variantMap[variant],
        className
      )}
      style={style}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase().replace(/\s+/g, '_') as BadgeVariant;
  const labelMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
    active: 'Active',
    inactive: 'Inactive',
    approved: 'Approved',
    blocked: 'Blocked',
  };
  const variantFallbackMap: Record<string, BadgeVariant> = {
    active: 'success',
    inactive: 'muted',
    approved: 'success',
    blocked: 'danger',
  };

  const variant = variantMap[normalized] ? normalized : (variantFallbackMap[normalized] || 'muted');
  const label = labelMap[normalized] || status;

  return (
    <Badge variant={variant as BadgeVariant} dot>
      {label}
    </Badge>
  );
}