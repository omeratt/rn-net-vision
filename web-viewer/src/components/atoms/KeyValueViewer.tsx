/** @jsxImportSource preact */
import { VNode } from 'preact';
import {
  parseKeyValuePairs,
  getKeyValueTypeLabel,
  KeyValueType,
} from '../../utils/keyValuePairs';
import { fieldStyles } from '../../utils/fieldStyles';
import { ScrollFadeContainer } from './ScrollFadeContainer';

interface KeyValueViewerProps {
  value: string;
  type: KeyValueType;
  className?: string;
  hideHeader?: boolean;
}

export const KeyValueViewer = ({
  value,
  type,
  className = '',
  hideHeader = false,
}: KeyValueViewerProps): VNode => {
  const pairs = parseKeyValuePairs(value, type);

  if (pairs.length === 0) {
    return (
      <div
        className={`text-sm text-gray-600 dark:text-gray-400 p-3 ${className}`}
      >
        No {type} found
      </div>
    );
  }

  // Remove overflow classes from keyValueList style
  const baseListClasses = fieldStyles.content.keyValueList
    .replace('overflow-y-auto', '')
    .replace('max-h-80', '');

  return (
    <div className={`${fieldStyles.container.withHeader} ${className}`}>
      {!hideHeader && (
        <div className={fieldStyles.header.base}>
          <span className={fieldStyles.label.keyValueHeader}>
            {getKeyValueTypeLabel(type)} ({pairs.length})
          </span>
        </div>
      )}
      <ScrollFadeContainer
        className={`${baseListClasses} max-h-80 overflow-y-auto`}
        fadeHeight={12}
      >
        {pairs.map((pair, index) => (
          <div key={index} className={fieldStyles.content.keyValueItem}>
            <div className="space-y-1">
              <div className={fieldStyles.keyValue.name} title={pair.name}>
                {pair.name}
              </div>
              <div className={fieldStyles.keyValue.value}>
                {pair.value || '(empty)'}
              </div>
            </div>
          </div>
        ))}
      </ScrollFadeContainer>
    </div>
  );
};
