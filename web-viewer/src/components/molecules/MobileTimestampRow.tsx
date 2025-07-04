/** @jsxImportSource preact */
import type { VNode } from 'preact';
import { TimestampBadge } from '../atoms/TimestampBadge';

interface MobileTimestampRowProps {
  timestamp: string;
  isSelected: boolean;
}

export const MobileTimestampRow = ({
  timestamp,
  isSelected,
}: MobileTimestampRowProps): VNode => {
  return (
    <div className="flex items-center sm:hidden transition-all duration-300">
      <TimestampBadge timestamp={timestamp} isSelected={isSelected} />
    </div>
  );
};
