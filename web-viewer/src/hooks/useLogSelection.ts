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

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Only handle keyboard events if the container or its children have focus
      const container = containerRef.current;
      if (!container || !container.contains(document.activeElement)) return;

      if (sortedLogs.length === 0) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newIndex =
          selectedIndex <= 0 ? sortedLogs.length - 1 : selectedIndex - 1;
        setSelectedIndex(newIndex);
        setSelectedLog(sortedLogs[newIndex]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newIndex =
          selectedIndex >= sortedLogs.length - 1 ? 0 : selectedIndex + 1;
        setSelectedIndex(newIndex);
        setSelectedLog(sortedLogs[newIndex]);
      }
    },
    [sortedLogs, selectedIndex]
  );

  // Set up keyboard event listener
  useEffect(() => {
    const handleKeyDownEvent = (e: KeyboardEvent) => handleKeyDown(e);
    document.addEventListener('keydown', handleKeyDownEvent);
    return () => document.removeEventListener('keydown', handleKeyDownEvent);
  }, [handleKeyDown]);

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
