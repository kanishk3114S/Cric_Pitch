import { createContext, useContext } from 'react';

export const ThemeContext = createContext({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {}
});

export function useTheme() {
  return useContext(ThemeContext);
}
