/** @jsxImportSource preact */
import { VNode } from 'preact';

interface SearchIconProps {
  isActive?: boolean;
  className?: string;
}

export const SearchIcon = ({
  isActive = false,
  className = 'w-5 h-5',
}: SearchIconProps): VNode => {
  return (
    <div className="flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className} text-gray-500 dark:text-gray-400 transition-all duration-200 ${
          isActive ? 'scale-110 rotate-3' : 'scale-100 rotate-0'
        }`}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    </div>
  );
};
