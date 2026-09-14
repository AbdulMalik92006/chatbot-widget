import { useEffect, useState } from 'react';

/**
 * Resolves the widget's active theme ('light' | 'dark').
 *
 * configTheme: 'auto' | 'light' | 'dark'
 *   - 'auto' follows the OS/browser prefers-color-scheme and updates live.
 *   - 'light' / 'dark' pin the theme regardless of system setting.
 *
 * Also returns a manual override setter so the header's toggle button
 * can let a visitor flip the theme for this session.
 */
export function useTheme(configTheme = 'auto') {
  const getSystemTheme = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  const [manualOverride, setManualOverride] = useState(null);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemTheme(e.matches ? 'dark' : 'light');
    mql.addEventListener?.('change', handler);
    return () => mql.removeEventListener?.('change', handler);
  }, []);

  const baseTheme =
    configTheme === 'auto' ? systemTheme : configTheme === 'dark' ? 'dark' : 'light';

  const theme = manualOverride ?? baseTheme;

  const toggleTheme = () => {
    setManualOverride(theme === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
}
