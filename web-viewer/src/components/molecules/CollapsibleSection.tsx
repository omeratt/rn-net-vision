/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useCollapse } from '../../hooks/useCollapse';

type CollapsibleVariant = 'section' | 'field';

interface CollapsibleSectionProps {
  title: string;
  children?: VNode | VNode[];
  className?: string;
  initialCollapsed?: boolean;
  variant?: CollapsibleVariant;
  rightContent?: VNode;
  titleClassName?: string;
  itemCount?: number;
  hideWhenExpanded?: boolean;
}

export const CollapsibleSection = ({
  title,
  children,
  className = '',
  initialCollapsed = true,
  variant = 'section',
  rightContent,
  titleClassName = '',
  itemCount,
  hideWhenExpanded = false,
}: CollapsibleSectionProps): VNode => {
  const { isCollapsed, toggle } = useCollapse(initialCollapsed);

  // Animation duration constant
  const TRANSITION_DURATION = 'duration-300';

  // Variant-specific styles
  const containerStyles = {
    section: `bg-white/20 dark:bg-gray-800/30  rounded-lg shadow-sm border border-white/20 dark:border-gray-700/30 transition-all ${TRANSITION_DURATION} ease-out hover:shadow-md hover:bg-white/25 dark:hover:bg-gray-800/40`,
    field: `transition-all ${TRANSITION_DURATION} ease-out`,
  };

  const buttonStyles = {
    section: `flex items-center gap-3 mb-3 w-full text-left group transition-all ${TRANSITION_DURATION} ease-out hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 rounded-lg p-1 -m-1`,
    field: `flex items-center justify-between gap-3 mb-1 w-full text-left group transition-all ${TRANSITION_DURATION} ease-out`,
  };

  const iconContainerStyles = {
    section: `inline-flex items-center justify-center w-5 h-5 rounded-lg 
             bg-indigo-50/60 hover:bg-indigo-100/80 active:bg-indigo-200/90
             dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 dark:active:bg-indigo-700/60
             text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300
             border border-indigo-200/60 hover:border-indigo-300/80 
             dark:border-indigo-700/60 dark:hover:border-indigo-600/80
              transition-all ${TRANSITION_DURATION} ease-out
             group-hover:scale-105 group-active:scale-95
             flex-shrink-0`,
    field: `inline-flex items-center justify-center w-4 h-4 rounded-md 
            bg-gray-100/60 hover:bg-gray-200/80 active:bg-gray-300/90
            dark:bg-gray-700/60 dark:hover:bg-gray-600/80 dark:active:bg-gray-500/90
            text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
            border border-gray-200/60 hover:border-gray-300/80 
            dark:border-gray-600/60 dark:hover:border-gray-500/80
             transition-all ${TRANSITION_DURATION} ease-out
            hover:scale-110 active:scale-95
            flex-shrink-0`,
  };

  const iconSizes = {
    section: { width: '10', height: '10' },
    field: { width: '8', height: '8' },
  };

  const titleStyles = {
    section: `text-md font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors ${TRANSITION_DURATION}`,
    field: `text-sm font-medium transition-colors ${TRANSITION_DURATION} text-left ${titleClassName}`,
  };

  const wrapperStyles = {
    section: 'p-4',
    field: isCollapsed ? 'mb-1' : 'mb-4',
  };

  const labelColor =
    variant === 'field' && title.includes('Error')
      ? 'text-red-600 dark:text-red-400'
      : variant === 'field'
        ? 'text-gray-700 dark:text-gray-300'
        : '';

  return (
    <div className={`${containerStyles[variant]} ${className}`}>
      <div className={wrapperStyles[variant]}>
        <button
          onClick={toggle}
          className={buttonStyles[variant]}
          aria-label={isCollapsed ? `Expand ${variant}` : `Collapse ${variant}`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={iconContainerStyles[variant]}>
              <svg
                width={iconSizes[variant].width}
                height={iconSizes[variant].height}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={variant === 'section' ? '2.5' : '3'}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${TRANSITION_DURATION} ease-out ${
                  isCollapsed ? 'rotate-0' : 'rotate-90'
                }`}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
            <span
              className={`${titleStyles[variant]} ${labelColor} transition-opacity ${TRANSITION_DURATION} ${
                hideWhenExpanded && !isCollapsed
                  ? 'opacity-0 scale-0'
                  : 'opacity-100 scale-100'
              }`}
            >
              {title}
              {itemCount !== undefined ? ` (${itemCount})` : ''}
            </span>
          </div>
          {variant === 'field' && rightContent && (
            <div className="flex-shrink-0">{rightContent}</div>
          )}
        </button>

        <div
          className={`transition-all ${TRANSITION_DURATION} ease-out overflow-hidden ${
            isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[3000px] opacity-100'
          }`}
        >
          <div
            className={`transition-all ${TRANSITION_DURATION} ease-out ${
              isCollapsed
                ? 'transform -translate-y-2 scale-95'
                : 'transform translate-y-0 scale-100'
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
