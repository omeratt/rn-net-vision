/** @jsxImportSource preact */
import { VNode } from 'preact';
import { useState, useEffect } from 'preact/hooks';

interface SvgViewerProps {
  value: string;
  className?: string;
}

/**
 * Validates if a string is a valid SVG XML
 */
const isValidSvg = (xmlString: string): boolean => {
  try {
    // Check if it contains SVG tags
    if (!xmlString.trim().toLowerCase().includes('<svg')) {
      return false;
    }

    // Try to parse as XML
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'image/svg+xml');

    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      return false;
    }

    // Check if it has an SVG root element
    const svgElement = doc.querySelector('svg');
    return svgElement !== null;
  } catch (error) {
    return false;
  }
};

/**
 * Sanitizes SVG content by removing potentially dangerous elements and attributes
 */
const sanitizeSvg = (svgString: string): string => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) {
      return svgString;
    }

    // Remove script elements
    const scripts = svgElement.querySelectorAll('script');
    scripts.forEach((script) => script.remove());

    // Remove event handlers (attributes starting with 'on')
    const allElements = svgElement.querySelectorAll('*');
    allElements.forEach((element) => {
      Array.from(element.attributes).forEach((attr) => {
        if (attr.name.toLowerCase().startsWith('on')) {
          element.removeAttribute(attr.name);
        }
      });
    });

    // Remove href attributes that could be dangerous
    const elementsWithHref = svgElement.querySelectorAll(
      '[href], [xlink\\:href]'
    );
    elementsWithHref.forEach((element) => {
      const href =
        element.getAttribute('href') || element.getAttribute('xlink:href');
      if (href && !href.startsWith('#')) {
        element.removeAttribute('href');
        element.removeAttribute('xlink:href');
      }
    });

    return new XMLSerializer().serializeToString(doc);
  } catch (error) {
    return svgString;
  }
};

export const SvgViewer = ({ value, className = '' }: SvgViewerProps): VNode => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [sanitizedSvg, setSanitizedSvg] = useState<string>('');
  const [showRaw, setShowRaw] = useState<boolean>(false);

  useEffect(() => {
    const valid = isValidSvg(value);
    setIsValid(valid);

    if (valid) {
      const sanitized = sanitizeSvg(value);
      setSanitizedSvg(sanitized);
    }
  }, [value]);

  if (!isValid) {
    // If not valid SVG, render as regular code
    return (
      <div
        className={`font-mono text-sm whitespace-pre-wrap break-words ${className}`}
      >
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded border">
          {value}
        </div>
      </div>
    );
  }

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
          SVG Preview
        </button>
        <button
          onClick={() => setShowRaw(true)}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            showRaw
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Raw XML
        </button>
      </div>

      {showRaw ? (
        /* Raw XML view */
        <div className="font-mono text-sm whitespace-pre-wrap break-words">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded border max-h-96 overflow-auto">
            {value}
          </div>
        </div>
      ) : (
        /* SVG preview */
        <div className="space-y-2">
          <div className="bg-white dark:bg-gray-800/30 p-4 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center min-h-[100px] max-h-96 overflow-auto">
            <div
              className="max-w-full max-h-full"
              dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            SVG rendered above • Click "Raw XML" to see the source code
          </div>
        </div>
      )}
    </div>
  );
};
