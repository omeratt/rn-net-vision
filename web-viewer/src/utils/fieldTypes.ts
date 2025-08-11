/**
 * Constants and utilities for field type detection
 */

export enum FieldType {
  JSON = 'json',
  COOKIES = 'cookies',
  HEADERS = 'headers',
  CODE = 'code',
  URL = 'url',
  SVG = 'svg',
  IMAGE = 'image',
  TEXT = 'text',
}

/**
 * Field type detection keywords
 */
const FIELD_TYPE_KEYWORDS = {
  [FieldType.JSON]: ['json', 'body'],
  [FieldType.COOKIES]: ['cookie'],
  [FieldType.HEADERS]: ['header'],
  [FieldType.URL]: ['url'],
} as const;

/**
 * Detects if content is SVG XML
 */
const isSvgContent = (value: string): boolean => {
  if (!value || typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  return (
    trimmed.toLowerCase().includes('<svg') &&
    (trimmed.startsWith('<') || trimmed.startsWith('<?xml'))
  );
};

/**
 * Detects the field type based on the label and content
 */
export const detectFieldType = (
  label: string,
  isCode?: boolean,
  value?: string
): FieldType => {
  const normalizedLabel = label.toLowerCase();

  // Image URL detection (prioritize before JSON/body keyword check)
  if (value && typeof value === 'string' && normalizedLabel.includes('body')) {
    // Accept common raster image extensions, allow query/hash suffix
    const imageRegex =
      /(https?:\/\/[^\s]+\.(?:png|jpe?g|gif|webp|bmp|avif|ico))(?:[?#][^\s]*)?$/i;
    if (imageRegex.test(value.trim())) {
      return FieldType.IMAGE;
    }
  }

  // Check for SVG content first (regardless of label)
  if (value && isSvgContent(value)) {
    return FieldType.SVG;
  }

  // Check for specific field types
  for (const [fieldType, keywords] of Object.entries(FIELD_TYPE_KEYWORDS)) {
    if (keywords.some((keyword) => normalizedLabel.includes(keyword))) {
      return fieldType as FieldType;
    }
  }

  // Fallback to code or text
  return isCode ? FieldType.CODE : FieldType.TEXT;
};

/**
 * Checks if a field represents an error
 */
export const isErrorField = (label: string): boolean => {
  return label.toLowerCase().includes('error');
};
