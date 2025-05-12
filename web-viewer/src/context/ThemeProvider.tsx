import { ComponentChildren, createContext } from 'preact';
import { useTheme } from '../hooks/useTheme';
import { useEffect } from 'preact/hooks';
import type { ThemeContextType } from '../types';

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

interface ThemeProviderProps {
  children: ComponentChildren;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useTheme();

  useEffect(() => {
    // Apply dark mode class to html element
    document.documentElement.classList.toggle('dark', theme.isDarkMode);
  }, [theme.isDarkMode]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
