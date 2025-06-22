/** @jsxImportSource preact */
import type { ComponentChildren, VNode } from 'preact';

interface ButtonProps {
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: ComponentChildren;
}

export const Button = ({
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
}: ButtonProps): VNode => {
  const baseClasses = [
    'relative overflow-hidden font-semibold rounded-xl transition-all duration-300 ease-out',
    'focus:outline-none focus:ring-4 focus:ring-offset-2 transform',
    'active:scale-95 disabled:scale-100',
    'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
    'before:translate-x-[-100%] before:transition-transform before:duration-700 before:ease-out',
    'hover:before:translate-x-[100%]',
  ].join(' ');

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: [
      'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25',
      'hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105',
      'focus:ring-blue-500/50 dark:focus:ring-blue-400/50',
      'dark:from-blue-500 dark:to-indigo-500 dark:shadow-blue-900/30',
      'dark:hover:from-blue-600 dark:hover:to-indigo-600',
    ].join(' '),
    secondary: [
      'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300 shadow-md',
      'hover:from-gray-200 hover:to-gray-300 hover:shadow-lg hover:scale-105',
      'focus:ring-gray-500/50',
      'dark:from-gray-700 dark:to-gray-600 dark:text-gray-200 dark:border-gray-600',
      'dark:hover:from-gray-600 dark:hover:to-gray-500',
    ].join(' '),
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        disabled
          ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-md'
          : ''
      }`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};
