/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState, useEffect } from 'preact/hooks';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export const Toast = ({
  message,
  isVisible,
  onClose,
  duration = 3000,
  type = 'success',
}: ToastProps): VNode => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const typeStyles = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-700/50',
      text: 'text-emerald-800 dark:text-emerald-200',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-700/50',
      text: 'text-blue-800 dark:text-blue-200',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-700/50',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: 'text-yellow-600 dark:text-yellow-400',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-700/50',
      text: 'text-red-800 dark:text-red-200',
      icon: 'text-red-600 dark:text-red-400',
    },
  };

  const currentStyle = typeStyles[type];

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        );
      case 'info':
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        );
      case 'warning':
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="m12 17 .01 0" />
          </svg>
        );
      case 'error':
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!isVisible) return <div />;

  return (
    <div
      className={`
        flex items-center gap-3
        px-4 py-3 rounded-xl
        ${currentStyle.bg} ${currentStyle.border} ${currentStyle.text}
        border shadow-xl 
        min-w-[300px] max-w-[400px]
        transform transition-all duration-500 ease-out
        ${
          isAnimating && isVisible
            ? 'translate-x-0 opacity-100 scale-100 translate-y-0'
            : 'translate-x-full opacity-0 scale-95 translate-y-2'
        }
        hover:shadow-2xl hover:scale-[1.02]
        relative overflow-hidden
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className={`${currentStyle.icon} flex-shrink-0 z-10`}>
        {getIcon()}
      </div>

      <div className="flex-1 text-sm font-medium z-10">{message}</div>

      <button
        onClick={() => {
          setIsAnimating(false);
          setTimeout(onClose, 300);
        }}
        className={`
          ${currentStyle.icon} hover:opacity-80
          flex-shrink-0 p-1 rounded-lg
          transition-all duration-200
          hover:bg-black/5 dark:hover:bg-white/5 hover:scale-110
          focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-30
          z-10
        `}
        aria-label="Close notification"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 6-12 12" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
};
