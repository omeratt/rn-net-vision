/**
 * Constants and utilities for field type detection
 */

export enum FieldType {
  JSON = 'json',
  COOKIES = 'cookies',
  HEADERS = 'headers',
  CODE = 'code',
  URL = 'url',
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
 * Detects the field type based on the label
 */
export const detectFieldType = (label: string, isCode?: boolean): FieldType => {
  const normalizedLabel = label.toLowerCase();

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
