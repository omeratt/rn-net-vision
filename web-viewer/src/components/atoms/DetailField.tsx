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
      {isCode ? (
        <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-xs font-mono overflow-x-auto text-gray-800 dark:text-gray-200">
          {value}
        </pre>
      ) : (
        <div className="text-sm text-gray-600 dark:text-gray-400">{value}</div>
      )}
    </div>
  );
};
