/**
 * JSON utility functions for formatting and validation
 */

export interface JsonValidationResult {
  isValid: boolean;
  formatted?: string;
  error?: string;
}

/**
 * Validates and formats JSON string with consistent indentation
 */
export const validateAndFormatJson = (str: string): JsonValidationResult => {
  try {
    const parsed = JSON.parse(str);
    return {
      isValid: true,
      formatted: JSON.stringify(parsed, null, 2),
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    };
  }
};

/**
 * Applies syntax highlighting to JSON string using regex-based approach
 */
export const highlightJson = (jsonStr: string): string => {
  return (
    jsonStr
      // Property names: "property": (capture the entire match including quotes and colon)
      .replace(
        /"([^"]+)"(\s*:)/g,
        '<span class="text-blue-600 dark:text-blue-400">"$1"</span>$2'
      )
      // String values: : "value" (but not property names already captured above)
      .replace(
        /(:)\s*"([^"]*)"/g,
        '$1 <span class="text-green-600 dark:text-green-400">"$2"</span>'
      )
      // Numbers: whole numbers, decimals, scientific notation
      .replace(
        /(:)\s*(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
        '$1 <span class="text-orange-600 dark:text-orange-400">$2</span>'
      )
      // Booleans and null
      .replace(
        /(:)\s*(true|false|null)/g,
        '$1 <span class="text-purple-600 dark:text-purple-400">$2</span>'
      )
      // Structural characters: {, }, [, ], ,
      .replace(
        /([{}[\],])/g,
        '<span class="text-gray-500 dark:text-gray-500 font-bold">$1</span>'
      )
  );
};

/**
 * Checks if a string is likely to be JSON based on content analysis
 */
export const isLikelyJson = (str: string): boolean => {
  const trimmed = str.trim();
  return (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  );
};
