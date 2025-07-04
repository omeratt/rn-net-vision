/** @jsxImportSource preact */
import type { VNode } from 'preact';
import { getStatusColor, getStatusBadgeColor } from '../../utils/badgeUtils';
import { getBaseBadgeClasses } from '../../utils/styleUtils';

interface StatusBadgeProps {
  status: number;
  isSelected: boolean;
}

export const StatusBadge = ({
  status,
  isSelected,
}: StatusBadgeProps): VNode => {
  const baseClasses = getBaseBadgeClasses(isSelected);
  const statusTextColor = getStatusColor(status);
  const statusBgColor = getStatusBadgeColor(status);

  return (
    <span
      className={`${baseClasses} ${statusBgColor} ${statusTextColor} min-w-[2rem] xs:min-w-[2.5rem] h-6 xs:h-7 font-bold`}
    >
      {status}
    </span>
  );
};
