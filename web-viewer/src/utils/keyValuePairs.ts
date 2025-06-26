/**
 * Utility functions for formatting key-value pairs like cookies and headers
 */

export interface KeyValuePair {
  name: string;
  value: string;
}

export type KeyValueType = 'cookies' | 'headers';

/**
 * Parses a string into key-value pairs based on the specified type
 */
export const parseKeyValuePairs = (
  dataString: string,
  type: KeyValueType
): KeyValuePair[] => {
  if (!dataString.trim()) {
    return [];
  }

  let pairs: KeyValuePair[] = [];

  if (type === 'cookies') {
    pairs = dataString
      .split(';')
      .map((cookie) => {
        const [name, ...valueParts] = cookie.trim().split('=');
        const value = valueParts.join('=');
        return { name: name?.trim() || '', value: value?.trim() || '' };
      })
      .filter((cookie) => cookie.name);
  } else {
    // For headers, assume they're in key: value format
    pairs = dataString
      .split('\n')
      .map((header) => {
        const [name, ...valueParts] = header.trim().split(':');
        const value = valueParts.join(':').trim();
        return { name: name?.trim() || '', value: value || '' };
      })
      .filter((header) => header.name);
  }

  return pairs;
};

/**
 * Gets the display label for a key-value type
 */
export const getKeyValueTypeLabel = (type: KeyValueType): string => {
  return type.toUpperCase();
};
