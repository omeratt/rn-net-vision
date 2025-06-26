/** @jsxImportSource preact */
import { VNode } from 'preact';
import {
  validateAndFormatJson,
  highlightJson,
  isLikelyJson,
} from '../../utils/json';
import { fieldStyles } from '../../utils/fieldStyles';

interface JsonViewerProps {
  value: string;
  className?: string;
}

export const JsonViewer = ({
  value,
  className = '',
}: JsonViewerProps): VNode => {
  // First try to validate and format the JSON
  const jsonResult = validateAndFormatJson(value);

  let formattedJson = value;
  let isValidJson = false;

  if (jsonResult.isValid && jsonResult.formatted) {
    formattedJson = jsonResult.formatted;
    isValidJson = true;
  } else if (isLikelyJson(value)) {
    // If it looks like JSON but parsing failed, try to use it as-is
    formattedJson = value;
  }

  const highlightedJson = isValidJson
    ? highlightJson(formattedJson)
    : formattedJson;

  if (!isValidJson && !isLikelyJson(value)) {
    // Fallback to simple code display
    return (
      <pre className={`${fieldStyles.content.code} ${className}`}>{value}</pre>
    );
  }

  return (
    <div className={`${fieldStyles.container.withHeader} ${className}`}>
      <div className={fieldStyles.header.json}>
        <span className={fieldStyles.label.jsonHeader}>JSON</span>
      </div>
      <div className="relative">
        <pre
          className={fieldStyles.content.json}
          dangerouslySetInnerHTML={{ __html: highlightedJson }}
        />
      </div>
    </div>
  );
};
