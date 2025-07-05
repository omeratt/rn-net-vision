/** @jsxImportSource preact */
import { VNode } from 'preact';
import { fieldStyles } from '../../utils/fieldStyles';
import { ScrollFadeContainer } from './ScrollFadeContainer';

interface CodeViewerProps {
  value: string;
  className?: string;
}

export const CodeViewer = ({
  value,
  className = '',
}: CodeViewerProps): VNode => {
  // Remove overflow classes from fieldStyles and apply them to ScrollFadeContainer
  const baseClasses = fieldStyles.content.code
    .replace('overflow-y-auto', '')
    .replace('overflow-x-auto', '')
    .replace('max-h-96', '');

  return (
    <ScrollFadeContainer
      className={`${baseClasses} max-h-96 overflow-y-auto overflow-x-auto ${className}`}
      fadeHeight={12}
    >
      <pre className="whitespace-pre-wrap break-words">{value}</pre>
    </ScrollFadeContainer>
  );
};
