/** @jsxImportSource preact */
import { VNode } from 'preact';
import { CopyButton } from './CopyButton';
import { useToast } from '../../context/ToastContext';
import { CollapsibleSection } from '../molecules/CollapsibleSection';

interface DetailFieldProps {
  label: string;
  value: string;
  isCode?: boolean;
  className?: string;
  collapsible?: boolean;
  initialExpanded?: boolean;
}

export const DetailField = ({
  label,
  value,
  isCode = false,
  className = '',
  collapsible = false,
  initialExpanded = true,
}: DetailFieldProps): VNode => {
  const { showToast } = useToast();

  const handleCopy = (_text: string) => {
    showToast(`${label} copied to clipboard!`, 'success', 2000);
  };

  const content = isCode ? (
    <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-xs font-mono text-gray-800 dark:text-gray-200 transition-all duration-200 border border-gray-100 dark:border-gray-700 whitespace-pre-wrap break-words max-h-96 overflow-y-auto overflow-x-auto">
      {value}
    </pre>
  ) : (
    <div className="text-sm text-gray-600 dark:text-gray-400 transition-all duration-200 break-words overflow-wrap-anywhere hyphens-auto max-h-96 overflow-y-auto p-1">
      {value}
    </div>
  );

  const copyButton = <CopyButton text={value} onCopy={handleCopy} size="sm" />;

  if (!collapsible) {
    return (
      <div className={`mb-4 ${className}`}>
        <div className="flex items-center justify-between gap-3 mb-1">
          <span
            className={`text-sm font-medium transition-colors duration-200 ${
              label.includes('Error')
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {label}
          </span>
          <div className="flex-shrink-0">{copyButton}</div>
        </div>
        {content}
      </div>
    );
  }

  return (
    <CollapsibleSection
      title={label}
      variant="field"
      className={className}
      initialCollapsed={!initialExpanded}
      rightContent={copyButton}
      titleClassName={
        label.includes('Error')
          ? 'text-red-600 dark:text-red-400'
          : 'text-gray-700 dark:text-gray-300'
      }
    >
      {content}
    </CollapsibleSection>
  );
};
