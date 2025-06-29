/** @jsxImportSource preact */
import { VNode } from 'preact';
import { fieldStyles } from '../../utils/fieldStyles';

interface URLViewerProps {
  value: string;
  className?: string;
}

export const URLViewer = ({ value, className = '' }: URLViewerProps): VNode => {
  return (
    <div className={`${fieldStyles.content.url} url-container ${className}`}>
      <span className="url-text">{value}</span>
    </div>
  );
};
