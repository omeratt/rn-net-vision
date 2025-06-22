/** @jsxImportSource preact */
import { VNode, ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';

interface DropdownPortalProps {
  children: ComponentChildren;
  isOpen: boolean;
  anchorRef: { current: HTMLElement | null };
  onClose: () => void;
  className?: string;
}

export const DropdownPortal = ({
  children,
  isOpen,
  anchorRef,
  onClose,
  className = '',
}: DropdownPortalProps): VNode | null => {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Update position when opened
  useEffect(() => {
    if (isOpen && anchorRef.current) {
      console.log('🔵 DropdownPortal: Opening dropdown');
      setShouldRender(true);

      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
      // Start animation with slight delay to ensure DOM update
      setTimeout(() => {
        console.log('🟢 DropdownPortal: Starting animation');
        setIsAnimating(true);
      }, 50);
    } else if (!isOpen && shouldRender) {
      console.log('🔴 DropdownPortal: Closing dropdown');
      // Start exit animation
      setIsAnimating(false);
      // Remove from DOM after transition completes
      setTimeout(() => {
        setShouldRender(false);
        setPosition(null);
      }, 300); // Match transition duration
    }
  }, [isOpen, anchorRef, shouldRender]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.dropdown-portal-content')
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose, anchorRef]);

  if (!shouldRender || !position) {
    return null;
  }

  const portalContent = (
    <div
      className={`dropdown-portal-content fixed z-ultra-high transition-all duration-300 ease-out ${className} ${
        isAnimating
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-3 scale-95'
      }`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        minWidth: `${position.width}px`,
      }}
      data-debug={`dropdown-${isAnimating ? 'in' : 'out'}`}
    >
      {children}
    </div>
  );

  return createPortal(portalContent, document.body);
};
