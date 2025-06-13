/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { useDevices, Device } from '../../context/DeviceContext';

interface ModernDeviceSelectorProps {
  isConnected: boolean;
}

export const ModernDeviceSelector = ({
  isConnected,
}: ModernDeviceSelectorProps): VNode => {
  const { devices, activeDeviceId, setActiveDeviceId } = useDevices();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Only show connected devices in the dropdown
  const connectedDevices = devices.filter((d) => d.connected);

  // Sort connected devices by platform (iOS first, then Android) and then by name
  const sortedConnectedDevices = [...connectedDevices].sort((a, b) => {
    if (a.platform !== b.platform) {
      return a.platform === 'ios' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const activeDevice = devices.find((d) => d.id === activeDeviceId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeviceSelect = (deviceId: string) => {
    setActiveDeviceId(deviceId);
    setIsOpen(false);
  };

  const getDeviceDisplayName = (device: Device): string => {
    const nameWithoutPrefix = device.name.replace(
      /^(iPhone|iPad|iPod|Android|Pixel|Samsung|Xiaomi)(\s|-)/i,
      ''
    );
    return device.name !== nameWithoutPrefix
      ? device.name
      : `${device.platform === 'ios' ? 'iOS' : 'Android'} Device (${nameWithoutPrefix})`;
  };

  const getSelectedDisplayText = (): string => {
    if (!isConnected) return 'Server Disconnected';
    if (sortedConnectedDevices.length === 0) return 'No Devices Connected';
    if (!activeDeviceId) return 'All Devices';
    if (activeDevice) return getDeviceDisplayName(activeDevice);
    return 'Select Device';
  };

  const getPlatformIcon = (platform: 'ios' | 'android'): VNode => {
    if (platform === 'ios') {
      // Apple logo
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      );
    }

    // Android robot
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zM20.5 8c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zM15.53 2.16l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
      </svg>
    );
  };

  const getStatusIcon = (connected: boolean): VNode => {
    const statusClasses = `w-2 h-2 rounded-full transition-all duration-300 ${
      connected
        ? 'bg-green-400 shadow-green-400/50 shadow-lg animate-pulse scale-110'
        : 'bg-gray-400 scale-90'
    }`;
    return (
      <div className="relative">
        <div className={statusClasses} />
        {connected && (
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400/30 animate-ping" />
        )}
      </div>
    );
  };

  const mainButtonClasses = `
    modern-button relative flex items-center justify-between w-full min-w-[280px] px-4 py-3
    bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600
    rounded-xl shadow-sm hover:shadow-lg dark:shadow-gray-900/20
    transition-all duration-300 ease-out transform hover:scale-[1.02]
    ${
      isConnected
        ? 'hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-gradient-to-r hover:from-white hover:to-indigo-50 dark:hover:from-gray-800 dark:hover:to-indigo-900/20'
        : 'opacity-60 cursor-not-allowed'
    }
    ${
      isOpen
        ? 'border-indigo-400 dark:border-indigo-500 shadow-xl shadow-indigo-200/50 dark:shadow-indigo-900/30 ring-4 ring-indigo-100 dark:ring-indigo-900/30 scale-[1.02] bg-gradient-to-r from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20'
        : ''
    }
    focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30
    group
  `;

  const dropdownClasses = `
    animate-slide-in-up absolute top-full left-0 right-0 mt-2 z-50
    bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-gray-200/80 dark:border-gray-600/80
    rounded-xl shadow-2xl dark:shadow-gray-900/40
    overflow-hidden
    transition-all duration-300 ease-out origin-top
    ${
      isOpen
        ? 'opacity-100 scale-100 translate-y-0'
        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
    }
  `;

  const arrowClasses = `
    flex items-center justify-center w-6 h-6 transition-all duration-300 ease-out
    ${isOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}
    group-hover:text-indigo-500 dark:group-hover:text-indigo-400
  `;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main selector button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={!isConnected}
        className={mainButtonClasses}
      >
        <div className="flex items-center space-x-3">
          {/* Device icon and status */}
          <div className="flex items-center space-x-2">
            {activeDevice && (
              <>
                <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                  {getPlatformIcon(activeDevice.platform)}
                </span>
                {getStatusIcon(activeDevice.connected)}
              </>
            )}
            {!activeDevice &&
              isConnected &&
              sortedConnectedDevices.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="text-lg">📱</span>
                  <div className="w-2 h-2 rounded-full bg-blue-400 shadow-blue-400/50 shadow-lg animate-pulse" />
                </div>
              )}
            {!isConnected && (
              <div className="flex items-center space-x-1">
                <span className="text-lg opacity-60">📱</span>
                <div className="w-2 h-2 rounded-full bg-red-400" />
              </div>
            )}
          </div>

          {/* Device name */}
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
              {getSelectedDisplayText()}
            </span>
            {activeDevice && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                [{activeDevice.id.substring(0, 8)}]
              </span>
            )}
          </div>
        </div>

        {/* Dropdown arrow */}
        <div className={arrowClasses}>
          <svg
            className="w-4 h-4 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m19 9-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown menu */}
      <div className={dropdownClasses}>
        <div className="py-2">
          {/* "All Devices" option */}
          {isConnected && sortedConnectedDevices.length > 0 && (
            <button
              onClick={() => handleDeviceSelect('')}
              className={`
                device-item-hover w-full px-4 py-3 text-left flex items-center space-x-3
                hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 dark:hover:from-indigo-900/30 dark:hover:to-blue-900/30
                transition-all duration-300 ease-out transform hover:scale-[1.02] hover:translate-x-1
                ${!activeDeviceId ? 'bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border-l-4 border-indigo-400' : ''}
                group relative overflow-hidden
              `}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
                  📱
                </span>
                <div className="w-2 h-2 rounded-full bg-blue-400 shadow-blue-400/50 shadow-lg animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200">
                  All Devices
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  Show logs from all connected devices
                </span>
              </div>
              {!activeDeviceId && (
                <div className="ml-auto">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce-scale" />
                </div>
              )}
            </button>
          )}

          {/* Connected devices */}
          {sortedConnectedDevices.map((device, index) => (
            <button
              key={device.id}
              onClick={() => handleDeviceSelect(device.id)}
              className={`
                device-item-hover w-full px-4 py-3 text-left flex items-center space-x-3
                hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50 dark:hover:from-gray-700/50 dark:hover:to-indigo-900/30
                transition-all duration-300 ease-out transform hover:scale-[1.02] hover:translate-x-1
                ${activeDeviceId === device.id ? 'bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border-l-4 border-indigo-400' : ''}
                group relative overflow-hidden
                animate-fade-in
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
                  {getPlatformIcon(device.platform)}
                </span>
                {getStatusIcon(device.connected)}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200">
                  {getDeviceDisplayName(device)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  [{device.id.substring(0, 8)}]
                </span>
              </div>
              {activeDeviceId === device.id && (
                <div className="ml-auto">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce-scale" />
                </div>
              )}
              {/* Subtle shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              </div>
            </button>
          ))}

          {/* No devices message */}
          {isConnected && sortedConnectedDevices.length === 0 && (
            <div className="px-4 py-6 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-2xl opacity-60">📱</span>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  No devices connected
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Connect a device to see it here
                </span>
              </div>
            </div>
          )}

          {/* Server disconnected message */}
          {!isConnected && (
            <div className="px-4 py-6 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <span className="text-2xl">🔴</span>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Server Disconnected
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Check your connection
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Device count indicator */}
      <div className="absolute -top-2 -right-2 z-10">
        <div className="flex items-center space-x-1">
          {/* Connected devices count */}
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-bounce-scale">
            <span className="mr-1 transition-transform duration-300 hover:rotate-180">
              🟢
            </span>
            <span className="font-mono">{connectedDevices.length}</span>
          </div>

          {/* Total devices count (if different from connected) */}
          {devices.length > connectedDevices.length && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-gray-400 to-slate-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <span className="mr-1 opacity-70">⚫</span>
              <span className="font-mono">
                {devices.length - connectedDevices.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
