import { useState, useEffect, useCallback } from 'preact/hooks';
import {
  updateScrollbarTheme,
  forceScrollbarRepaint,
  applyThemeToDOM,
  enableTransitions,
} from '../utils';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      return stored === 'true';
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Apply theme to DOM elements
    applyThemeToDOM(isDarkMode);

    // Update scrollbar theme
    updateScrollbarTheme(isDarkMode);

    // Re-enable transitions and force scrollbar repaint
    const timeoutId = enableTransitions(() => {
      forceScrollbarRepaint();
    });

    return () => clearTimeout(timeoutId);
  }, [isDarkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('darkMode', String(next));

      // Add a subtle haptic feedback if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }

      return next;
    });
  }, []);

  return { isDarkMode, toggleDarkMode };
};
