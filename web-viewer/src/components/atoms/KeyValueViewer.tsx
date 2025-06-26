/** @jsxImportSource preact */
import { VNode } from 'preact';
import {
  parseKeyValuePairs,
  getKeyValueTypeLabel,
  KeyValueType,
} from '../../utils/keyValuePairs';
import { fieldStyles } from '../../utils/fieldStyles';

interface KeyValueViewerProps {
  value: string;
  type: KeyValueType;
  className?: string;
}

export const KeyValueViewer = ({
  value,
  type,
  className = '',
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

  return (
    <div className={`${fieldStyles.container.withHeader} ${className}`}>
      <div className={fieldStyles.header.base}>
        <span className={fieldStyles.label.keyValueHeader}>
          {getKeyValueTypeLabel(type)} ({pairs.length})
        </span>
      </div>
      <div className={fieldStyles.content.keyValueList}>
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
      </div>
    </div>
  );
};
