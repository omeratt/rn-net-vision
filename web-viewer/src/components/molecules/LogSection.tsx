/** @jsxImportSource preact */
import { VNode } from 'preact';
import { CollapsibleSection } from './CollapsibleSection';
import { DetailField } from '../atoms/DetailField';

interface LogSectionProps {
  title: string;
  headers: Record<string, string[]>;
  body?: string;
  className?: string;
}

export const LogSection = ({
  title,
  headers,
  body,
  className = '',
}: LogSectionProps): VNode => {
  const formatHeaders = (headersData: Record<string, string[]>): string => {
    if (!headersData) return 'No headers';

    return Object.entries(headersData)
      .map(([key, values]) => {
        return `${key}: ${values?.join?.(', ')}`;
      })
      ?.join('\n');
  };

  return (
    <CollapsibleSection
      title={title}
      className={className}
      initialCollapsed={false}
    >
      <div className="space-y-3 transition-all duration-200 ease-out">
        <DetailField
          label="Headers"
          value={formatHeaders(headers)}
          isCode
          collapsible
          initialExpanded
        />

        {body && (
          <DetailField
            label="Body"
            value={body}
            isCode
            collapsible
            initialExpanded
          />
        )}
      </div>
    </CollapsibleSection>
  );
};
