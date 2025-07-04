/** @jsxImportSource preact */
import type { VNode } from 'preact';
import { useScrollToSelected } from '../../hooks/useScrollToSelected';
import { getContainerClasses } from '../../utils/styleUtils';

interface NetworkLogContainerProps {
  isSelected: boolean;
  onClick?: () => void;
  children: VNode | VNode[];
}

export const NetworkLogContainer = ({
  isSelected,
  onClick,
  children,
}: NetworkLogContainerProps): VNode => {
  const containerRef = useScrollToSelected({ isSelected });
  const containerClasses = getContainerClasses(isSelected);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`${containerClasses} p-2 sm:p-4`}
    >
      <div className="flex flex-col space-y-2 relative z-20 w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};
