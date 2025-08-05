/**
 * DOM utilities for theme management
 */

/**
 * Applies dark mode class to HTML elements and handles transitions
 */
export const applyThemeToDOM = (isDarkMode: boolean): void => {
  const html = document.documentElement;
  const body = document.body;

  // Always use performance mode for better consistency
  html.classList.add('performance-mode');

  // Temporarily disable transitions to prevent flash
  html.classList.add('theme-transitioning');

  // Apply dark mode class to both html and body
  html.classList.toggle('dark', isDarkMode);
  body.classList.toggle('dark', isDarkMode);

  // Force multiple reflows to ensure proper application
  html.offsetHeight;
  body.offsetHeight;
};

/**
 * Re-enables transitions after theme change with optimized timing
 */
export const enableTransitions = (callback?: () => void): number => {
  return window.setTimeout(() => {
    const html = document.documentElement;

    // Remove theme-transitioning first
    html.classList.remove('theme-transitioning');

    // Wait a bit more before removing performance mode
    window.setTimeout(() => {
      html.classList.remove('performance-mode');

      // Allow elements to settle before any callback
      if (callback) {
        window.requestAnimationFrame(callback);
      }
    }, 100); // Additional delay for performance mode
  }, 100); // Keep theme-transitioning for longer
};
