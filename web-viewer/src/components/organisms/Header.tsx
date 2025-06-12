/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useDevices } from '../../context/DeviceContext';
import { useMemo } from 'preact/hooks';
import { Device } from '../../context/DeviceContext';
import { ThemeToggle } from '../molecules/ThemeToggle';

interface HeaderProps {
  isConnected: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Function to format device names more specifically
const getSpecificDeviceName = (device: Device): string => {
  // Extract device model from name if possible, or use the provided name
  const nameWithoutPrefix = device.name.replace(
    /^(iPhone|iPad|iPod|Android|Pixel|Samsung|Xiaomi)(\s|-)/i,
    ''
  );

  return device.name !== nameWithoutPrefix
    ? device.name
    : `${device.platform === 'ios' ? 'iOS' : 'Android'} Device (${nameWithoutPrefix})`;
};

export const Header = ({
  isConnected,
  isDarkMode,
  toggleDarkMode,
}: HeaderProps): VNode => {
  const { devices, activeDeviceId, setActiveDeviceId } = useDevices();
  console.log({ devices });

  // Count connected devices
  const connectedDevices = devices.filter((d) => d.connected).length;

  // Only show connected devices in the dropdown
  const connectedDevicesList = devices.filter((d) => d.connected);

  const handleDeviceChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    setActiveDeviceId(select.value);
    console.log(`[Header] Device selection changed to: ${select.value}`);
  };

  // Debug logging for device state
  console.log(
    `[HeaderDebug] Rendering Header with ${devices.length} total devices, ${connectedDevices} connected:`,
    JSON.stringify(
      devices.map((d) => ({ id: d.id, name: d.name, connected: d.connected }))
    )
  );

  // Additional debug logging
  console.log(`[HeaderDebug] isConnected: ${isConnected}`);
  console.log(`[HeaderDebug] activeDeviceId: ${activeDeviceId}`);

  // Sort connected devices by platform (iOS first, then Android) and then by name
  const sortedConnectedDevices = useMemo(() => {
    return [...connectedDevicesList].sort((a, b) => {
      // First sort by platform (iOS first)
      if (a.platform !== b.platform) {
        return a.platform === 'ios' ? -1 : 1;
      }
      // Then by name alphabetically
      return a.name.localeCompare(b.name);
    });
  }, [connectedDevicesList]);

  // Debug sorted devices after definition
  console.log(`[HeaderDebug] sortedConnectedDevices:`, sortedConnectedDevices);
  console.log(
    `[HeaderDebug] sortedConnectedDevices.length:`,
    sortedConnectedDevices.length
  );

  // TEMPORARY: Alert to verify devices are loading
  if (sortedConnectedDevices.length > 0) {
    console.log(
      `%c🎉 DEVICES FOUND! ${sortedConnectedDevices.length} connected devices:`,
      'color: green; font-size: 20px; font-weight: bold;',
      sortedConnectedDevices.map((d) => d.name)
    );
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 transition-all">
      <div className="w-full px-4 py-3 sm:px-6 md:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <div className="flex items-center gap-3">
              <div className="text-primary-600 dark:text-primary-400 animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                NetVision
              </h1>
            </div>
            <div
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
                isConnected
                  ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-1.5 ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}
              />
              {isConnected ? 'Server Connected' : 'Server Disconnected'}
            </div>
          </div>

          <div className="flex flex-wrap items-center space-x-4">
            {/* Device selector dropdown - only show connected devices */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select
                  id="header-device-selector"
                  className="block pl-3 pr-8 py-1.5 text-sm rounded-md border border-gray-300 
                          dark:border-gray-600 bg-white dark:bg-gray-800 
                          focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-medium
                          min-w-[260px]"
                  value={activeDeviceId || ''}
                  onChange={handleDeviceChange}
                  disabled={!isConnected}
                >
                  {!isConnected && (
                    <option value="">Server Disconnected</option>
                  )}
                  {isConnected && sortedConnectedDevices.length === 0 && (
                    <option value="">No Devices Connected</option>
                  )}
                  {isConnected && sortedConnectedDevices.length > 0 && (
                    <option value="">All Devices</option>
                  )}
                  {sortedConnectedDevices.map((device: Device) => (
                    <option key={device.id} value={device.id}>
                      {device.platform === 'ios' ? '🍎' : '🤖'}{' '}
                      {getSpecificDeviceName(device)} [
                      {device.id.substring(0, 8)}]
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg
                    className="h-3 w-3 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Device count indicator */}
              <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300">
                <span className="mr-1">📱</span>
                <span>
                  {connectedDevices}/{devices.length}
                </span>
              </div>
            </div>

            <ThemeToggle
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
