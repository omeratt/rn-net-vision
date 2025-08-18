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
    <header className="relative bg-transparent backdrop-blur-sm border-b border-gray-200/30 dark:border-slate-700/30 transition-all duration-300 shadow-sm shadow-gray-900/5 dark:shadow-slate-900/20">
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-white/5 dark:bg-slate-900/10" />

      <div className="relative w-full px-4 py-4 sm:px-6 md:px-8">
        <div className="flex w-full items-center gap-4">
          {/* Left logo & status */}
          <div className="flex items-center space-x-6">
            {/* Logo section with enhanced styling */}
            <div className="flex items-center gap-4 p-2 rounded-xl bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-slate-800/80 dark:to-slate-700/80 border border-white/20 dark:border-slate-600/20 shadow-lg">
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-20% to-purple-400 dark:from-indigo-300 dark:via-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
                NetVision
              </h1>
            </div>
          </div>

          {/* Center search */}
          <div className="flex-1 flex justify-center px-4">
            <div className="w-full max-w-xl min-w-56">
              <GlobalSearch
                logs={logs}
                onLogSelect={onLogSelect}
                onScrollToLog={onScrollToLog}
                onSearchClose={onSearchClose}
              />
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center space-x-4">
            {/* Device Debug Button with enhanced styling */}
            <button
              ref={debugButtonRef}
              onClick={() => setIsDebugOpen(!isDebugOpen)}
              className={`p-3 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:scale-105 border  ${
                isDebugOpen
                  ? 'bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-slate-700 dark:to-indigo-800 border-indigo-300 dark:border-indigo-600 ring-2 ring-indigo-200/50 dark:ring-indigo-800/50 scale-105 shadow-indigo-200/50 dark:shadow-indigo-900/50'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-600 dark:hover:to-slate-500 border-white/50 dark:border-slate-600/50'
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
