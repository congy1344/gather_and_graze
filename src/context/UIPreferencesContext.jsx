/** Persistent language and color-theme preferences. */
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { labelKeys, translations } from '../data/translations';
import { useLocalStorage } from '../hooks/useLocalStorage';

const UIPreferencesContext = createContext(null);

export function UIPreferencesProvider({ children }) {
  const [language, setLanguage] = useLocalStorage('gather:language', 'en');
  const [theme, setTheme] = useLocalStorage('gather:theme', 'light');
  const t = useCallback((key) => translations[language][key] || key, [language]);
  const label = useCallback((value) => t(labelKeys[value] || value), [t]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111714' : '#f2f4f3');
  }, [theme, language]);

  const toggleLanguage = useCallback(() => setLanguage((value) => value === 'en' ? 'vi' : 'en'), [setLanguage]);
  const toggleTheme = useCallback(() => setTheme((value) => value === 'light' ? 'dark' : 'light'), [setTheme]);
  const value = useMemo(() => ({ language, theme, t, label, toggleLanguage, toggleTheme }), [language, theme, t, label, toggleLanguage, toggleTheme]);
  return <UIPreferencesContext.Provider value={value}>{children}</UIPreferencesContext.Provider>;
}

export function useUI() {
  const context = useContext(UIPreferencesContext);
  if (!context) throw new Error('useUI must be used inside UIPreferencesProvider');
  return context;
}
