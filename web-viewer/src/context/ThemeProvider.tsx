import { ComponentChildren, createContext } from 'preact';
import { useTheme } from '../hooks/useTheme';
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

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
