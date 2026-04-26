import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-sm hover:shadow-md active:scale-[0.98]',
  secondary:
    'bg-[var(--secondary)] text-white hover:bg-[var(--secondary-hover)] shadow-sm hover:shadow-md active:scale-[0.98]',
  outline:
    'bg-transparent border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]',
  ghost:
    'bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--primary)]',
  danger:
    'bg-[var(--destructive)] text-white hover:bg-red-600 shadow-sm hover:shadow-md active:scale-[0.98]',
  success:
    'bg-[var(--success)] text-white hover:bg-green-600 shadow-sm hover:shadow-md active:scale-[0.98]',
  warning:
    'bg-[var(--warning)] text-white hover:bg-amber-600 shadow-sm hover:shadow-md active:scale-[0.98]',
};

const sizeStyles: Record<string, string> = {
  xs: 'h-7 px-2.5 text-xs rounded-[var(--radius-sm)] gap-1',
  sm: 'h-8 px-3 text-xs rounded-[var(--radius)] gap-1.5',
  md: 'h-9 px-4 text-sm rounded-[var(--radius)] gap-2',
  lg: 'h-11 px-6 text-sm rounded-[var(--radius-md)] gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin w-4 h-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && !loading && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}