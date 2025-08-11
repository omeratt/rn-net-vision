import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import type { NetVisionLog } from '../types';
import {
  addLog,
  getRecentLogs,
  clearAllLogs,
  clearDeviceLogs,
  migrateFromLocalStorage,
} from '../utils/logsDb';
import { useDevices } from '../context/DeviceContext';
import { UI_MAX_LOGS } from '../utils/logsConfig';

// Generate unique ID for each incoming log using Web Crypto API
const generateLogId = (): string => {
  return crypto.randomUUID();
};

export const useWebSocket = () => {
  const [logs, setLogs] = useState<NetVisionLog[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { addDevice, updateDeviceStatus } = useDevices();
  const socketRef = useRef<WebSocket | null>(null);
  const isConnectingRef = useRef(false);
  const addDeviceRef = useRef(addDevice);
  const updateDeviceStatusRef = useRef(updateDeviceStatus);

  // Update refs when functions change
  useEffect(() => {
    addDeviceRef.current = addDevice;
    updateDeviceStatusRef.current = updateDeviceStatus;
  }, [addDevice, updateDeviceStatus]);

  // Initial load & migration
  useEffect(() => {
    (async () => {
      // Migrate legacy localStorage logs one time
      await migrateFromLocalStorage();
      const recent = await getRecentLogs(UI_MAX_LOGS);
      setLogs(recent);
    })();
  }, []);

  const clearLogs = useCallback((deviceId?: string | null) => {
    if (!deviceId) {
      (async () => {
        await clearAllLogs();
        setLogs([]);
      })();
    } else {
      (async () => {
        await clearDeviceLogs(deviceId);
        setLogs((prev) => prev.filter((l) => l.deviceId !== deviceId));
      })();
    }
  }, []);

  // Use a ref to store the connect function to avoid dependency issues
  const connectRef = useRef<() => () => void>();

  connectRef.current = () => {
    // Prevent multiple connections
    if (
      isConnectingRef.current ||
      (socketRef.current && socketRef.current.readyState === WebSocket.OPEN)
    ) {
      console.log(
        '[WebSocket] Connection already exists or in progress, skipping'
      );
      return () => {};
    }

    isConnectingRef.current = true;
    console.log('[WebSocket] Attempting to connect to ws://localhost:8088');
    console.log(
      '%c[WebSocket] CONNECTING...',
      'background: orange; color: white; padding: 2px 5px;'
    );
    const socket = new WebSocket('ws://localhost:8088');
    socketRef.current = socket;

    socket.addEventListener('open', () => {
      isConnectingRef.current = false;
      setIsConnected(true);
      console.log('[WebSocket] Connection established');
      console.log(
        '%c[WebSocket] CONNECTED SUCCESSFULLY!',
        'background: green; color: white; padding: 2px 5px;'
      );

      // TEMPORARILY DISABLED: Reset device state on reconnection
      console.log(
        '[WebSocket] Skipping device clearing to preserve test device'
      );
      // clearDevices();

      // Send vite-ready if this is the viewer
      socket.send(JSON.stringify({ type: 'vite-ready' }));
      console.log('[WebSocket] Sent vite-ready message to server');
      console.log(
        '%c[WebSocket] VITE-READY SENT - Server should now forward device messages',
        'background: cyan; color: black; padding: 2px 5px;'
      );

      // Request devices list as a fallback mechanism
      setTimeout(() => {
        if (socket.readyState === WebSocket.OPEN) {
          console.log('[WebSocket] Requesting devices list from server...');
          socket.send(JSON.stringify({ type: 'get-devices' }));
          console.log(
            '%c[WebSocket] GET-DEVICES SENT - Waiting for devices-list response...',
            'background: yellow; color: black; padding: 2px 5px;'
          );
        }
      }, 2000); // Increased delay to ensure server processes vite-ready first
    });

    socket.addEventListener('message', (event) => {
      console.log(
        '%c[WebSocket] MESSAGE RECEIVED!',
        'background: purple; color: white; padding: 2px 5px; font-size: 14px;',
        event.data
      );
      console.log('[WebSocket] Raw message received:', event.data);
      try {
        const data = JSON.parse(event.data);
        console.log(
          '%c[WebSocket] PARSED MESSAGE:',
          'background: blue; color: white; padding: 2px 5px;',
          data
        );
        console.log('[WebSocket] Parsed message:', data);
        switch (data.type) {
          case 'network-log':
            // Generate unique ID for each incoming log
            const logWithId: NetVisionLog = {
              ...data,
              id: generateLogId(),
            };

            if (logWithId.deviceId) {
              console.log(
                '[DeviceDebug] Network log with device info:',
                logWithId.deviceId,
                logWithId.deviceName,
                logWithId.devicePlatform
              );
              // Register or update device connection from network log
              addDeviceRef.current({
                id: logWithId.deviceId,
                name:
                  logWithId.deviceName ||
                  `${logWithId.devicePlatform || 'Unknown'}-Device-${logWithId.deviceId.substring(0, 6)}`,
                platform: logWithId.devicePlatform || 'android',
                connected: true,
              });
            }

            // Add logs with generated IDs
            // Persist asynchronously
            addLog(logWithId).then(async () => {
              // Update in-memory list (append then trim for UI limit)
              setLogs((prev) => {
                const updated = [...prev, logWithId];
                if (UI_MAX_LOGS > 0 && updated.length > UI_MAX_LOGS) {
                  return updated.slice(-UI_MAX_LOGS);
                }
                return updated;
              });
            });
            break;

          case 'device-connected':
            console.log(
              '%c[DEVICE-CONNECTED] RECEIVED!',
              'background: red; color: white; padding: 3px 6px; font-size: 16px;'
            );
            if (data.deviceId) {
              console.log(
                '[DeviceDebug] Received device-connected event:',
                data
              );
              console.log(
                '%c[DeviceDebug] ADDING REAL DEVICE FROM SIMULATOR:',
                'background: green; color: white; padding: 2px 5px;',
                {
                  id: data.deviceId,
                  name: data.deviceName,
                  platform: data.devicePlatform,
                }
              );
              addDeviceRef.current({
                id: data.deviceId,
                name:
                  data.deviceName ||
                  `${data.devicePlatform || 'Unknown'}-${data.deviceId.substring(0, 6)}`,
                platform: data.devicePlatform || 'android',
                connected: true,
              });
              console.log(
                '[DeviceDebug] Added/updated device via device-connected event'
              );
            }
            break;

          case 'device-disconnected':
            if (data.deviceId) {
              console.log('[DeviceDebug] Device disconnected:', data.deviceId);
              updateDeviceStatusRef.current(data.deviceId, false);
            }
            break;

          case 'devices-list':
            // Bulk update of devices list from server
            console.log('[DeviceDebug] Processing devices-list message:', data);
            console.log('[DeviceDebug] data.devices:', data.devices);
            console.log(
              '[DeviceDebug] Array.isArray(data.devices):',
              Array.isArray(data.devices)
            );

            if (Array.isArray(data.devices)) {
              console.log(
                '[DeviceDebug] Received devices list from server:',
                JSON.stringify(data.devices)
              );

              // DON'T clear devices - instead add server devices alongside test devices
              console.log(
                '[DeviceDebug] Adding server devices alongside existing devices...'
              );

              // Add all devices from the server
              console.log('[DeviceDebug] Adding devices from server list...');
              data.devices.forEach((device: any, index: number) => {
                console.log(
                  `[DeviceDebug] Processing server device ${index}:`,
                  device
                );
                if (device && device.id) {
                  console.log('[DeviceDebug] Adding server device:', device);
                  const deviceToAdd = {
                    id: device.id,
                    name: device.name || `Unknown-${device.id.substring(0, 6)}`,
                    platform: device.platform || 'android',
                    connected: true,
                  };
                  console.log(
                    '[DeviceDebug] Server device object to add:',
                    deviceToAdd
                  );
                  addDeviceRef.current(deviceToAdd);
                  console.log('[DeviceDebug] Server device added successfully');
                } else {
                  console.log('[DeviceDebug] Skipping invalid device:', device);
                }
              });
              console.log(
                '[DeviceDebug] Finished processing server devices list'
              );
            } else {
              console.log(
                '[DeviceDebug] Received empty or invalid devices list, data.devices:',
                data.devices,
                typeof data.devices
              );
            }
            break;

          default:
            console.log(
              '[WebSocket] Received unknown message type:',
              data.type
            );
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    });

    socket.addEventListener('close', () => {
      setIsConnected(false);
      isConnectingRef.current = false;
      socketRef.current = null;
      setTimeout(() => {
        if (connectRef.current) {
          connectRef.current();
        }
      }, 1000);
    });

    socket.addEventListener('error', () => {
      isConnectingRef.current = false;
      socketRef.current = null;
      socket.close();
    });

    return () => {
      isConnectingRef.current = false;
      socketRef.current = null;
      socket.close();
    };
  };

  useEffect(() => {
    if (connectRef.current) {
      const cleanup = connectRef.current();
      return cleanup;
    }
  }, []); // Connect only once on mount

  return {
    logs,
    clearLogs,
    isConnected,
  };
};
