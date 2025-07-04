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
        network-log-item
        relative
        bg-white/25 dark:bg-gray-800/25
        rounded-xl p-2 sm:p-4 cursor-pointer 
        border border-white/40 dark:border-gray-600/40
        backdrop-blur-md
        before:rounded-xl after:rounded-xl
        w-full min-w-0
        ${
          isSelected
            ? 'ring-2 ring-indigo-500/60 dark:ring-indigo-400/70 border-indigo-500/70 dark:border-indigo-400/70 shadow-xl shadow-indigo-500/20 dark:shadow-indigo-400/25 bg-gradient-to-br from-white/40 to-indigo-50/30 dark:from-gray-700/40 dark:to-indigo-900/30 backdrop-blur-lg selected-log'
            : 'hover:bg-gradient-to-br hover:from-white/45 hover:to-purple-50/25 dark:hover:from-gray-800/45 dark:hover:to-purple-900/25 hover:border-indigo-400/60 dark:hover:border-indigo-400/70'
        }
        group
      `}
    >
      <div className="flex flex-col space-y-2 relative z-20 w-full overflow-hidden">
        {/* Single responsive row layout - all badges stay inline until device becomes icon-only */}
        <div className="flex flex-col gap-2 transition-all duration-300 w-full overflow-hidden">
          {/* Primary badges row with responsive device badge and proper alignment */}
          <div className="flex items-center justify-between gap-2 xs:gap-3 w-full min-w-0 overflow-hidden">
            {/* Left side: Method and Status badges */}
            <div className="flex items-center gap-2 xs:gap-3 flex-shrink-0">
              {/* Method badge */}
              <span
                className={`inline-flex items-center justify-center px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg font-mono font-semibold text-xs border border-white/30 shadow-lg transition-all duration-350 group-hover:shadow-2xl group-hover:border-indigo-400/60 group-hover:bg-gradient-to-r group-hover:from-white/80 group-hover:to-indigo-50/60 dark:group-hover:from-gray-700/80 dark:group-hover:to-indigo-900/60 ${getMethodColor(log.method)} ${
                  isSelected
                    ? 'shadow-xl border-indigo-500/50 bg-gradient-to-r from-white/70 to-indigo-50/50 dark:from-gray-600/70 dark:to-indigo-800/50 font-bold tracking-wide'
                    : ''
                } flex-shrink-0`}
              >
                {log.method}
              </span>

              {/* Status badge */}
              <span
                className={`inline-flex items-center justify-center min-w-[2rem] xs:min-w-[2.5rem] h-6 xs:h-7 rounded-lg font-mono font-bold text-xs border border-white/30 shadow-md transition-all duration-350 group-hover:shadow-xl group-hover:border-indigo-400/60 group-hover:bg-gradient-to-r group-hover:from-white/80 group-hover:to-purple-50/60 dark:group-hover:from-gray-700/80 dark:group-hover:to-purple-900/60 ${getStatusBadgeColor(log.status)} ${getStatusColor(log.status)} ${
                  isSelected
                    ? 'shadow-lg border-indigo-500/50 bg-gradient-to-r from-white/70 to-purple-50/50 dark:from-gray-600/70 dark:to-purple-800/50 tracking-wider'
                    : ''
                } flex-shrink-0`}
              >
                {log.status}
              </span>
            </div>

            {/* Right side: Device and Duration badges - flex together but device shrinks first */}
            <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-shrink">
              {/* Device badge - responsive: full name → truncated → icon-only */}
              {log.deviceId && showDeviceInfo && (
                <span
                  className={`inline-flex items-center rounded-lg text-xs font-medium border border-white/40 shadow-sm transition-all duration-350 group-hover:shadow-lg group-hover:border-indigo-400/70 group-hover:bg-gradient-to-r group-hover:from-white/90 group-hover:to-blue-50/70 dark:group-hover:from-gray-600/90 dark:group-hover:to-blue-900/70 
                    min-w-[2rem] max-w-[20rem] 
                    px-2 py-1 xs:py-1.5
                    ${
                      log.devicePlatform === 'ios'
                        ? 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800/40 dark:to-blue-900/40 text-blue-800 dark:text-blue-300'
                        : 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800/40 dark:to-green-900/40 text-green-800 dark:text-green-300'
                    } ${
                      isSelected
                        ? 'shadow-md border-indigo-500/60 bg-gradient-to-r from-white/80 to-blue-50/60 dark:from-gray-500/80 dark:to-blue-800/60 font-semibold tracking-wide'
                        : ''
                    } flex-shrink`}
                  title={log.deviceName || log.deviceId}
                >
                  {log.devicePlatform === 'ios' ? (
                    <svg
                      className="w-3 h-3 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-3 h-3 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zM20.5 8c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zM15.53 2.16l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
                    </svg>
                  )}
                  {/* Device name text - hidden when space is very limited */}
                  <span className="ml-1 overflow-hidden text-ellipsis whitespace-nowrap flex-shrink min-w-0">
                    {log.deviceName || log.deviceId}
                  </span>
                </span>
              )}

              {/* Duration badge */}
              <span
                className={`font-mono text-xs px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg border border-white/30 shadow-md transition-all duration-350 group-hover:shadow-xl group-hover:border-indigo-400/60 group-hover:bg-gradient-to-r group-hover:from-white/80 group-hover:to-indigo-50/60 dark:group-hover:from-gray-700/80 dark:group-hover:to-indigo-900/60 ${getDurationColor(log.duration)} bg-white/60 dark:bg-gray-800/60 ${
                  isSelected
                    ? 'shadow-lg border-indigo-500/50 bg-gradient-to-r from-white/70 to-indigo-50/50 dark:from-gray-600/70 dark:to-indigo-800/50 font-semibold tracking-wide'
                    : ''
                } flex-shrink-0`}
              >
                {formatDuration(log.duration)}
              </span>
            </div>
          </div>

          {/* Secondary row: Domain only */}
          <div className="w-full transition-all duration-300">
            <div className="flex items-center w-full">
              {/* Domain text */}
              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all duration-350 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 group-hover:font-bold group-hover:tracking-wider block ${
                    isSelected
                      ? 'text-indigo-700 dark:text-indigo-300 font-bold tracking-wide'
                      : ''
                  }`}
                >
                  {getDomain(log.url)}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamp row for very small screens (when hidden from main row) */}
          <div className="flex items-center sm:hidden transition-all duration-300">
            <span
              className={`text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100/60 dark:bg-gray-700/60 px-2 py-1 rounded-lg border border-white/30 transition-all duration-350 group-hover:bg-gradient-to-r group-hover:from-gray-200/80 group-hover:to-indigo-100/60 dark:group-hover:from-gray-600/80 dark:group-hover:to-indigo-800/60 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 group-hover:shadow-md group-hover:font-semibold group-hover:border-indigo-400/60 ${
                isSelected
                  ? 'bg-gradient-to-r from-gray-200/50 to-indigo-100/30 dark:from-gray-500/50 dark:to-indigo-700/30 text-indigo-600 dark:text-indigo-400 shadow-sm font-medium tracking-wide border-indigo-500/50'
                  : ''
              }`}
            >
              {formatTimestamp(log.timestamp)}
            </span>
          </div>
        </div>

        {/* URL Path section with timestamp - always visible and responsive */}
        <div className="relative w-full overflow-hidden">
          <div
            className={`pl-2 xs:pl-3 sm:pl-4 border-l-2 border-indigo-400 dark:border-indigo-500 transition-all duration-300 group-hover:border-purple-500 dark:group-hover:border-purple-400 bg-gradient-to-r from-indigo-100/30 via-blue-50/15 to-transparent dark:from-indigo-900/20 dark:via-blue-900/15 rounded-r-lg group-hover:from-purple-200/40 group-hover:via-indigo-200/25 dark:group-hover:from-indigo-800/40 dark:group-hover:via-purple-800/25 group-hover:shadow-sm w-full overflow-hidden ${
              isSelected
                ? 'border-purple-500 dark:border-purple-400 bg-gradient-to-r from-purple-200/30 via-indigo-100/20 to-transparent dark:from-indigo-700/30 dark:via-purple-700/20 shadow-sm'
                : ''
            }`}
          >
            <div className="flex items-center justify-between gap-3 w-full">
              <p
                className={`text-gray-700 dark:text-gray-300 text-xs xs:text-sm font-mono break-all leading-relaxed transition-all duration-300 group-hover:text-indigo-800 dark:group-hover:text-indigo-200 group-hover:font-medium flex-1 min-w-0 ${
                  isSelected
                    ? 'text-indigo-800 dark:text-indigo-200 font-medium'
                    : ''
                }`}
                title={getPath(log.url)}
              >
                {getPath(log.url)}
              </p>
              <span
                className={`text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100/60 dark:bg-gray-700/60 px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg border border-white/30 transition-all duration-350 group-hover:bg-gradient-to-r group-hover:from-gray-200/80 group-hover:to-indigo-100/60 dark:group-hover:from-gray-600/80 dark:group-hover:to-indigo-800/60 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 group-hover:shadow-md group-hover:font-semibold group-hover:border-indigo-400/60 flex-shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-gray-200/50 to-indigo-100/30 dark:from-gray-500/50 dark:to-indigo-700/30 text-indigo-600 dark:text-indigo-400 shadow-sm font-medium tracking-wide border-indigo-500/50'
                    : ''
                }`}
              >
                {formatTimestamp(log.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
