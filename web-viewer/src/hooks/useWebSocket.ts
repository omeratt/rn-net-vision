import { useState, useEffect, useCallback } from 'preact/hooks';
import type { NetVisionLog } from '../types';

export const useWebSocket = () => {
  const [logs, setLogs] = useState<NetVisionLog[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const connect = useCallback(() => {
    const socket = new WebSocket('ws://localhost:8088');

    socket.addEventListener('open', () => {
      setIsConnected(true);
      socket.send(JSON.stringify({ type: 'vite-ready' }));
    });

    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'network-log') {
          setLogs((prevLogs) => [...prevLogs, data]);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    });

    socket.addEventListener('close', () => {
      setIsConnected(false);
      setTimeout(() => {
        connect();
      }, 1000);
    });

    socket.addEventListener('error', () => {
      socket.close();
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  return {
    logs,
    clearLogs,
    isConnected,
  };
};
