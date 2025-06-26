/** @jsxImportSource preact */
import { VNode } from 'preact';
import { fieldStyles } from '../../utils/fieldStyles';

interface TextViewerProps {
  value: string;
  className?: string;
}

export const TextViewer = ({
  value,
  className = '',
}: TextViewerProps): VNode => {
  return (
    <div className={`${fieldStyles.content.text} ${className}`}>{value}</div>
  );
};
