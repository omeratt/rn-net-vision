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
  const [splitPosition, setSplitPosition] = useState<number>(() => {
    const savedPosition = localStorage.getItem(SPLIT_POSITION_KEY);
    return savedPosition ? parseFloat(savedPosition) : 50;
  });
  const splitRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const [isResizing, setIsResizing] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (filteredLogs.length === 0) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const newIndex = prev <= 0 ? filteredLogs.length - 1 : prev - 1;
          setSelectedLog(filteredLogs[newIndex]);
          return newIndex;
        });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const newIndex = prev >= filteredLogs.length - 1 ? 0 : prev + 1;
          setSelectedLog(filteredLogs[newIndex]);
          return newIndex;
        });
      }
    },
    [filteredLogs]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredLogs, handleKeyDown]);

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
    <div className="flex flex-col sm:flex-row h-[calc(100vh-5rem)] overflow-hidden rounded-lg shadow-lg">
      <div
        style={{ width: `${splitPosition}%` }}
        className="h-[50vh] sm:h-auto sm:min-h-0 overflow-auto bg-gray-50 dark:bg-gray-900 transition-[width] ease-out"
      >
        <div className="p-2 sm:p-4">
          <NetworkLogList
            logs={filteredLogs}
            onClear={handleClear}
            onSelectLog={(log, index) => {
              setSelectedLog(log);
              setSelectedIndex(index);
            }}
            selectedLog={selectedLog}
            selectedIndex={selectedIndex}
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
        className="h-[50vh] sm:h-auto sm:min-h-0 overflow-auto bg-white dark:bg-gray-800 transition-[width] ease-out"
      >
        <LogDetailsPanel log={selectedLog} />
      </div>
    </div>
  );
};
