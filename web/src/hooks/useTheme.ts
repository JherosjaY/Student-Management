import { useState, useEffect } from 'react';
import { UI_CONFIG, getTheme, setTheme } from '../config/ui';

type Theme = 'light' | 'dark' | 'auto';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(getTheme() as Theme);

  useEffect(() => {
    const storedTheme = getTheme() as Theme;
    setThemeState(storedTheme);
    
    // Apply theme to document
    applyTheme(storedTheme);
  }, []);

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    setThemeState(nextTheme);
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const setThemeMode = (newTheme: Theme) => {
    setThemeState(newTheme);
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return {
    theme,
    isDark: theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches),
    toggleTheme,
    setThemeMode,
  };
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
};