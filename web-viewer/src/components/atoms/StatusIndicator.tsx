/** @jsxImportSource preact */
import { VNode } from 'preact';

interface StatusIndicatorProps {
  isOnline: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'minimal';
}

export const StatusIndicator = ({
  isOnline,
  size = 'md',
  showLabel = false,
  className = '',
  variant = 'default',
}: StatusIndicatorProps): VNode => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const containerSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const dotSize = sizeClasses[size];
  const containerSize = containerSizeClasses[size];

  // Use minimal variant for dropdown contexts to avoid visual noise
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div
          className={`
            ${dotSize} rounded-full transition-all duration-300
            ${
              isOnline
                ? 'bg-emerald-500 dark:bg-emerald-400'
                : 'bg-red-500 dark:bg-red-400'
            }
          `}
        />
        {showLabel && (
          <span
            className={`
              text-xs font-medium transition-colors duration-300
              ${
                isOnline
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-500 dark:text-gray-400'
              }
            `}
          >
            {isOnline ? 'Online' : 'Offline'}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Glassy container with contrast background */}
      <div
        className={`${containerSize} relative rounded-full bg-white/20 dark:bg-black/20  border border-white/30 dark:border-gray-600/30 shadow-lg flex items-center justify-center`}
      >
        {/* Main status dot */}
        <div
          className={`
            ${dotSize} rounded-full transition-all duration-300 relative z-10
            ${
              isOnline
                ? 'bg-emerald-400 dark:bg-emerald-300 shadow-emerald-400/60 dark:shadow-emerald-300/60 shadow-lg'
                : 'bg-red-400 dark:bg-red-300 shadow-red-400/60 dark:shadow-red-300/60 shadow-lg'
            }
          `}
        />

        {/* Animated pulse ring for online status */}
        {isOnline && (
          <div
            className={`
              absolute inset-0 ${dotSize} rounded-full m-auto
              bg-emerald-400/40 dark:bg-emerald-300/40 animate-ping
            `}
          />
        )}

        {/* Subtle glow effect */}
        {isOnline && (
          <div
            className={`
              absolute inset-0 ${dotSize} rounded-full m-auto
              bg-emerald-400/30 dark:bg-emerald-300/30 animate-pulse
            `}
          />
        )}
      </div>

      {showLabel && (
        <span
          className={`
            text-xs font-medium transition-colors duration-300
            ${
              isOnline
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-500 dark:text-gray-400'
            }
          `}
        >
          {isOnline ? 'Online' : 'Offline'}
        </span>
      )}
    </div>
  );
};
