/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState } from 'preact/hooks';

interface ImageViewerProps {
  value: string; // URL to the image
  className?: string;
}

/**
 * Displays an image preview (loaded from its URL) with a toggle to show the raw URL.
 * Mirrors the UX pattern used by SvgViewer (Preview vs Raw) but without parsing the body.
 */
export const ImageViewer = ({
  value,
  className = '',
}: ImageViewerProps): VNode => {
  const [showRaw, setShowRaw] = useState<boolean>(false);
  const imageUrl = value.trim();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Toggle buttons */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setShowRaw(false)}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            !showRaw
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Image Preview
        </button>
        <button
          onClick={() => setShowRaw(true)}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            showRaw
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Raw URL
        </button>
      </div>

      {showRaw ? (
        <div className="font-mono text-xs whitespace-pre-wrap break-words">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded border max-h-60 overflow-auto">
            {imageUrl}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="bg-white dark:bg-gray-800/30 p-4 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center min-h-[120px] max-h-96 overflow-auto">
            <img
              src={imageUrl}
              alt="Image preview"
              className="max-w-full max-h-80 object-contain rounded shadow-sm"
              loading="lazy"
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Image loaded directly via URL • Click "Raw URL" to view the string
          </div>
        </div>
      )}
    </div>
  );
};
