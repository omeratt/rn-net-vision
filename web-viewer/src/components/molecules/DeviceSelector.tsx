/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useDevices } from '../../context/DeviceContext';

export const DeviceSelector = (): VNode => {
  const { devices, activeDeviceId, setActiveDeviceId } = useDevices();

  const handleDeviceChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    setActiveDeviceId(select.value);
  };

  // Don't show selector if no devices or only one device
  if (devices.length <= 1) {
    return <></>;
  }

  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="device-selector"
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Device:
      </label>

      <div className="relative">
        <select
          id="device-selector"
          className="block pl-3 pr-8 py-2 text-sm rounded-md border border-gray-300 
                   dark:border-gray-600 bg-white dark:bg-gray-800 
                   focus:outline-none focus:ring-primary-500 focus:border-primary-500
                   font-medium"
          value={activeDeviceId || ''}
          onChange={handleDeviceChange}
        >
          <option value="">All Devices</option>
          {devices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.platform === 'android' ? '📱' : '📱'} {device.name}{' '}
              {device.connected ? '(🟢 Active)' : '(⚫ Inactive)'}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="h-4 w-4 text-gray-400"
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

      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
        <span className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-green-100 bg-green-600 rounded-full">
          {devices.filter((d) => d.connected).length}
        </span>
        <span>/</span>
        <span className="inline-flex items-center justify-center px-2 py-1 ml-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
          {devices.length}
        </span>
        <span className="ml-2">devices connected</span>
      </div>
    </div>
  );
};
