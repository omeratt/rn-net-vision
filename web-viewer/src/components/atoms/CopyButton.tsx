/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState } from 'preact/hooks';

interface CopyButtonProps {
  text: string;
  onCopy?: (text: string) => void;
  size?: 'sm' | 'md';
  variant?: 'default' | 'section';
}

export const CopyButton = ({
  text,
  onCopy,
  size = 'sm',
  variant = 'default',
}: CopyButtonProps): VNode => {
  const [isClicked, setIsClicked] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsClicked(true);
      onCopy?.(text);

      // Reset animation state
      setTimeout(() => {
        setIsClicked(false);
      }, 200);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const sizeClasses = {
    sm: 'w-5 h-5 p-1',
    md: 'w-7 h-7 p-1.5',
  };

  const iconSize = {
    sm: '12',
    md: '16',
  };

  const variantClasses = {
    default: `
      bg-indigo-50/60 hover:bg-indigo-100/80 active:bg-indigo-200/90
      dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 dark:active:bg-indigo-700/60
      text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300
      border border-indigo-200/60 hover:border-indigo-300/80 
      dark:border-indigo-700/60 dark:hover:border-indigo-600/80
    `,
    section: `
      bg-indigo-50/60 hover:bg-indigo-100/80 active:bg-indigo-200/90
      dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 dark:active:bg-indigo-700/60
      text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300
      border border-indigo-200/60 hover:border-indigo-300/80 
      dark:border-indigo-700/60 dark:hover:border-indigo-600/80
    `,
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        ${sizeClasses[size]}
        inline-flex items-center justify-center
        rounded-lg copy-button-glow
        ${variantClasses[variant]}
        
        transition-all duration-300 ease-out
        hover:scale-110 active:scale-95
        hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50
        focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-1
        group relative overflow-hidden
        ${
          isClicked
            ? 'animate-pulse bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-300/60 dark:border-emerald-600/60 shadow-emerald-200/50 dark:shadow-emerald-900/50'
            : ''
        }
      `}
      title="Copy to clipboard"
      aria-label="Copy to clipboard"
    >
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-active:opacity-20 bg-current transition-opacity duration-150" />

      {/* Success shine effect */}
      {isClicked && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent animate-[shine_0.5s_ease-out]" />
      )}

      {isClicked ? (
        <svg
          width={iconSize[size]}
          height={iconSize[size]}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 animate-[checkmark_0.3s_ease-out]"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg
          width={iconSize[size]}
          height={iconSize[size]}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 group-hover:stroke-[2.5] group-hover:scale-110"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      )}
    </button>
  );
};
