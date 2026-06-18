import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ensureLanguageResource } from '../../i18n/config';

const isBrowser = () => typeof window !== 'undefined';

export function useLanguage() {
  const { i18n } = useTranslation();

  const changeLanguage = useCallback(async (lang: string) => {
    if (i18n.language === lang) {
      return;
    }

    await ensureLanguageResource(lang);
    i18n.changeLanguage(lang);

    if (isBrowser()) {
      localStorage.setItem('language', lang);
      window.__LANGUAGE__ = lang;
    }
  }, [i18n]);

  return {
    currentLanguage: i18n.language,
    changeLanguage,
  };
}
