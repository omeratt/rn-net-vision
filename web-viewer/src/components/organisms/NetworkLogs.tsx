/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import type { NetVisionLog } from '../../types';
import { NetworkLogList } from './NetworkLogList';
import { LogDetailsPanel } from '../molecules/LogDetailsPanel';
import { useCallback } from 'react';

interface NetworkLogsProps {
  logs: NetVisionLog[];
  onClear: () => void;
}

export const NetworkLogs = ({ logs, onClear }: NetworkLogsProps): VNode => {
  const [selectedLog, setSelectedLog] = useState<NetVisionLog | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [splitPosition, setSplitPosition] = useState<number>(50);
  const splitRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (logs.length === 0) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const newIndex = prev <= 0 ? logs.length - 1 : prev - 1;
          setSelectedLog(logs[newIndex]);
          return newIndex;
        });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const newIndex = prev >= logs.length - 1 ? 0 : prev + 1;
          setSelectedLog(logs[newIndex]);
          return newIndex;
        });
      }
    },
    [logs]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [logs, handleKeyDown]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !splitRef.current) return;

      const containerRect =
        splitRef.current.parentElement?.getBoundingClientRect();
      if (!containerRect) return;

      const position =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setSplitPosition(Math.min(Math.max(20, position), 80));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div
        style={{ width: `${splitPosition}%` }}
        className="overflow-auto bg-gray-50 dark:bg-gray-900"
      >
        <div className="p-4">
          <NetworkLogList
            logs={logs}
            onClear={onClear}
            onSelectLog={(log, index) => {
              setSelectedLog(log);
              setSelectedIndex(index);
            }}
            selectedLog={selectedLog}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>

      <div
        ref={splitRef}
        className="w-1 cursor-col-resize bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors"
        onMouseDown={() => {
          isDragging.current = true;
          document.body.style.cursor = 'col-resize';
        }}
      />

      <div
        style={{ width: `${100 - splitPosition}%` }}
        className="overflow-auto bg-white dark:bg-gray-800"
      >
        <LogDetailsPanel log={selectedLog} />
      </div>
    </div>
  );
};
