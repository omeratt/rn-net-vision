import { useState, useRef, useEffect, useCallback } from 'preact/hooks';
import type { NetVisionLog } from '../types';

export const useLogSelection = (sortedLogs: NetVisionLog[]) => {
  const [selectedLog, setSelectedLog] = useState<NetVisionLog | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset selection when sorted logs change
  useEffect(() => {
    if (sortedLogs.length === 0) {
      setSelectedLog(null);
      setSelectedIndex(-1);
    } else if (selectedIndex >= sortedLogs.length || selectedIndex < 0) {
      // Don't auto-select when sorting to prevent unwanted scrolling
      if (!isSorting) {
        // If current selection is out of bounds, reset to first item
        setSelectedIndex(0);
        setSelectedLog(sortedLogs[0]);
      }
    } else {
      // Update selectedLog to match current index in case logs array changed
      setSelectedLog(sortedLogs[selectedIndex]);
    }
  }, [sortedLogs, selectedIndex, isSorting]);

  // Keyboard navigation handler with refs to prevent re-registration
  const sortedLogsRef = useRef(sortedLogs);
  const selectedIndexRef = useRef(selectedIndex);

  // Update refs when values change
  useEffect(() => {
    sortedLogsRef.current = sortedLogs;
  }, [sortedLogs]);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  // Cleanup refs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      sortedLogsRef.current = [];
      selectedIndexRef.current = -1;
    };
  }, []);

  // Set up keyboard event listener with AbortController
  useEffect(() => {
    const abortController = new AbortController();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard events if the container or its children have focus
      const container = containerRef.current;
      if (!container || !container.contains(document.activeElement)) return;

      const currentSortedLogs = sortedLogsRef.current;
      const currentSelectedIndex = selectedIndexRef.current;

      if (currentSortedLogs.length === 0) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newIndex =
          currentSelectedIndex <= 0
            ? currentSortedLogs.length - 1
            : currentSelectedIndex - 1;
        setSelectedIndex(newIndex);
        setSelectedLog(currentSortedLogs[newIndex]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newIndex =
          currentSelectedIndex >= currentSortedLogs.length - 1
            ? 0
            : currentSelectedIndex + 1;
        setSelectedIndex(newIndex);
        setSelectedLog(currentSortedLogs[newIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown, {
      signal: abortController.signal,
      passive: false,
    });

    return () => {
      abortController.abort();
    };
  }, []); // No dependencies - refs provide latest values

  // Focus the container when component mounts or when there are logs to enable keyboard navigation
  // But don't steal focus if something else (like an input) is already focused
  useEffect(() => {
    if (
      sortedLogs.length > 0 &&
      containerRef.current &&
      !document.activeElement?.matches('input, textarea, select')
    ) {
      containerRef.current.focus();
    }
  }, [sortedLogs.length]);

  // Handlers
  const handleSelectLog = useCallback(
    (log: NetVisionLog, visualIndex: number) => {
      setSelectedLog(log);
      setSelectedIndex(visualIndex);
      // Only focus the container if no input is currently focused
      if (!document.activeElement?.matches('input, textarea, select')) {
        containerRef.current?.focus();
      }
    },
    []
  );

  const handleClearSelection = useCallback(() => {
    setIsSorting(true);
    setSelectedLog(null);
    setSelectedIndex(-1);
    // Reset sorting flag after a brief delay
    setTimeout(() => setIsSorting(false), 100);
  }, []);

  return {
    // State
    selectedLog,
    selectedIndex,
    containerRef,

    // Handlers
    handleSelectLog,
    handleClearSelection,
  };
};
