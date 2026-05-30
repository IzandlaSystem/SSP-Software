'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark' | 'performance';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Safe check for localStorage on mount
    try {
      const savedTheme = localStorage.getItem('ssp-theme') as Theme;
      if (savedTheme && ['light', 'dark', 'performance'].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
    } catch (e) {
      console.warn('Unable to access localStorage on mount:', e);
    }
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('ssp-theme', newTheme);
    } catch (e) {
      console.warn('LocalStorage is disabled or unavailable:', e);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    
    // Remove both helper classes
    root.classList.remove('dark', 'performance');
    
    // Add appropriate theme class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'performance') {
      root.classList.add('performance');
    }
    
    // Set theme custom attribute
    root.setAttribute('data-theme', theme);
  }, [theme, mounted]);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
