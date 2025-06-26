/** @jsxImportSource preact */
import { VNode } from 'preact';
import { fieldStyles } from '../../utils/fieldStyles';

interface CodeViewerProps {
  value: string;
  className?: string;
}

export const CodeViewer = ({
  value,
  className = '',
}: CodeViewerProps): VNode => {
  return (
    <pre className={`${fieldStyles.content.code} ${className}`}>{value}</pre>
  );
};
