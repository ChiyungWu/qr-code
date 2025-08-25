import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useSwitchTheme() {
  const { t } = useTranslation();
  const [webTheme, setWebTheme] = useState(
    localStorage.getItem('webTheme') || 'dark'
  );

  const toggleWebTheme = () => {
    const nextTheme = webTheme === 'dark' ? 'light' : 'dark';
    setWebTheme(nextTheme);
    if (nextTheme === 'dark') {
      toast.success(t('toast.themeDark'));
    } else {
      toast.success(t('toast.themeLight'));
    }
  };

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(webTheme);
    localStorage.setItem('webTheme', webTheme);
  }, [webTheme]);

  return { webTheme, toggleWebTheme };
}
