/** @jsxImportSource preact */
import { VNode } from 'preact';

interface NavigationIndicatorProps {
  isSelected: boolean;
  position: 'left' | 'right';
  className?: string;
}

/**
 * NavigationIndicator - Atom component for visual selection feedback
 * Shows a subtle indicator when a result is selected via keyboard navigation
 */
export const NavigationIndicator = ({
  isSelected,
  position = 'left',
  className = '',
}: NavigationIndicatorProps): VNode | null => {
  if (!isSelected) return null;

  const baseClasses =
    'absolute top-0 bottom-0 w-1 rounded-full transition-all duration-300';
  const gradientClasses =
    'bg-gradient-to-b from-indigo-400 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500';
  const positionClasses = position === 'left' ? 'left-0' : 'right-0';

  return (
    <div
      className={`${baseClasses} ${gradientClasses} ${positionClasses} ${className}`}
      aria-hidden="true"
    />
  );
};
