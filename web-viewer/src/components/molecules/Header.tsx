/** @jsxImportSource preact */
import { VNode } from 'preact';
import { ThemeToggle } from './ThemeToggle';

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
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 transition-all">
      <div className="w-full px-4 py-3 sm:px-6 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-3">
              <div className="text-primary-600 dark:text-primary-400 animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
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
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>

          <ThemeToggle
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        </div>
      </div>
    </header>
  );
};
