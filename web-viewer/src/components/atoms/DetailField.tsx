/** @jsxImportSource preact */
import { VNode } from 'preact';
import { CopyButton } from './CopyButton';
import { useToast } from '../../context/ToastContext';
import { CollapsibleSection } from '../molecules/CollapsibleSection';
import { useFieldContent } from '../../hooks/useFieldContent.tsx';
import { isErrorField } from '../../utils/fieldTypes';
import { fieldStyles } from '../../utils/fieldStyles';
import { parseKeyValuePairs } from '../../utils/keyValuePairs';

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

  // Calculate item count for headers/cookies
  const isHeaders = label.toLowerCase().includes('header');
  const isCookies = label.toLowerCase().includes('cookie');
  const shouldShowCount = isHeaders || isCookies;

  const { content } = useFieldContent({
    label,
    value,
    isCode,
    hideHeader: shouldShowCount,
  });

  const handleCopy = (_text: string) => {
    showToast(`${label} copied to clipboard!`, 'success', 2000);
  };

  const copyButton = <CopyButton text={value} onCopy={handleCopy} size="sm" />;
  const isError = isErrorField(label);
  const isURL = label.toLowerCase() === 'url';

  const itemCount = shouldShowCount
    ? parseKeyValuePairs(value, isHeaders ? 'headers' : 'cookies').length
    : undefined;

  const labelClassName = isError
    ? fieldStyles.label.error
    : fieldStyles.label.base;

  if (!collapsible) {
    return (
      <div className={`mb-4 ${isURL ? 'w-full min-w-0' : ''} ${className}`}>
        <div className="flex items-center justify-between gap-3 mb-1">
          <span className={labelClassName}>{label}</span>
          <div className="flex-shrink-0">{copyButton}</div>
        </div>
        <div className={isURL ? 'w-full min-w-0 overflow-hidden' : ''}>
          {content}
        </div>
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
      titleClassName={labelClassName}
      itemCount={itemCount}
    >
      {content}
    </CollapsibleSection>
  );
};
