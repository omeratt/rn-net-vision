/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useDevices } from '../../context/DeviceContext';

export const DeviceDebugPanel = (): VNode => {
  const { devices, activeDeviceId } = useDevices();

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return <></>;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">🐛 Device Debug Panel</h3>

      <div className="mb-2">
        <strong>Active Device:</strong> {activeDeviceId || 'None'}
      </div>

      <div className="mb-2">
        <strong>Total Devices:</strong> {devices.length}
      </div>

      <div className="mb-2">
        <strong>Connected Devices:</strong>{' '}
        {devices.filter((d) => d.connected).length}
      </div>

      {devices.length > 0 && (
        <div className="space-y-1">
          <strong>Device List:</strong>
          {devices.map((device) => (
            <div key={device.id} className="bg-gray-700 p-2 rounded text-xs">
              <div>
                <strong>ID:</strong> {device.id}
              </div>
              <div>
                <strong>Name:</strong> {device.name}
              </div>
              <div>
                <strong>Platform:</strong> {device.platform}
              </div>
              <div>
                <strong>Connected:</strong> {device.connected ? '🟢' : '🔴'}
              </div>
              <div>
                <strong>Last Seen:</strong>{' '}
                {device.lastSeen.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {devices.length === 0 && (
        <div className="text-yellow-400">
          ⚠️ No devices detected. Check console for debugging info.
        </div>
      )}
    </div>
  );
};
