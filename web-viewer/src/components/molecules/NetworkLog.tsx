/** @jsxImportSource preact */
import type { VNode } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import type { NetVisionLog } from '../../types';

interface NetworkLogProps {
  log: NetVisionLog;
  isSelected?: boolean;
  onClick?: () => void;
  activeDeviceId?: string | null;
}

export const NetworkLog = ({
  log,
  isSelected,
  onClick,
  activeDeviceId,
}: NetworkLogProps): VNode => {
  const logRef = useRef<HTMLDivElement>(null);

  // Only show device info when "All Devices" is selected (no activeDeviceId)
  const showDeviceInfo = !activeDeviceId;

  // Scroll into view when selected with proper spacing
  useEffect(() => {
    if (isSelected && logRef.current) {
      const logElement = logRef.current;
      const container = logElement.closest('.overflow-y-auto');

      if (container) {
        const containerRect = container.getBoundingClientRect();
        const logRect = logElement.getBoundingClientRect();

        // Calculate scroll offset needed
        const containerTop = containerRect.top;
        const containerBottom = containerRect.bottom;
        const logTop = logRect.top;
        const logBottom = logRect.bottom;

        // Extra padding to account for spacing, borders, and visual effects
        const extraPadding = 24; // accounts for space-y-3 (12px) + borders + ring effects

        let scrollOffset = 0;

        if (logTop < containerTop) {
          // Item is above viewport - scroll up
          scrollOffset = logTop - containerTop - extraPadding;
        } else if (logBottom > containerBottom) {
          // Item is below viewport - scroll down
          scrollOffset = logBottom - containerBottom + extraPadding;
        }

        if (scrollOffset !== 0) {
          container.scrollBy({
            top: scrollOffset,
            behavior: 'smooth',
          });
        }
      }
    }
  }, [isSelected]);
  const getStatusColor = (status: number): string => {
    if (status < 300) return 'text-green-500 dark:text-green-400';
    if (status < 400) return 'text-blue-500 dark:text-blue-400';
    return 'text-red-500 dark:text-red-400';
  };

  const getStatusBadgeColor = (status: number): string => {
    if (status < 300) return 'bg-green-100 dark:bg-green-900/40';
    if (status < 400) return 'bg-blue-100 dark:bg-blue-900/40';
    return 'bg-red-100 dark:bg-red-900/40';
  };

  const getMethodColor = (method: string): string => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'POST':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'PUT':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'PATCH':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDuration = (duration: number): string => {
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const getDurationColor = (duration: number): string => {
    if (duration < 100) return 'text-green-600 dark:text-green-400';
    if (duration < 500) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Extract domain from URL for display
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url.split('/')[0];
    }
  };

  // Get the path part of the URL
  const getPath = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search;
    } catch (e) {
      const parts = url.split('/');
      return parts.slice(1).join('/');
    }
  };

  // Format timestamp to a readable format
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <div
      ref={logRef}
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-white/20 dark:bg-gray-800/20
        rounded-xl p-4 cursor-pointer 
        transition-all duration-200 ease-out
        border border-white/30 dark:border-gray-600/30
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent 
        before:translate-x-[-100%] before:transition-transform before:duration-700 before:ease-out
        hover:before:translate-x-[100%]
        transform-gpu backface-visibility-hidden image-rendering-crisp-edges
        ${
          isSelected
            ? 'ring-2 ring-indigo-400/60 dark:ring-indigo-400/80 border-indigo-300/70 dark:border-indigo-600/70 shadow-xl shadow-indigo-500/20 dark:shadow-indigo-900/40 bg-white/30 dark:bg-gray-800/30 scale-[1.015]'
            : 'hover:ring-1 hover:ring-gray-300/50 dark:hover:ring-gray-600/50 shadow-lg shadow-gray-900/5 dark:shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/10 dark:hover:shadow-gray-900/30 hover:bg-white/30 dark:hover:bg-gray-800/30 hover:scale-[1.01]'
        }
        group
      `}
    >
      <div className="flex flex-col space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-mono font-semibold text-xs border border-white/20 shadow-lg ${getMethodColor(log.method)} transition-all duration-200`}
            >
              {log.method}
            </span>
            <span
              className={`inline-flex items-center justify-center min-w-[2.5rem] h-7 rounded-lg font-mono font-bold text-xs border border-white/20 shadow-md ${getStatusBadgeColor(log.status)} ${getStatusColor(log.status)} transition-all duration-200`}
            >
              {log.status}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-200">
                {getDomain(log.url)}
              </span>
              {log.deviceId && showDeviceInfo && (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-white/30 shadow-sm transition-all duration-200
                  ${
                    log.devicePlatform === 'ios'
                      ? 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800/40 dark:to-blue-900/40 text-blue-800 dark:text-blue-300'
                      : 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800/40 dark:to-green-900/40 text-green-800 dark:text-green-300'
                  }`}
                >
                  {log.devicePlatform === 'ios' ? (
                    <svg
                      className="w-3 h-3 mr-1"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-3 h-3 mr-1"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zM20.5 8c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zM15.53 2.16l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
                    </svg>
                  )}
                  {log.deviceName || log.deviceId.substring(0, 6)}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center space-x-2">
              <span
                className={`font-mono text-xs px-3 py-1.5 rounded-lg border border-white/20 shadow-md ${getDurationColor(log.duration)} bg-white/50 dark:bg-gray-800/50 transition-all duration-200`}
              >
                {formatDuration(log.duration)}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100/50 dark:bg-gray-700/50 px-2 py-1 rounded-md">
              {formatTimestamp(log.timestamp)}
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="pl-4 border-l-2 border-indigo-400 dark:border-indigo-500 group-hover:border-purple-500 transition-colors duration-200 bg-gradient-to-r from-purple-300/50 via-blue-50/20 to-transparent dark:from-indigo-900/30 dark:via-blue-900/20 rounded-r-lg">
            <p className="text-gray-700 dark:text-gray-300 text-sm font-mono break-words overflow-wrap-anywhere leading-relaxed group-hover:text-indigo-800 dark:group-hover:text-indigo-200 transition-colors duration-200 transform-gpu">
              {getPath(log.url)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
