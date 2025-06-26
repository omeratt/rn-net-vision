/** @jsxImportSource preact */
import { VNode } from 'preact';
import { CopyButton } from './CopyButton';
import { useToast } from '../../context/ToastContext';
import { CollapsibleSection } from '../molecules/CollapsibleSection';
import { useFieldContent } from '../../hooks/useFieldContent.tsx';
import { isErrorField } from '../../utils/fieldTypes';
import { fieldStyles } from '../../utils/fieldStyles';

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
  const { content } = useFieldContent({ label, value, isCode });

  const handleCopy = (_text: string) => {
    showToast(`${label} copied to clipboard!`, 'success', 2000);
  };

  const copyButton = <CopyButton text={value} onCopy={handleCopy} size="sm" />;
  const isError = isErrorField(label);

  const labelClassName = isError
    ? fieldStyles.label.error
    : fieldStyles.label.base;

  if (!collapsible) {
    return (
      <div className={`mb-4 ${className}`}>
        <div className="flex items-center justify-between gap-3 mb-1">
          <span className={labelClassName}>{label}</span>
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
      titleClassName={labelClassName}
    >
      {content}
    </CollapsibleSection>
  );
};
