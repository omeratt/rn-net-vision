import { useState, useRef, useEffect } from 'preact/hooks';

const SPLIT_POSITION_KEY = 'netvision-split-position';

export const useSplitPanel = () => {
  const [splitPosition, setSplitPosition] = useState<number>(() => {
    const savedPosition = localStorage.getItem(SPLIT_POSITION_KEY);
    return savedPosition ? parseFloat(savedPosition) : 50;
  });

  const splitRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to optimize the animation performance
    let animationFrameId: number | null = null;
    let lastPosition = splitPosition;

    const handleMove = (clientX: number) => {
      if (!isDragging.current || !splitRef.current) return;

      // Cancel any pending animation frame
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      // Use requestAnimationFrame to smooth out the animation
      animationFrameId = requestAnimationFrame(() => {
        const containerRect =
          splitRef.current?.parentElement?.getBoundingClientRect();
        if (!containerRect) return;

        const position =
          ((clientX - containerRect.left) / containerRect.width) * 100;
        const newPosition = Math.min(Math.max(20, position), 80);

        // Only update if position changed significantly (reduces unnecessary renders)
        if (Math.abs(newPosition - lastPosition) > 0.1) {
          lastPosition = newPosition;
          setSplitPosition(newPosition);
          localStorage.setItem(SPLIT_POSITION_KEY, newPosition.toString());
        }

        animationFrameId = null;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      isDragging.current = false;
      document.body.style.cursor = 'default';
      setIsResizing(false);

      // Cancel any pending animation frame
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('touchcancel', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('touchcancel', handleEnd);

      // Clean up any remaining animation frame
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [splitPosition]);

  return {
    // State
    splitPosition,
    splitRef,
    isDragging,
    isResizing,

    // Setters
    setIsResizing,
  };
};
