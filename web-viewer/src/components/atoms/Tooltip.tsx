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
  const triggerRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10, // 10px above the element
        });
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

  return (
    <>
      {enhancedChild}

      {/* Portal-based tooltip that renders to document.body to avoid clipping */}
      {showTooltip &&
        createPortal(
          <div
            className={`fixed px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-200 text-sm rounded-lg shadow-lg pointer-events-none whitespace-nowrap transform -translate-x-1/2 -translate-y-full z-[99999] ${className}`}
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
            }}
          >
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-800" />
          </div>,
          document.body
        )}
    </>
  );
};
