import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  change?: number;
  changePeriod?: string;
  className?: string;
  color?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg = '#e8f9ee',
  change,
  changePeriod = 'vs last month',
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === 0;

  return (
    <div
      className={cn(
        'bg-white rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)] p-5',
        'transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-[var(--muted-foreground)] mb-1 truncate">{title}</p>
          <p className="text-2xl font-bold text-[var(--foreground)] leading-tight">{value}</p>
          {subtitle && (
            <p className="text-[12px] text-[var(--muted-foreground)] mt-1 truncate">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive && <TrendingUp className="w-3.5 h-3.5 text-green-500 shrink-0" />}
              {isNegative && <TrendingDown className="w-3.5 h-3.5 text-red-500 shrink-0" />}
              {isNeutral && <Minus className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
              <span
                className={cn(
                  'text-[12px] font-medium',
                  isPositive && 'text-green-600',
                  isNegative && 'text-red-500',
                  isNeutral && 'text-gray-500'
                )}
              >
                {isPositive && '+'}
                {change}% {changePeriod}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center shrink-0"
            style={{ backgroundColor: iconBg }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export interface OrderStatusCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export function OrderStatusCard({ label, count, icon, color, bgColor }: OrderStatusCardProps) {
  return (
    <div
      className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] p-4 flex items-center gap-3 cursor-pointer"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <div
        className="w-10 h-10 rounded-[var(--radius)] flex items-center justify-center shrink-0"
        style={{ backgroundColor: bgColor }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-xl font-bold text-[var(--foreground)]">{count.toLocaleString()}</p>
        <p className="text-[12px] text-[var(--muted-foreground)] font-medium leading-tight">{label}</p>
      </div>
    </div>
  );
}
