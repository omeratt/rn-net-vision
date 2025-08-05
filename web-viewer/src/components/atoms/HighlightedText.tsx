/** @jsxImportSource preact */
import { VNode } from 'preact';
import type { FieldMatch } from '../../hooks';
import { highlightText, highlightUrlText } from '../../utils';

interface HighlightedTextProps {
  text: string;
  query: string;
  match?: FieldMatch;
  isUrl?: boolean;
  className?: string;
}

export const HighlightedText = ({
  text,
  query,
  match,
  isUrl = false,
  className = '',
}: HighlightedTextProps): VNode => {
  if (isUrl) {
    return (
      <span className={`block max-w-full break-all ${className}`}>
        {highlightUrlText(text, query)}
      </span>
    );
  }

  if (match) {
    return (
      <div
        className={`text-gray-900 dark:text-gray-100 text-sm overflow-hidden ${className}`}
      >
        {highlightText(match.preview || match.value, match)}
      </div>
    );
  }

  return (
    <span className={`block max-w-full break-all ${className}`}>{text}</span>
  );
};
