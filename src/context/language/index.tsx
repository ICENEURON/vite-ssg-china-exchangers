import { useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Head } from 'vite-react-ssg';
import { useCurrentLanguage } from '../../utils/language-routing';

// 全局类型声明 window.__LANGUAGE__
declare global {
  interface Window {
    __LANGUAGE__?: string;
  }
}

export function LanguageProvider() {
  const { i18n } = useTranslation();
  const currentLanguage = useCurrentLanguage();

  if (typeof window === 'undefined' && i18n.language !== currentLanguage) {
    i18n.changeLanguage(currentLanguage);
  }

  // 统一的语言设置函数
  const updateLanguage = useCallback((language: string) => {
    // 更新 i18n 语言
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    
    // 设置 HTML lang 属性（SSR 安全）
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    
    // 设置全局语言状态
    if (typeof window !== 'undefined') {
      window.__LANGUAGE__ = language;
    }
  }, [i18n]);

  // Keep i18n, document metadata, and persisted language in sync after render.
  useEffect(() => {
    updateLanguage(currentLanguage);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('language', currentLanguage);
    }
  }, [currentLanguage, updateLanguage]);

  return (
    <>
      <Head>
        <html lang={currentLanguage} />
      </Head>
      <Outlet />
    </>
  );
}