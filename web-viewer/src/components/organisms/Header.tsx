/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { ThemeToggle } from '../molecules/ThemeToggle';
import { ModernDeviceSelector } from '../molecules/ModernDeviceSelector';
import { FloatingDeviceDebug } from '../molecules/FloatingDeviceDebug';

interface HeaderProps {
  isConnected: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header = ({
  isConnected,
  isDarkMode,
  toggleDarkMode,
}: HeaderProps): VNode => {
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const debugButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 transition-all">
      <div className="w-full px-4 py-3 sm:px-6 md:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <div className="flex items-center gap-3">
              <div className="text-primary-600 dark:text-primary-400 animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                NetVision
              </h1>
            </div>
            <div
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
                isConnected
                  ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-1.5 ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}
              />
              {isConnected ? 'Server Connected' : 'Server Disconnected'}
            </div>
          </div>

          <div className="flex flex-wrap items-center space-x-4">
            {/* Device Debug Button */}
            <button
              ref={debugButtonRef}
              onClick={() => setIsDebugOpen(!isDebugOpen)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 group"
              title="Device Debug Panel"
              aria-label="Open device debug panel"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
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
