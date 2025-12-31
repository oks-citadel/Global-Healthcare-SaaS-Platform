import React from 'react';
import clsx from 'clsx';

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  shape?: 'circle' | 'square';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  initials,
  size = 'md',
  status,
  shape = 'circle',
  className,
}) => {
  const sizeStyles = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-3xl',
  };

  const shapeStyles = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  };

  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    away: 'bg-warning-500',
    busy: 'bg-error-500',
  };

  const statusSizeStyles = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  const getInitials = () => {
    if (initials) return initials.toUpperCase().slice(0, 2);
    if (alt) {
      const words = alt.split(' ');
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
      }
      return alt.slice(0, 2).toUpperCase();
    }
    return '?';
  };

  return (
    <div className={clsx('relative inline-flex', className)}>
      <div
        className={clsx(
          'flex items-center justify-center overflow-hidden',
          sizeStyles[size],
          shapeStyles[shape],
          !src && 'bg-gradient-to-br from-primary-400 to-primary-600 text-white font-semibold'
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextSibling) {
                (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
              }
            }}
          />
        ) : null}
        {!src && (
          <span className="select-none">{getInitials()}</span>
        )}
      </div>

      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            statusColors[status],
            statusSizeStyles[size]
          )}
          title={status}
        />
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';
