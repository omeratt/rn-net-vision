/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { motion } from 'framer-motion';
import { KeyboardShortcut } from '../atoms/KeyboardShortcut';
import { LoaderSpinner } from '../atoms/LoaderSpinner';

/**
 * SearchInput using your EXACT POC approach - no modifications
 * Just adapted for molecule props
 */

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onFocus: () => void;
  onBlur: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const SearchInput = ({
  value,
  onChange,
  isOpen,
  onFocus,
  onBlur,
  placeholder = 'Search logs...',
  isLoading = false,
}: SearchInputProps): VNode => {
  const inputRef = useRef<HTMLInputElement>(null);
  const compactInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Get initial position for smooth animation - defined early for state initialization
  const getInitialPosition = useCallback(() => {
    if (compactInputRef.current) {
      const rect = compactInputRef.current.getBoundingClientRect();
      // Only use the rect if it has valid dimensions
      if (rect.width > 0 && rect.height > 0) {
        return {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          x: 0,
          scale: 1,
        };
      }
    }

    // Fallback: calculate approximate position based on typical layout
    // This is a safer fallback than 0,0
    return {
      left: window.innerWidth / 2 - 160, // Center minus half width (320px / 2)
      top: 80, // Approximate header height
      width: 320, // w-60 sm:w-80 translates to about 320px
      height: 56, // py-4 with text translates to about 56px
      x: 0,
      scale: 1,
    };
  }, []);

  // Calculate target position in pixels for smooth animation
  const getTargetPosition = useCallback(() => {
    const targetWidth = Math.min(Math.max(320, window.innerWidth * 0.6), 752); // clamp(20rem, 60%, 47rem)
    return {
      left: window.innerWidth / 2,
      top: 64, // 4rem = 64px
      width: targetWidth,
      height: 56, // 3.5rem = 56px
      x: -targetWidth / 2, // Center offset based on actual width
      scale: 1,
      fontSize: '16px', // text-base = 16px for expanded state
      paddingLeft: '24px', // px-6 = 24px for expanded state
      paddingRight: '24px',
      paddingTop: '16px', // Calculated for 56px height
      paddingBottom: '16px',
    };
  }, []);

  // State to manage portal rendering and animations
  const [shouldRenderPortal, setShouldRenderPortal] = useState(false);
  const [initialPosition, setInitialPosition] = useState(() =>
    getInitialPosition()
  );

  // Update CSS vars each animation frame while active - improved masking for rounded corners
  const updateMaskVars = useCallback(() => {
    if (!isOpen || !inputRef.current || !overlayRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      return;
    }
    const rect = inputRef.current.getBoundingClientRect();
    // Use rounded rectangle for mask to match input's border-radius
    const borderRadius = 12; // rounded-xl = 12px
    overlayRef.current.style.setProperty('--mx', `${rect.left}px`);
    overlayRef.current.style.setProperty('--my', `${rect.top}px`);
    overlayRef.current.style.setProperty('--mw', `${rect.width}px`);
    overlayRef.current.style.setProperty('--mh', `${rect.height}px`);
    overlayRef.current.style.setProperty('--mr', `${borderRadius}px`);
    animationFrameRef.current = requestAnimationFrame(updateMaskVars);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Measure the compact input position right before animation
      const updatePosition = () => {
        if (compactInputRef.current) {
          const rect = compactInputRef.current.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            setInitialPosition({
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
              x: 0,
              scale: 1,
            });
          }
        }
      };

      // Update position on the next frame to ensure DOM is ready
      requestAnimationFrame(updatePosition);

      // Render portal immediately when opening
      setShouldRenderPortal(true);
      // Small delay to ensure DOM layout is complete before starting animation
      setTimeout(() => {
        updateMaskVars();
      }, 10);
    } else {
      // Update position for closing animation - force compact input to final state first
      const updateClosingPosition = () => {
        if (compactInputRef.current) {
          // Get the natural rect without any forced changes
          const rect = compactInputRef.current.getBoundingClientRect();

          if (rect.width > 0 && rect.height > 0) {
            setInitialPosition({
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
              x: 0,
              scale: 1,
            });
          }
        }
      };

      // Clean up animation frame when closing - IMMEDIATELY stop mask updates
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }

      // Wait for next frame to ensure proper measurement
      requestAnimationFrame(updateClosingPosition);

      // Keep portal rendered during closing animation
      // Remove it after coordinated opacity transitions complete
      const timer = setTimeout(() => {
        setShouldRenderPortal(false);
      }, 520); // 350ms position + 200ms delay + 300ms opacity = ~520ms

      // Clean up animation frame when closing
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }

      return () => clearTimeout(timer);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, updateMaskVars]);

  const close = useCallback(() => {
    onBlur();
  }, [onBlur]);

  const handleKeyboardShortcut = useCallback(() => {
    if (!isOpen) {
      onFocus();
      // Immediate focus without delay for better UX
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, onFocus]);

  // Compact input - stays in normal flow
  const compactInput = (
    <motion.input
      ref={compactInputRef}
      type="text"
      placeholder={placeholder}
      value=""
      readOnly
      className="w-60 sm:w-lg px-4 py-4 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 placeholder-gray-500 dark:placeholder-gray-400 shadow-lg focus:outline-none transition-all duration-300 ease-out focus:border-indigo-500 dark:focus:border-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-xl cursor-text"
      animate={{
        opacity: isOpen ? 0 : 1,
        // scale: isOpen ? 0.95 : 1, // Temporarily remove scale to test
      }}
      transition={{
        duration: 0.5, // Slower, more luxurious timing
        ease: [0.25, 0.1, 0.25, 1], // Ultra-smooth easeInOutExpo curve
        // Animate opacity of compact input to coordinate with expanded input
        opacity: {
          duration: isOpen ? 0.2 : 0.5, // Slower fade in for smoothness
          delay: isOpen ? 0 : 0.3, // Slightly longer wait for better coordination
          ease: [0.25, 0.1, 0.25, 1], // Same ultra-smooth easing
        },
      }}
      onClick={() => {
        onFocus();
        setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
      }}
    />
  );

  // Expanded input - portal rendered with manual layoutId simulation
  const expandedInput = (
    <div className="relative">
      <motion.input
        key="expanded-input"
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        autoFocus
        className="fixed z-50 px-6 text-base rounded-xl border border-gray-300/60 dark:border-gray-600/60 focus:border-indigo-300 dark:focus:border-indigo-500 bg-white/95 dark:bg-gray-800/95 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
        initial={initialPosition}
        animate={
          isOpen
            ? getTargetPosition()
            : {
                ...initialPosition,
                opacity: 0.6,
                fontSize: '14px', // Match compact input's text-sm (14px)
                paddingLeft: '16px', // Match compact input's px-4 (16px)
                paddingRight: '16px',
                paddingTop: '16px', // Match compact input's py-4 (16px)
                paddingBottom: '16px', // Match compact input's py-4 (16px)
              }
        }
        transition={{
          duration: 0.5, // Slower, more luxurious timing
          ease: [0.25, 0.1, 0.25, 1], // Ultra-smooth easeInOutExpo curve
          // Coordinate opacity fade with compact input appearance
          opacity: {
            duration: isOpen ? 0.6 : 0.15, // Slower fade in, still quick fade out
            delay: isOpen ? 0 : 0, // No delay when closing
            ease: [0.25, 0.1, 0.25, 1], // Same ultra-smooth easing
          },
        }}
        onBlur={() => {
          // Delay blur slightly to allow for overlay clicks
          setTimeout(() => {
            if (document.activeElement !== inputRef.current) {
              close();
            }
          }, 100);
        }}
      />
      {/* Loading spinner positioned relative to the input */}
      {isOpen && isLoading && (
        <div
          className="fixed z-[55] pointer-events-none transition-all duration-500 ease-out"
          style={
            {
              left: `${getTargetPosition().left + getTargetPosition().x + getTargetPosition().width - 38}px`,
              top: `${getTargetPosition().top + 16}px`,
            } as any
          }
        >
          <LoaderSpinner size="md" />
        </div>
      )}
    </div>
  );

  // Blur overlay - Enhanced with smoother transitions and proper rounded cutout
  const overlay = (
    <>
      {/* Main backdrop blur */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{
          opacity: isOpen ? 1 : 0,
          backdropFilter: isOpen ? 'blur(12px)' : 'blur(0px)',
        }}
        transition={{
          duration: 0.5, // Slower, more luxurious timing
          ease: [0.25, 0.1, 0.25, 1], // Ultra-smooth easeInOutExpo curve
          backdropFilter: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        }}
        className="fixed inset-0 z-40 bg-black/20"
        onClick={close}
        aria-hidden="true"
      />

      {/* Clear cutout area around input */}
      <motion.div
        key="cutout"
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{
          duration: isOpen ? 0.5 : 0.1, // Disappear quickly when closing
          ease: [0.25, 0.1, 0.25, 1],
          delay: isOpen ? 0 : 0, // No delay - disappear immediately
        }}
        className="fixed z-[45] pointer-events-none"
        style={
          {
            left: 'var(--mx)',
            top: 'var(--my)',
            width: 'var(--mw)',
            height: 'var(--mh)',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(0px)',
            borderRadius: 'var(--mr)',
            boxShadow: '0 0 0 2000px rgba(0, 0, 0, 0.2)',
          } as any
        }
      />
    </>
  );

  return (
    <div className="relative flex items-center">
      {/* Keyboard shortcut overlay */}
      <div
        className="absolute right-2 pointer-events-auto transition-opacity duration-200 ease-out"
        style={
          {
            opacity: isOpen ? 0 : 1,
            transitionDelay: isOpen ? '0s' : '0.8s', // Wait longer for the slower animation
          } as any
        }
      >
        <KeyboardShortcut
          onShortcut={handleKeyboardShortcut}
          visible={true} // Always visible, opacity controlled by wrapper div
          enabled={!isOpen} // Only enabled when search is closed
        />
      </div>

      {/* Compact input in normal flow - always rendered for smooth animation */}
      {compactInput}

      {/* Portal rendered overlay and expanded input with proper lifecycle */}
      {shouldRenderPortal &&
        createPortal(
          <>
            {overlay}
            {expandedInput}
          </>,
          document.body
        )}
    </div>
  );
};
