/** @jsxImportSource preact */
import type { VNode } from 'preact';
import type { NetVisionLog } from '../../types';
import { NetworkLogContainer } from './NetworkLogContainer';
import { BadgeRow } from './BadgeRow';
import { DomainDisplay } from '../atoms/DomainDisplay';
import { MobileTimestampRow } from './MobileTimestampRow';
import { UrlPathDisplay } from './UrlPathDisplay';

interface NetworkLogProps {
  log: NetVisionLog;
  isSelected?: boolean;
  isHighlighted?: boolean;
  highlightState?: 'idle' | 'blinking' | 'fading';
  onClick?: () => void;
  activeDeviceId?: string | null;
  isExiting?: boolean;
}

export const NetworkLog = ({
  log,
  isSelected = false,
  isHighlighted = false,
  highlightState = 'idle',
  onClick,
  activeDeviceId,
  isExiting = false,
}: NetworkLogProps): VNode => {
  // Only show device info when "All Devices" is selected (no activeDeviceId)
  const showDeviceInfo = !activeDeviceId;

  return (
    <div data-log-timestamp={log.timestamp} data-log-id={log.id}>
      <NetworkLogContainer
        isSelected={isSelected}
        isHighlighted={isHighlighted}
        highlightState={highlightState}
        onClick={onClick}
        isExiting={isExiting}
      >
        {/* Responsive layout with badges and domain */}
        <div className="flex flex-col gap-2 transition-all duration-300 w-full overflow-hidden">
          {/* Primary badges row */}
          <BadgeRow
            method={log.method}
            status={log.status}
            duration={log.duration}
            deviceId={log.deviceId}
            deviceName={log.deviceName}
            devicePlatform={log.devicePlatform}
            isSelected={isSelected}
            showDeviceInfo={showDeviceInfo}
          />

          {/* Domain display row */}
          <div className="w-full transition-all duration-300">
            <div className="flex items-center w-full">
              <DomainDisplay url={log.url} isSelected={isSelected} />
            </div>
          </div>

          {/* Mobile timestamp row (hidden on larger screens) */}
          <MobileTimestampRow
            timestamp={log.timestamp}
            isSelected={isSelected}
          />
        </div>

        {/* URL Path section with timestamp */}
        <UrlPathDisplay
          url={log.url}
          timestamp={log.timestamp}
          isSelected={isSelected}
        />
      </NetworkLogContainer>
    </div>
  );
};
