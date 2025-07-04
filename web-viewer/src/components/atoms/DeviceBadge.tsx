/** @jsxImportSource preact */
import type { VNode } from 'preact';
import { getDevicePlatformColor } from '../../utils/badgeUtils';

interface DeviceBadgeProps {
  deviceId?: string;
  deviceName?: string;
  devicePlatform?: string;
  isSelected: boolean;
  showDeviceInfo: boolean;
}

const DeviceIcon = ({ platform }: { platform: string }): VNode => {
  if (platform === 'ios') {
    return (
      <svg
        className="w-3 h-3 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    );
  }

  return (
    <svg
      className="w-3 h-3 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zM20.5 8c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zM15.53 2.16l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
    </svg>
  );
};

export const DeviceBadge = ({
  deviceId,
  deviceName,
  devicePlatform = 'android',
  isSelected,
  showDeviceInfo,
}: DeviceBadgeProps): VNode | null => {
  if (!deviceId || !showDeviceInfo) return null;

  const platformColor = getDevicePlatformColor(devicePlatform);
  const displayName = deviceName || deviceId;

  return (
    <span
      className={`inline-flex items-center rounded-lg text-xs font-medium border border-white/40 shadow-sm transition-all duration-350 group-hover:shadow-lg group-hover:border-indigo-400/70 group-hover:bg-gradient-to-r group-hover:from-white/90 group-hover:to-blue-50/70 dark:group-hover:from-gray-600/90 dark:group-hover:to-blue-900/70 
        min-w-[2rem] max-w-[20rem] 
        px-2 py-1 xs:py-1.5
        ${platformColor} ${
          isSelected
            ? 'shadow-md border-indigo-500/60 bg-gradient-to-r from-white/80 to-blue-50/60 dark:from-gray-500/80 dark:to-blue-800/60 font-semibold tracking-wide'
            : ''
        } flex-shrink`}
      title={displayName}
    >
      <DeviceIcon platform={devicePlatform} />
      <span className="ml-1 overflow-hidden text-ellipsis whitespace-nowrap flex-shrink min-w-0">
        {displayName}
      </span>
    </span>
  );
};
