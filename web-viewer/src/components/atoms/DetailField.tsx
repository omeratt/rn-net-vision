/** @jsxImportSource preact */
import { VNode } from 'preact';
import { CopyButton } from './CopyButton';
import { useToast } from '../../context/ToastContext';

interface DetailFieldProps {
  label: string;
  value: string;
  isCode?: boolean;
  className?: string;
}

export const DetailField = ({
  label,
  value,
  isCode = false,
  className = '',
}: DetailFieldProps): VNode => {
  const { showToast } = useToast();

  const handleCopy = (_text: string) => {
    showToast(`${label} copied to clipboard!`, 'success', 2000);
  };

  const labelColor = label.includes('Error')
    ? 'text-red-600 dark:text-red-400'
    : 'text-gray-700 dark:text-gray-300';

  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <div
          className={`text-sm font-medium ${labelColor} transition-all duration-200`}
        >
          {label}
        </div>
        <CopyButton text={value} onCopy={handleCopy} size="sm" />
      </div>
      {isCode ? (
        <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-xs font-mono text-gray-800 dark:text-gray-200 transition-all duration-200 border border-gray-100 dark:border-gray-700 detail-field-pre whitespace-pre-wrap break-words overflow-hidden">
          {value}
        </pre>
      ) : (
        <div className="text-sm text-gray-600 dark:text-gray-400 transition-all duration-200 text-overflow-responsive break-words">
          {value}
        </div>
      )}
    </div>
  );
};
