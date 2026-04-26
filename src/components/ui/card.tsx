import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  border?: boolean;
}

export function Card({ padding = 'md', hover = false, border = true, className, children, ...props }: CardProps) {
  const padMap = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-6' };
  return (
    <div
      className={cn(
        'bg-white rounded-[var(--radius-lg)]',
        border && 'border border-[var(--border)]',
        'shadow-[var(--shadow-sm)]',
        hover && 'transition-shadow duration-200 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5',
        padMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-[15px] font-semibold text-[var(--foreground)]', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between pt-4 mt-4 border-t border-[var(--border)]', className)}
      {...props}
    >
      {children}
    </div>
  );
}