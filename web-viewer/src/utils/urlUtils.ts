/**
 * Utility functions for URL parsing and formatting
 */

export const getDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return url.split('/')[0];
  }
};

export const getPath = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname + urlObj.search;
  } catch (e) {
    const parts = url.split('/');
    return parts.slice(1).join('/');
  }
};
