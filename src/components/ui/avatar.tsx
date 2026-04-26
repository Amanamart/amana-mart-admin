import { forwardRef } from 'react';
import { cn, getInitials } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full bg-muted',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img className="aspect-square h-full w-full object-cover" src={src} alt={alt} />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-primary/10 font-medium text-primary">
            {typeof fallback === 'string' ? getInitials(fallback) : fallback || '?'}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };