import { useCallback } from 'preact/hooks';
import type { RefObject } from 'preact';

interface UseNetworkLogsRefsProps {
  selectionContainerRef?: { current: HTMLDivElement | null };
  logContainerRef?: RefObject<HTMLDivElement>;
}

/**
 * Hook for managing NetworkLogs container references
 * Handles setting up refs for both selection and external log container
 */
export const useNetworkLogsRefs = ({
  selectionContainerRef,
  logContainerRef,
}: UseNetworkLogsRefsProps) => {
  // Create a ref callback that sets both the selection ref and the external ref
  const setContainerRef = useCallback(
    (element: HTMLDivElement | null) => {
      // Set the selection hook's ref
      if (selectionContainerRef) {
        selectionContainerRef.current = element;
      }
      // Set the external ref for focus restoration after search
      if (logContainerRef) {
        logContainerRef.current = element;
      }
    },
    [selectionContainerRef, logContainerRef]
  );

  return {
    setContainerRef,
  };
};
