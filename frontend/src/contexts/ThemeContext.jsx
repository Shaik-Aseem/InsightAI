import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem('insightai_theme') || 'dark');
  const [accentColor, setAccentColorState] = useState(() => localStorage.getItem('insightai_accent') || 'cyan');
  
  // System preference
  const [systemIsDark, setSystemIsDark] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(mediaQuery.matches);

    const handler = (e) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const resolvedTheme = useMemo(() => {
    if (theme === 'system') return systemIsDark ? 'dark' : 'light';
    return theme;
  }, [theme, systemIsDark]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accentColor);
  }, [accentColor]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('insightai_theme', newTheme);
  };

  const setAccentColor = (newColor) => {
    setAccentColorState(newColor);
    localStorage.setItem('insightai_accent', newColor);
  };

  const value = {
    theme,
    accentColor,
    resolvedTheme,
    setTheme,
    setAccentColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
