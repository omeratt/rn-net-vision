/** @jsxImportSource preact */
import type { VNode, ComponentChildren } from 'preact';
import { motion } from 'framer-motion';
import { useScrollToSelected } from '../../hooks/useScrollToSelected';
import { getContainerClasses } from '../../utils/styleUtils';

interface NetworkLogContainerProps {
  isSelected: boolean;
  isHighlighted?: boolean;
  highlightState?: 'idle' | 'blinking' | 'fading';
  onClick?: () => void;
  children: ComponentChildren;
  isExiting?: boolean;
}

export const NetworkLogContainer = ({
  isSelected,
  isHighlighted = false,
  highlightState = 'idle',
  onClick,
  children,
  isExiting = false,
}: NetworkLogContainerProps): VNode => {
  const containerRef = useScrollToSelected({ isSelected });
  const containerClasses = getContainerClasses(isSelected);

  // Base highlight styles for smooth animations with enhanced glow
  const baseHighlightStyles = isHighlighted
    ? 'ring-2 ring-yellow-400/70 dark:ring-yellow-500/70 bg-yellow-50/90 dark:bg-yellow-900/30 shadow-lg shadow-yellow-500/25 isolate z-10'
    : '';

  const exitShadowInline = isExiting
    ? {
        boxShadow:
          '0 0 0 1px rgba(220,38,38,0.45), 0 3px 8px -1px rgba(220,38,38,0.35), 0 6px 16px -2px rgba(220,38,38,0.28)',
      }
    : undefined;

  // Enhanced glow effect during blinking - subtle and elegant
  const getAnimatedStyles = () => {
    if (!isHighlighted || highlightState !== 'blinking') return {};
    return {
      boxShadow:
        '0 0 8px rgba(234, 179, 8, 0.2), 0 0 16px rgba(234, 179, 8, 0.1)',
    };
  };

  // Framer Motion variants for ultra-smooth highlighting animations
  const highlightVariants = {
    idle: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94], // Ultra-smooth easing from PRD
      },
    },
    blinking: {
      opacity: [1, 0.6, 1],
      scale: [1, 1.003, 1],
      transition: {
        duration: 1.0, // Calmer, more professional timing
        ease: [0.25, 0.46, 0.45, 0.94], // Back to smooth, elegant easing
        repeat: Infinity,
        repeatType: 'loop' as const,
      },
    },
    fading: {
      opacity: 0.85,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: [0.25, 0.1, 0.25, 1], // Smooth fade out easing
      },
    },
  };

  // Create the motion component using motion.div with proper type casting
  const MotionWrapper = motion.div as any;

  return (
    <MotionWrapper
      ref={containerRef}
      onClick={onClick}
      className={`${containerClasses} ${baseHighlightStyles} p-2 sm:p-4 transition-all duration-300 relative contain-layout`}
      style={{ ...getAnimatedStyles(), ...exitShadowInline }}
      variants={highlightVariants}
      animate={isHighlighted ? highlightState : 'idle'}
      initial="idle"
    >
      <div className="flex flex-col space-y-2 relative z-20 w-full overflow-hidden">
        {children}
      </div>
    </MotionWrapper>
  );
};
