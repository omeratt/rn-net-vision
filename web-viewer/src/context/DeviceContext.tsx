/** @jsxImportSource preact */
import { createContext } from 'preact';
import {
  useState,
  useEffect,
  useContext,
  useCallback,
  Dispatch,
} from 'preact/hooks';
import { StateUpdater } from 'preact/hooks';

export interface Device {
  id: string;
  name: string;
  platform: 'ios' | 'android';
  connected: boolean;
  lastSeen: Date;
}

interface DeviceContextType {
  devices: Device[];
  activeDeviceId: string | null;
  setActiveDeviceId: Dispatch<StateUpdater<string | null>>;
  addDevice: (device: Omit<Device, 'lastSeen'>) => void;
  updateDeviceStatus: (id: string, connected: boolean) => void;
  getDeviceName: (id: string) => string;
  clearDevices: () => void;
  initializeWithMockData: () => void;
}

export const DeviceContext = createContext<DeviceContextType>({
  devices: [],
  activeDeviceId: null,
  setActiveDeviceId: () => {},
  addDevice: () => {},
  updateDeviceStatus: () => {},
  getDeviceName: () => 'Unknown Device',
  clearDevices: () => {},
  initializeWithMockData: () => {},
});

export interface DeviceProviderProps {
  children: preact.ComponentChildren;
}

export const DeviceProvider = ({ children }: DeviceProviderProps) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);

  // Debug logging
  console.log(
    '[DeviceProvider] 123123Rendered with devices:',
    devices.length,
    devices
  );

  // Force a visible console message about device state every render
  console.log(
    '%c[DEVICE DEBUG] Current device state:',
    'color: yellow; font-weight: bold',
    {
      totalDevices: devices.length,
      connectedDevices: devices.filter((d) => d.connected).length,
      activeDeviceId,
      deviceNames: devices.map((d) => d.name),
    }
  );

  // DISABLED TEMPORARILY: Load devices from localStorage on startup
  /*
  useEffect(() => {
    const savedDevices = localStorage.getItem('netvision-devices');
    if (savedDevices) {
      try {
        const parsedDevices = JSON.parse(savedDevices);
        // Convert string dates back to Date objects
        const devicesWithDates = parsedDevices.map((device: any) => ({
          ...device,
          lastSeen: new Date(device.lastSeen),
        }));
        setDevices(devicesWithDates);

        // Auto-select the first device if none is selected
        if (devicesWithDates.length > 0 && !activeDeviceId) {
          setActiveDeviceId(devicesWithDates[0].id);
        }
      } catch (e) {
        console.error('Failed to parse saved devices:', e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */

  // Save devices to localStorage when they change
  useEffect(() => {
    localStorage.setItem('netvision-devices', JSON.stringify(devices));
  }, [devices]);

  const addDevice = useCallback(
    (device: Omit<Device, 'lastSeen'>) => {
      console.log(
        '%c[DeviceContext] ADD DEVICE FUNCTION CALLED!',
        'background: red; color: white; padding: 5px 10px; font-size: 18px;'
      );
      console.log('[DeviceContext] Adding/updating device:', device);
      console.log(
        '%c[DeviceContext] ADDING DEVICE:',
        'background: green; color: white; padding: 2px 5px;',
        device
      );
      setDevices((prevDevices) => {
        console.log('[DeviceContext] Current devices before add:', prevDevices);

        // Check if the device already exists
        const existingDeviceIndex = prevDevices.findIndex(
          (d) => d.id === device.id
        );

        if (existingDeviceIndex !== -1) {
          // Update existing device
          console.log('[DeviceContext] Updating existing device:', device.id);
          const updatedDevices = [...prevDevices];
          updatedDevices[existingDeviceIndex] = {
            ...updatedDevices[existingDeviceIndex],
            name: device.name,
            platform: device.platform,
            connected: device.connected,
            lastSeen: new Date(),
          };
          console.log('[DeviceContext] Updated devices list:', updatedDevices);
          return updatedDevices;
        }

        // Add new device
        const newDevice = {
          ...device,
          lastSeen: new Date(),
        };

        console.log('[DeviceContext] Added new device:', newDevice);

        // Auto-select first device if none is selected
        if (!activeDeviceId) {
          console.log(
            '[DeviceContext] Auto-selecting first device:',
            newDevice.id
          );
          setActiveDeviceId(newDevice.id);
        }

        const newDevicesList = [...prevDevices, newDevice];
        console.log('[DeviceContext] Final devices list:', newDevicesList);
        return newDevicesList;
      });
    },
    [activeDeviceId]
  );

  const updateDeviceStatus = useCallback((id: string, connected: boolean) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === id
          ? { ...device, connected, lastSeen: new Date() }
          : device
      )
    );
  }, []);

  const getDeviceName = (id: string): string => {
    const device = devices.find((d) => d.id === id);
    return device ? device.name : 'Unknown Device';
  };

  const clearDevices = () => {
    // Clear all devices
    setDevices([]);
    setActiveDeviceId(null);

    console.log('[DeviceContext] clearDevices called - removed all devices');
  };

  const initializeWithMockData = () => {
    console.log('[DeviceContext] Initializing with mock data');
    const mockDevices: Device[] = [
      {
        id: 'mock-ios-1',
        name: "John's iPhone",
        platform: 'ios',
        connected: true,
        lastSeen: new Date(),
      },
      {
        id: 'mock-android-1',
        name: "Mary's Galaxy",
        platform: 'android',
        connected: true,
        lastSeen: new Date(),
      },
    ];

    setDevices(mockDevices);
    setActiveDeviceId(mockDevices[0].id);

    // Save to localStorage for persistence
    localStorage.setItem('netvision-devices', JSON.stringify(mockDevices));
    console.log(
      '[DeviceContext] Mock data initialized with',
      mockDevices.length,
      'devices'
    );

    return mockDevices;
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        activeDeviceId,
        setActiveDeviceId,
        addDevice,
        updateDeviceStatus,
        getDeviceName,
        clearDevices,
        initializeWithMockData,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => useContext(DeviceContext);
