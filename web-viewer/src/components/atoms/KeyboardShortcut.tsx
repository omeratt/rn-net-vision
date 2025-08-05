/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

interface KeyboardShortcutProps {
  onShortcut: () => void;
  enabled?: boolean;
  visible?: boolean;
}

export const KeyboardShortcut = ({
  onShortcut,
  enabled = true,
  visible = true,
}: KeyboardShortcutProps): VNode | null => {
  // Detect platform for correct modifier key display
  const isMac = (() => {
    if (typeof navigator === 'undefined') return false;

    // Modern approach using userAgentData (when available)
    if ('userAgentData' in navigator && navigator.userAgentData) {
      const userAgentData = navigator.userAgentData as any;
      if (userAgentData.platform) {
        return userAgentData.platform === 'macOS';
      }
    }

    // Fallback to userAgent
    return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  })();
  const modifierKey = isMac ? '⌘' : 'Ctrl';

  // Use refs to store the latest values to avoid re-registering listeners
  const onShortcutRef = useRef(onShortcut);
  const enabledRef = useRef(enabled);

  // Update refs when props change
  useEffect(() => {
    onShortcutRef.current = onShortcut;
  }, [onShortcut]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  // Cleanup refs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      onShortcutRef.current = () => {}; // Clear ref to prevent memory leaks
      enabledRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Use AbortController for more reliable cleanup
    const abortController = new AbortController();

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check enabled state at runtime instead of during registration
      if (!enabledRef.current) return;

      // CMD/CTRL + K
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        event.stopImmediatePropagation(); // Prevent other handlers from firing

        // Add safety check before calling
        if (
          onShortcutRef.current &&
          typeof onShortcutRef.current === 'function'
        ) {
          onShortcutRef.current();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, {
      signal: abortController.signal,
      capture: true, // Use capture phase to ensure we get the event first
      passive: false, // We need to preventDefault
    });

    // Cleanup function
    return () => {
      abortController.abort();
    };
  }, []); // No dependencies - listener is registered once and stays

  // Only display the shortcut hint if visible is true
  if (!visible) {
    return null;
  }

  return (
    <div className="flex items-center gap-0.5">
      <kbd className="flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-700/80 border border-gray-200/60 dark:border-gray-600/60 rounded-md shadow-sm backdrop-blur-sm h-7 px-2 min-w-[28px]">
        <span
          className={`font-semibold leading-none font-mono ${isMac ? 'text-xl' : 'text-xs'}`}
        >
          {modifierKey}
        </span>
      </kbd>
      <kbd className="w-7 h-7 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-700/80 border border-gray-200/60 dark:border-gray-600/60 rounded-md shadow-sm backdrop-blur-sm">
        <span className="text-sm font-semibold leading-none font-mono">K</span>
      </kbd>
    </div>
  );
};
