import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
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

  // Add debouncing for rapid theme changes
  const themeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any pending theme changes
    if (themeTimeoutRef.current) {
      clearTimeout(themeTimeoutRef.current);
    }

    // Debounce theme application for better performance
    themeTimeoutRef.current = window.setTimeout(() => {
      const applyTheme = () => {
        // Apply theme to DOM elements
        applyThemeToDOM(isDarkMode);

        // Update scrollbar theme
        updateScrollbarTheme(isDarkMode);

        // Re-enable transitions and force scrollbar repaint
        enableTransitions(() => {
          forceScrollbarRepaint();
        });
      };

      // Use requestAnimationFrame for optimal timing
      window.requestAnimationFrame(applyTheme);
    }, 16); // ~1 frame delay for debouncing

    return () => {
      if (themeTimeoutRef.current) {
        clearTimeout(themeTimeoutRef.current);
      }
    };
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
