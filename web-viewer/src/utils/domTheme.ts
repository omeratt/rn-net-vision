/**
 * DOM utilities for theme management
 */

/**
 * Applies dark mode class to HTML elements and handles transitions
 */
export const applyThemeToDOM = (isDarkMode: boolean): void => {
  const html = document.documentElement;

  // Temporarily disable transitions to prevent flash
  html.classList.add('theme-transitioning');

  // Apply dark mode class to both html and body
  html.classList.toggle('dark', isDarkMode);
  document.body.classList.toggle('dark', isDarkMode);
};

/**
 * Re-enables transitions after theme change
 */
export const enableTransitions = (callback?: () => void): number => {
  return window.setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning');
    callback?.();
  }, 100);
};
