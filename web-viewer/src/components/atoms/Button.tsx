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
    'font-medium rounded transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
  ].join(' ');

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-2.5 text-lg',
  };

  const variantClasses = {
    primary: [
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      'dark:bg-blue-500 dark:hover:bg-blue-600',
    ].join(' '),
    secondary: [
      'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
      'dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
    ].join(' '),
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
};
