/** @jsxImportSource preact */
import { VNode, ComponentChildren, RefObject } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

interface ScrollFadeContainerProps {
  children: ComponentChildren;
  className?: string;
  /**
   * Whether to show fade at the top when scrolled down
   */
  showTopFade?: boolean;
  /**
   * Whether to show fade at the bottom when there's more content
   */
  showBottomFade?: boolean;
  /**
   * Height of the fade gradient in pixels
   */
  fadeHeight?: number;
  /**
   * Custom scroll element ref if you want to use an external ref
   */
  scrollRef?: RefObject<HTMLDivElement>;
  /**
   * Additional props to pass to the scroll container
   */
  scrollProps?: any;
}

export const ScrollFadeContainer = ({
  children,
  className = '',
  showTopFade = true,
  showBottomFade = true,
  fadeHeight = 240, // Increased height only, keeping current gradient
  scrollRef: externalRef,
  scrollProps = {},
}: ScrollFadeContainerProps): VNode => {
  const internalRef = useRef<HTMLDivElement>(null);
  const scrollRef = externalRef || internalRef;

  const [scrollState, setScrollState] = useState({
    isScrollable: false,
    canScrollUp: false,
    canScrollDown: false,
  });

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    let rafId: number;
    let timeoutId: number;
    const abortController = new AbortController();

    const performCheck = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const isScrollable = scrollHeight > clientHeight + 2;
      const canScrollUp = scrollTop > 2;
      const canScrollDown = scrollTop < scrollHeight - clientHeight - 2;

      // Only update state if values actually changed
      setScrollState((prev) => {
        if (
          prev.isScrollable === isScrollable &&
          prev.canScrollUp === canScrollUp &&
          prev.canScrollDown === canScrollDown
        ) {
          return prev; // No change, prevent re-render
        }

        return { isScrollable, canScrollUp, canScrollDown };
      });
    };

    const checkScrollability = () => {
      // Cancel any pending checks
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);

      rafId = requestAnimationFrame(performCheck);
    };

    const debouncedCheck = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = window.setTimeout(performCheck, 100);
    };

    // Initial check
    performCheck();

    // Immediate check on scroll (smooth)
    element.addEventListener('scroll', checkScrollability, {
      passive: true,
      signal: abortController.signal,
    });

    // Debounced check on resize (less frequent)
    window.addEventListener('resize', debouncedCheck, {
      passive: true,
      signal: abortController.signal,
    });

    // ResizeObserver to detect content changes (like when switching logs)
    const resizeObserver = new ResizeObserver(() => {
      // Use a small delay to allow content to settle
      debouncedCheck();
    });

    resizeObserver.observe(element);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
      abortController.abort();
      resizeObserver.disconnect();
    };
  }, [scrollRef]);

  return (
    <div className="relative h-full">
      {/* Scrollable content container */}
      <div ref={scrollRef} className={className} {...scrollProps}>
        {children}
      </div>

      {/* Top fade overlay */}
      {showTopFade && scrollState.isScrollable && scrollState.canScrollUp && (
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none z-30 scroll-fade-top"
          style={{
            height: `${fadeHeight}px`,
          }}
        />
      )}

      {/* Bottom fade overlay */}
      {showBottomFade &&
        scrollState.isScrollable &&
        scrollState.canScrollDown && (
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none z-30 scroll-fade-bottom"
            style={{
              height: `${fadeHeight}px`,
            }}
          />
        )}
    </div>
  );
};
