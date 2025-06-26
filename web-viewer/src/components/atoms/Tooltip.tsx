/** @jsxImportSource preact */
import { useState, useRef } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import type { VNode, ComponentChildren } from 'preact';

interface TooltipProps {
  content: string;
  children: ComponentChildren;
  className?: string;
  delay?: number;
}

export const Tooltip = ({
  content,
  children,
  className = '',
  delay = 0,
}: TooltipProps): VNode => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isTooltipBelow, setIsTooltipBelow] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        // Estimate tooltip dimensions (we'll adjust these based on content)
        const tooltipWidth = Math.min(200, content.length * 8 + 24); // rough estimate
        const tooltipHeight = 40; // approximate height
        const viewportPadding = 10; // padding from viewport edges
        const tooltipGap = 8; // gap between tooltip and trigger element

        let x = rect.left + rect.width / 2;
        let y = rect.top - tooltipGap;
        let isBelow = false;

        // Horizontal edge detection and adjustment
        if (x - tooltipWidth / 2 < viewportPadding) {
          // Too far left, align to left edge with padding
          x = tooltipWidth / 2 + viewportPadding;
        } else if (x + tooltipWidth / 2 > viewportWidth - viewportPadding) {
          // Too far right, align to right edge with padding
          x = viewportWidth - tooltipWidth / 2 - viewportPadding;
        }

        // Vertical edge detection and adjustment
        if (y - tooltipHeight < viewportPadding) {
          // Not enough space above, position below the element
          y = rect.bottom + tooltipGap;
          isBelow = true;
        }

        setTooltipPosition({ x, y });
        setIsTooltipBelow(isBelow);
        setShowTooltip(true);
      }
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
  };

  // Clone the child element to add ref and event handlers
  const childElement = children as VNode;
  const enhancedChild = {
    ...childElement,
    ref: triggerRef,
    props: {
      ...childElement.props,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };

  // Calculate transform style
  const tooltipTransform = isTooltipBelow
    ? 'translateX(-50%)'
    : 'translateX(-50%) translateY(-100%)';

  return (
    <>
      {enhancedChild}

      {/* Portal-based tooltip that renders to document.body to avoid clipping */}
      {showTooltip &&
        createPortal(
          <div
            className={`fixed px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-200 text-sm rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-[99999] ${className}`}
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: tooltipTransform,
            }}
          >
            {content}
            {/* Arrow pointing to the trigger element */}
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 ${
                isTooltipBelow
                  ? 'border-b-4 border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-gray-800 bottom-full'
                  : 'border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-800 top-full'
              }`}
            />
          </div>,
          document.body
        )}
    </>
  );
};
