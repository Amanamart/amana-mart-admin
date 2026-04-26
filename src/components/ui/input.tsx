import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, wrapperClassName, className, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1', wrapperClassName)}>
        {label && (
          <label className="text-[13px] font-medium text-[var(--foreground)]">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-9 rounded-[var(--radius)] border border-[var(--border)] bg-white text-sm text-[var(--foreground)]',
              'placeholder:text-[var(--muted-foreground)] transition-colors duration-150',
              'focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--muted)]',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
              leftIcon ? 'pl-9' : 'pl-3',
              rightIcon ? 'pr-9' : 'pr-3',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] flex items-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-[12px] text-red-500">{error}</p>}
        {hint && !error && <p className="text-[12px] text-[var(--muted-foreground)]">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  wrapperClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, wrapperClassName, className, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1', wrapperClassName)}>
        {label && (
          <label className="text-[13px] font-medium text-[var(--foreground)]">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full h-9 rounded-[var(--radius)] border border-[var(--border)] bg-white text-sm text-[var(--foreground)] px-3',
            'focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-400',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[12px] text-red-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, wrapperClassName, className, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1', wrapperClassName)}>
        {label && (
          <label className="text-[13px] font-medium text-[var(--foreground)]">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full rounded-[var(--radius)] border border-[var(--border)] bg-white text-sm text-[var(--foreground)] px-3 py-2.5 resize-none',
            'placeholder:text-[var(--muted-foreground)] transition-colors duration-150',
            'focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-400',
            className
          )}
          {...props}
        />
        {error && <p className="text-[12px] text-red-500">{error}</p>}
        {hint && !error && <p className="text-[12px] text-[var(--muted-foreground)]">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';