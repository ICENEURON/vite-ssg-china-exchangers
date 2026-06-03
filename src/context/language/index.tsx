import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Head } from 'vite-react-ssg';
import { defaultNS } from '../../locales';
import { ensureLanguageResource } from '../../i18n/config';
import { useCurrentLanguage } from '../../utils/language-routing';

declare global {
  interface Window {
    __LANGUAGE__?: string;
  }
}

export function LanguageProvider() {
  const { i18n } = useTranslation();
  const currentLanguage = useCurrentLanguage();
  const [readyLanguage, setReadyLanguage] = useState<string | null>(() => (
    i18n.hasResourceBundle(currentLanguage, defaultNS) ? currentLanguage : null
  ));

  if (typeof window === 'undefined' && i18n.language !== currentLanguage) {
    i18n.changeLanguage(currentLanguage);
  }

  const updateLanguage = useCallback((language: string) => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }

    if (typeof window !== 'undefined') {
      window.__LANGUAGE__ = language;
    }
  }, [i18n]);

  useEffect(() => {
    let isCancelled = false;

    if (!i18n.hasResourceBundle(currentLanguage, defaultNS)) {
      setReadyLanguage(null);
    }

    void ensureLanguageResource(currentLanguage).then(() => {
      if (isCancelled) return;

      updateLanguage(currentLanguage);
      setReadyLanguage(currentLanguage);

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('language', currentLanguage);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [currentLanguage, i18n, updateLanguage]);

  if (typeof window !== 'undefined' && readyLanguage !== currentLanguage) {
    return null;
  }

  return (
    <>
      <Head>
        <html lang={currentLanguage} />
      </Head>
      <Outlet />
    </>
  );
}
