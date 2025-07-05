/** @jsxImportSource preact */
import { VNode } from 'preact';
import { fieldStyles } from '../../utils/fieldStyles';
import { ScrollFadeContainer } from './ScrollFadeContainer';

interface TextViewerProps {
  value: string;
  className?: string;
}

export const TextViewer = ({
  value,
  className = '',
}: TextViewerProps): VNode => {
  // Remove overflow classes from fieldStyles and apply them to ScrollFadeContainer
  const baseClasses = fieldStyles.content.text
    .replace('overflow-y-auto', '')
    .replace('max-h-96', '');

  return (
    <ScrollFadeContainer
      className={`${baseClasses} max-h-96 overflow-y-auto ${className}`}
      fadeHeight={12}
    >
      <div>{value}</div>
    </ScrollFadeContainer>
  );
};
