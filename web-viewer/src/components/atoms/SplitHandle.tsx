/** @jsxImportSource preact */
import { RefObject, VNode } from 'preact';
import { useCallback } from 'preact/hooks';

interface SplitHandleProps {
  splitRef: RefObject<HTMLDivElement>;
  isDragging: RefObject<boolean>;
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
}

export const SplitHandle = ({
  splitRef,
  isDragging,
  isResizing,
  setIsResizing,
}: SplitHandleProps): VNode => {
  const handleStart = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault(); // Prevent text selection during drag or scroll on touch
      isDragging.current = true;
      document.body.style.cursor = 'col-resize';
      setIsResizing(true);
    },
    [isDragging, setIsResizing]
  );

  return (
    <div
      ref={splitRef}
      className={`relative cursor-col-resize w-1 sm:w-1.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 hover:from-indigo-500 hover:to-purple-500 ${
        isResizing ? 'from-indigo-500 to-purple-500' : ''
      } transition-colors duration-75`}
      onMouseDown={handleStart as any}
      onTouchStart={handleStart as any}
    >
      <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 flex items-center pointer-events-none">
        <div className="h-12 w-1.5 rounded-full bg-purple-500/60 dark:bg-purple-400/60" />
      </div>
    </div>
  );
};
