/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { ThemeToggle } from '../molecules/ThemeToggle';
import { ModernDeviceSelector } from '../molecules/ModernDeviceSelector';
import { FloatingDeviceDebug } from '../molecules/FloatingDeviceDebug';
import { GlobalSearch } from './GlobalSearch';
import type { NetVisionLog } from '../../types';

interface HeaderProps {
  isConnected: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  logs: NetVisionLog[];
  onLogSelect: (log: NetVisionLog) => void;
  onScrollToLog?: (logId: string) => void;
  onSearchClose?: () => void;
}

export const Header = ({
  isConnected,
  isDarkMode,
  toggleDarkMode,
  logs,
  onLogSelect,
  onScrollToLog,
  onSearchClose,
}: HeaderProps): VNode => {
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const debugButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60 transition-all duration-300 shadow-lg shadow-gray-900/5 dark:shadow-gray-900/20">
      {/* Gradient overlay for modern effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />

      <div className="relative w-full px-4 py-4 sm:px-6 md:px-8">
        <div className="flex w-full items-center gap-4">
          {/* Left logo & status */}
          <div className="flex items-center space-x-6">
            {/* Logo section with enhanced styling */}
            <div className="flex items-center gap-4 p-2 rounded-xl bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-700/80 dark:to-gray-600/80  border border-white/20 dark:border-gray-600/20 shadow-lg">
              <div className="text-indigo-600 dark:text-indigo-400 animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7 drop-shadow-lg"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                NetVision
              </h1>
            </div>

            {/* Connection status indicator with enhanced styling */}
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300  border shadow-lg ${
                isConnected
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-800 dark:text-green-300 border-green-200/60 dark:border-green-700/60 shadow-green-500/20'
                  : 'bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40 text-red-800 dark:text-red-300 border-red-200/60 dark:border-red-700/60 shadow-red-500/20'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  isConnected ? 'bg-green-500 animate-ping' : 'bg-red-500'
                }`}
              />
              {isConnected ? 'Server Connected' : 'Server Disconnected'}
            </div>
          </div>

          {/* Center search */}
          <div className="flex-1 flex justify-center">
            <GlobalSearch
              logs={logs}
              onLogSelect={onLogSelect}
              onScrollToLog={onScrollToLog}
              onSearchClose={onSearchClose}
            />
          </div>

          {/* Right controls */}
          <div className="flex items-center space-x-4">
            {/* Device Debug Button with enhanced styling */}
            <button
              ref={debugButtonRef}
              onClick={() => setIsDebugOpen(!isDebugOpen)}
              className={`p-3 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:scale-105 border  ${
                isDebugOpen
                  ? 'bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-700 border-indigo-300 dark:border-indigo-600 ring-2 ring-indigo-200/50 dark:ring-indigo-800/50 scale-105 shadow-indigo-200/50 dark:shadow-indigo-900/50'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 border-white/50 dark:border-gray-600/50'
              }`}
              title="Device Debug Panel"
              aria-label="Open device debug panel"
            >
              <svg
                className={`w-5 h-5 transition-all duration-300 ${
                  isDebugOpen
                    ? 'text-indigo-600 dark:text-indigo-400 rotate-12 scale-110'
                    : 'text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:rotate-6'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>

            {/* Modern Device Selector */}
            <ModernDeviceSelector isConnected={isConnected} />

            <ThemeToggle
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Floating Device Debug Panel */}
      <FloatingDeviceDebug
        isOpen={isDebugOpen}
        onClose={() => setIsDebugOpen(false)}
        anchorRef={debugButtonRef}
      />
    </header>
  );
};
