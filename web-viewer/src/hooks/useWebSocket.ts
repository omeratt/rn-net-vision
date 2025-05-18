import { useState, useEffect, useCallback } from 'preact/hooks';
import type { NetVisionLog } from '../types';
import { getLocalStorageLogs, LOGS_STORAGE_KEY } from '../utils/networkUtils';

export const useWebSocket = () => {
  const [logs, setLogs] = useState<NetVisionLog[]>(getLocalStorageLogs());

  const [isConnected, setIsConnected] = useState(false);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  const clearLogs = useCallback(() => {
    setLogs([]);
    localStorage.removeItem(LOGS_STORAGE_KEY);
  }, []);

  const connect = useCallback(() => {
    const socket = new WebSocket('ws://localhost:8088');

    socket.addEventListener('open', () => {
      setIsConnected(true);

      console.log('WebSocket connection established');

      socket.send(JSON.stringify({ type: 'vite-ready' }));
    });

    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'network-log':
            setLogs((prevLogs) => [...prevLogs, data]);
            break;
          case 'vite-reconnect':
            // Handle reconnection logic if needed
            break;
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
