/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import type { NetVisionLog } from '../../types';
import { NetworkLogList } from './NetworkLogList';
import { LogDetailsPanel } from '../molecules/LogDetailsPanel';
import { useCallback } from 'react';
import { SplitHandle } from '../atoms/SplitHandle';
import { useDevices } from '../../context/DeviceContext';
import { useFilteredLogs } from '../../hooks/useFilteredLogs';

const SPLIT_POSITION_KEY = 'netvision-split-position';

interface NetworkLogsProps {
  logs: NetVisionLog[];
  onClear: (deviceId?: string | null) => void;
}

export const NetworkLogs = ({ logs, onClear }: NetworkLogsProps): VNode => {
  const { activeDeviceId } = useDevices();

  // Use the filtered logs hook for device filtering
  const filteredLogs = useFilteredLogs(logs, activeDeviceId);

  // Create a device-aware clear function
  const handleClear = useCallback(() => {
    onClear(activeDeviceId);
  }, [onClear, activeDeviceId]);

  const [selectedLog, setSelectedLog] = useState<NetVisionLog | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [sortedLogs, setSortedLogs] = useState<NetVisionLog[]>([]);
  const [splitPosition, setSplitPosition] = useState<number>(() => {
    const savedPosition = localStorage.getItem(SPLIT_POSITION_KEY);
    return savedPosition ? parseFloat(savedPosition) : 50;
  });
  const splitRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const [isResizing, setIsResizing] = useState(false);

  // Reset selection when sorted logs change
  useEffect(() => {
    if (sortedLogs.length === 0) {
      setSelectedLog(null);
      setSelectedIndex(-1);
    } else if (selectedIndex >= sortedLogs.length || selectedIndex < 0) {
      // If current selection is out of bounds, reset to first item
      setSelectedIndex(0);
      setSelectedLog(sortedLogs[0]);
    } else {
      // Update selectedLog to match current index in case logs array changed
      setSelectedLog(sortedLogs[selectedIndex]);
    }
  }, [sortedLogs, selectedIndex]);

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

  useEffect(() => {
    const handleKeyDownEvent = (e: KeyboardEvent) => handleKeyDown(e);
    document.addEventListener('keydown', handleKeyDownEvent);
    return () => document.removeEventListener('keydown', handleKeyDownEvent);
  }, [handleKeyDown]);

  // Create a stable callback for sorted logs changes
  const handleSortedLogsChange = useCallback(
    (newSortedLogs: NetVisionLog[]) => {
      setSortedLogs(newSortedLogs);
    },
    []
  );

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

  useEffect(() => {
    // Use requestAnimationFrame to optimize the animation performance
    let animationFrameId: number | null = null;
    let lastPosition = splitPosition;

    const handleMove = (clientX: number) => {
      if (!isDragging.current || !splitRef.current) return;

      // Cancel any pending animation frame
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      // Use requestAnimationFrame to smooth out the animation
      animationFrameId = requestAnimationFrame(() => {
        const containerRect =
          splitRef.current?.parentElement?.getBoundingClientRect();
        if (!containerRect) return;

        const position =
          ((clientX - containerRect.left) / containerRect.width) * 100;
        const newPosition = Math.min(Math.max(20, position), 80);

        // Only update if position changed significantly (reduces unnecessary renders)
        if (Math.abs(newPosition - lastPosition) > 0.1) {
          lastPosition = newPosition;
          setSplitPosition(newPosition);
          localStorage.setItem(SPLIT_POSITION_KEY, newPosition.toString());
        }

        animationFrameId = null;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      isDragging.current = false;
      document.body.style.cursor = 'default';
      setIsResizing(false);

      // Cancel any pending animation frame
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('touchcancel', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('touchcancel', handleEnd);

      // Clean up any remaining animation frame
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [splitPosition]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col sm:flex-row h-full overflow-hidden rounded-lg shadow-lg safe-area-container focus:outline-none"
      tabIndex={0}
    >
      <div
        style={{ width: `${splitPosition}%` }}
        className="h-[50vh] sm:h-auto sm:min-h-0 overflow-hidden bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm transition-[width] ease-out mobile-no-scroll-x"
      >
        <div className="p-2 sm:p-4 h-full overflow-y-auto">
          <NetworkLogList
            logs={filteredLogs}
            onClear={handleClear}
            onSelectLog={(log, visualIndex) => {
              setSelectedLog(log);
              setSelectedIndex(visualIndex);
              // Only focus the container if no input is currently focused
              if (!document.activeElement?.matches('input, textarea, select')) {
                containerRef.current?.focus();
              }
            }}
            selectedLog={selectedLog}
            onSortedLogsChange={handleSortedLogsChange}
          />
        </div>
      </div>

      <SplitHandle
        splitRef={splitRef}
        isDragging={isDragging}
        isResizing={isResizing}
        setIsResizing={setIsResizing}
      />

      <div
        style={{ width: `${100 - splitPosition}%` }}
        className="h-[50vh] sm:h-auto sm:min-h-0 overflow-hidden bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm transition-[width] ease-out mobile-no-scroll-x"
      >
        <LogDetailsPanel log={selectedLog} />
      </div>
    </div>
  );
};
