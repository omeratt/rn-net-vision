/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState } from 'preact/hooks';

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
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleDarkMode();
    setTimeout(() => setIsAnimating(false), 700); // Animation duration
  };

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <span className="animate-pulse">📡</span>
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 bg-clip-text text-transparent">
                NetVision
              </span>
            </h1>
            <span
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
            </span>
          </div>

          <button
            onClick={handleToggle}
            className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-hidden"
            aria-label={
              isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
            }
          >
            <div className="flex w-10 h-6 items-center justify-between px-1">
              <div
                className={`transition-all duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-30'}`}
              >
                🌙
              </div>
              <div
                className={`transition-all duration-300 ${!isDarkMode ? 'opacity-100' : 'opacity-30'}`}
              >
                🌞
              </div>
            </div>
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white dark:bg-indigo-400 shadow-sm transform transition-transform duration-300 ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0'
              } ${isAnimating ? 'animate-wiggle' : ''}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
