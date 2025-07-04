/** @jsxImportSource preact */
import type { VNode } from 'preact';
import { getDomain } from '../../utils/urlUtils';

interface DomainDisplayProps {
  url: string;
  isSelected: boolean;
}

export const DomainDisplay = ({
  url,
  isSelected,
}: DomainDisplayProps): VNode => {
  const domain = getDomain(url);

  return (
    <div className="flex-1 min-w-0">
      <span
        className={`text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all duration-350 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 group-hover:font-bold group-hover:tracking-wider block ${
          isSelected
            ? 'text-indigo-700 dark:text-indigo-300 font-bold tracking-wide'
            : ''
        }`}
      >
        {domain}
      </span>
    </div>
  );
};
