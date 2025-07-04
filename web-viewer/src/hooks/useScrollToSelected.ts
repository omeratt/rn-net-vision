/** @jsxImportSource preact */
import { useEffect, useRef } from 'preact/hooks';

interface UseScrollToSelectedOptions {
  isSelected: boolean;
  extraPadding?: number;
}

export const useScrollToSelected = ({
  isSelected,
  extraPadding = 24,
}: UseScrollToSelectedOptions) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && elementRef.current) {
      const logElement = elementRef.current;
      const container = logElement.closest('.overflow-y-auto');

      if (container) {
        const containerRect = container.getBoundingClientRect();
        const logRect = logElement.getBoundingClientRect();

        // Calculate scroll offset needed
        const containerTop = containerRect.top;
        const containerBottom = containerRect.bottom;
        const logTop = logRect.top;
        const logBottom = logRect.bottom;

        let scrollOffset = 0;

        if (logTop < containerTop) {
          // Item is above viewport - scroll up
          scrollOffset = logTop - containerTop - extraPadding;
        } else if (logBottom > containerBottom) {
          // Item is below viewport - scroll down
          scrollOffset = logBottom - containerBottom + extraPadding;
        }

        if (scrollOffset !== 0) {
          container.scrollBy({
            top: scrollOffset,
            behavior: 'smooth',
          });
        }
      }
    }
  }, [isSelected, extraPadding]);

  return elementRef;
};
