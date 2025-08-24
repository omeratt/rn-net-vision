/**
 * Hook to smoothly animate a container's width when its contents change size.
 */
import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { MotionProps } from 'framer-motion';

export const useAnimatedAutoWidth = (
  deps: unknown[]
): {
  ref: preact.RefObject<HTMLDivElement>;
  width: number | null;
  animateProps: {
    animate?: MotionProps['animate'];
    transition?: MotionProps['transition'];
  };
} => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  const hasMeasuredRef = useRef(false);
  const widthRef = useRef<number | null>(null);

  // keep a shadow ref
  useLayoutEffect(() => {
    widthRef.current = width;
  }, [width]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!hasMeasuredRef.current) {
      const w = el.getBoundingClientRect().width;
      setWidth(w);
      widthRef.current = w;
      hasMeasuredRef.current = true;
      return;
    }
    const previousWidth = widthRef.current;
    if (previousWidth == null) return;
    const prevStyleWidth = el.style.width;
    el.style.width = 'auto';
    const targetWidth = el.getBoundingClientRect().width;
    el.style.width = prevStyleWidth || previousWidth + 'px';
    el.getBoundingClientRect(); // force reflow
    if (Math.abs(targetWidth - previousWidth) > 0.5) {
      setWidth(targetWidth);
      widthRef.current = targetWidth;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const animate =
    width != null && hasMeasuredRef.current ? { width } : undefined;

  return {
    ref: containerRef,
    width,
    animateProps: {
      animate,
      transition: { type: 'spring', stiffness: 470, damping: 38, mass: 0.42 },
    },
  } as const;
};
