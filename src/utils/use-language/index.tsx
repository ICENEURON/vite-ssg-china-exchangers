import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

const isBrowser = () => typeof window !== 'undefined';

export function useLanguage() {
  const { i18n } = useTranslation();

  const changeLanguage = useCallback((lang: string) => {
    // 如果已经是当前语言则避免重复切换
    if (i18n.language === lang) {
      return;
    }

    i18n.changeLanguage(lang);
    if (isBrowser()) {
      localStorage.setItem('language', lang);
      // 更新全局状态
      window.__LANGUAGE__ = lang;
    }
  }, [i18n]);

  return {
    currentLanguage: i18n.language,
    changeLanguage
  };
}