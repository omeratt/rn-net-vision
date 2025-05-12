/** @jsxImportSource preact */
import { VNode } from 'preact';

interface DetailFieldProps {
  label: string;
  value: string;
  isCode?: boolean;
}

export const DetailField = ({
  label,
  value,
  isCode = false,
}: DetailFieldProps): VNode => {
  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </div>
      <div
        className={`p-3 bg-gray-50 dark:bg-gray-800 rounded-md ${
          isCode
            ? 'font-mono text-sm whitespace-pre overflow-x-auto'
            : 'text-sm break-words'
        }`}
      >
        {value}
      </div>
    </div>
  );
};
