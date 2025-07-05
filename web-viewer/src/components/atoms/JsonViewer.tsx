/** @jsxImportSource preact */
import { VNode } from 'preact';
import {
  validateAndFormatJson,
  highlightJson,
  isLikelyJson,
} from '../../utils/json';
import { fieldStyles } from '../../utils/fieldStyles';
import { ScrollFadeContainer } from './ScrollFadeContainer';

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
    // Fallback to simple code display - remove overflow classes and use ScrollFadeContainer
    const baseCodeClasses = fieldStyles.content.code
      .replace('overflow-y-auto', '')
      .replace('overflow-x-auto', '')
      .replace('max-h-96', '');

    return (
      <ScrollFadeContainer
        className={`${baseCodeClasses} max-h-96 overflow-y-auto overflow-x-auto ${className}`}
        fadeHeight={12}
      >
        <pre className="whitespace-pre-wrap break-words">{value}</pre>
      </ScrollFadeContainer>
    );
  }

  // Remove overflow classes from json content style
  const baseJsonClasses = fieldStyles.content.json
    .replace('overflow-auto', '')
    .replace('max-h-96', '');

  return (
    <div className={`${fieldStyles.container.withHeader} ${className}`}>
      <div className={fieldStyles.header.json}>
        <span className={fieldStyles.label.jsonHeader}>JSON</span>
      </div>
      <ScrollFadeContainer
        className={`${baseJsonClasses} max-h-96 overflow-auto`}
        fadeHeight={12}
      >
        <pre dangerouslySetInnerHTML={{ __html: highlightedJson }} />
      </ScrollFadeContainer>
    </div>
  );
};
