/** @jsxImportSource preact */
import type { VNode } from 'preact';
import { MethodBadge } from '../atoms/MethodBadge';
import { StatusBadge } from '../atoms/StatusBadge';
import { DeviceBadge } from '../atoms/DeviceBadge';
import { DurationBadge } from '../atoms/DurationBadge';

interface BadgeRowProps {
  method: string;
  status: number;
  duration: number;
  deviceId?: string;
  deviceName?: string;
  devicePlatform?: string;
  isSelected: boolean;
  showDeviceInfo: boolean;
}

export const BadgeRow = ({
  method,
  status,
  duration,
  deviceId,
  deviceName,
  devicePlatform,
  isSelected,
  showDeviceInfo,
}: BadgeRowProps): VNode => {
  return (
    <div className="flex items-center justify-between gap-2 xs:gap-3 w-full min-w-0 overflow-hidden">
      {/* Left side: Method and Status badges */}
      <div className="flex items-center gap-2 xs:gap-3 flex-shrink-0">
        <MethodBadge method={method} isSelected={isSelected} />
        <StatusBadge status={status} isSelected={isSelected} />
      </div>

      {/* Right side: Device and Duration badges */}
      <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-shrink">
        <DeviceBadge
          deviceId={deviceId}
          deviceName={deviceName}
          devicePlatform={devicePlatform}
          isSelected={isSelected}
          showDeviceInfo={showDeviceInfo}
        />
        <DurationBadge duration={duration} isSelected={isSelected} />
      </div>
    </div>
  );
};
