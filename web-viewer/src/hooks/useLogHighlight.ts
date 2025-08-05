import { useState, useCallback } from 'preact/hooks';

type HighlightState = 'idle' | 'blinking' | 'fading';

interface HighlightInfo {
  logId: string;
  state: HighlightState;
}

/**
 * Hook for managing log highlighting state with smooth blinking animation
 * Used for highlighting selected logs from global search
 */
export const useLogHighlight = () => {
  const [highlightInfo, setHighlightInfo] = useState<HighlightInfo | null>(
    null
  );

  const setHighlight = useCallback((logId: string) => {
    // Clear any existing highlight first
    setHighlightInfo(null);

    // Start with blinking animation
    setTimeout(() => {
      setHighlightInfo({ logId, state: 'blinking' });
    }, 10);

    // After 2 seconds of blinking, transition to fading
    setTimeout(() => {
      setHighlightInfo((prev) =>
        prev && prev.logId === logId ? { logId, state: 'fading' } : null
      );
    }, 2000);

    // Remove highlight after fade completes
    setTimeout(() => {
      setHighlightInfo((prev) => (prev && prev.logId === logId ? null : prev));
    }, 3500);
  }, []);

  const clearHighlight = useCallback(() => {
    setHighlightInfo(null);
  }, []);

  return {
    highlightedLogId: highlightInfo?.logId || null,
    highlightState: highlightInfo?.state || 'idle',
    setHighlight,
    clearHighlight,
  };
};
