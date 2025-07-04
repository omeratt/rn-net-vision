/** @jsxImportSource preact */
import type { VNode } from 'preact';
import { getMethodColor } from '../../utils/badgeUtils';
import { getBaseBadgeClasses } from '../../utils/styleUtils';

interface MethodBadgeProps {
  method: string;
  isSelected: boolean;
}

export const MethodBadge = ({
  method,
  isSelected,
}: MethodBadgeProps): VNode => {
  const baseClasses = getBaseBadgeClasses(isSelected);
  const methodClasses = getMethodColor(method);

  return (
    <span
      className={`${baseClasses} ${methodClasses} px-2 xs:px-3 py-1 xs:py-1.5`}
    >
      {method}
    </span>
  );
};
