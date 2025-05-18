/** @jsxImportSource preact */
import { VNode } from 'preact';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const ThemeToggle = ({
  isDarkMode,
  toggleDarkMode,
}: ThemeToggleProps): VNode => {
  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex h-9 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-200 p-1 transition-colors duration-500 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 dark:focus:ring-indigo-400/30"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span
        className={`absolute ${
          isDarkMode ? 'translate-x-[18px]' : '-translate-x-[18px]'
        } flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-500 dark:bg-gray-800`}
      >
        {isDarkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="text-yellow-400"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="text-orange-400"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        )}
      </span>
      <span
        className={`absolute left-1.5 flex h-5 w-5 scale-0 items-center justify-center text-orange-400 opacity-0 transition-all duration-500 ${
          !isDarkMode ? 'scale-100 opacity-100' : ''
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </span>
      <span
        className={`absolute right-1.5 flex h-5 w-5 scale-0 items-center justify-center text-yellow-400 opacity-0 transition-all duration-500 ${
          isDarkMode ? 'scale-100 opacity-100' : ''
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </span>
    </button>
  );
};
