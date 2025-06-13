/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { useDevices } from '../../context/DeviceContext';

interface FloatingDeviceDebugProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: any; // Reference to the trigger button
}

export const FloatingDeviceDebug = ({
  isOpen,
  onClose,
  anchorRef,
}: FloatingDeviceDebugProps): VNode => {
  const { devices, activeDeviceId } = useDevices();
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && anchorRef.current && panelRef.current) {
      const anchor = anchorRef.current.getBoundingClientRect();
      const panel = panelRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let top = anchor.bottom + 8;
      let left = anchor.left;

      // Adjust position to keep panel in viewport
      if (left + 320 > viewport.width) {
        left = anchor.right - 320;
      }

      if (top + panel.height > viewport.height) {
        top = anchor.top - panel.height - 8;
      }

      setPosition({ top, left });
    }
  }, [isOpen, anchorRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose, anchorRef]);

  return (
    <>
      {/* Backdrop with enhanced blur transition */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/5 dark:bg-black/20 backdrop-blur-sm animate-fade-in-backdrop" />
      )}

      {/* Floating Panel */}
      <div
        ref={panelRef}
        className={`fixed z-50 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl transition-all duration-150 ease-out ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Device Debug Panel
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto refined-scrollbar">
          {/* Status Overview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {devices.length}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Total Devices
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {devices.filter((d) => d.connected).length}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                Connected
              </div>
            </div>
          </div>

          {/* Active Device */}
          {activeDeviceId && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
              <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                Active Device
              </div>
              <div className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                {activeDeviceId}
              </div>
            </div>
          )}

          {/* Device List */}
          {devices.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Device List
              </div>
              <div className="space-y-2">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {device.name}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          device.connected
                            ? 'bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-300'
                        }`}
                      >
                        {device.connected ? '🟢 Online' : '🔴 Offline'}
                      </span>
                    </div>
                    <div className="space-y-1 text-gray-600 dark:text-gray-400">
                      <div>
                        <strong>ID:</strong> {device.id.substring(0, 12)}...
                      </div>
                      <div>
                        <strong>Platform:</strong> {device.platform}
                      </div>
                      <div>
                        <strong>Last Seen:</strong>{' '}
                        {device.lastSeen.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Devices Message */}
          {devices.length === 0 && (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                No devices detected
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Check console for debugging info
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
