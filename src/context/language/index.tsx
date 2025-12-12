import { useEffect, useMemo, useCallback } from 'react';
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

  // 在渲染期间立即初始化语言以防止闪烁
  useMemo(() => {
    updateLanguage(currentLanguage);
  }, [currentLanguage, updateLanguage]);

  // 处理持久化存储（仅在客户端）
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('language', currentLanguage);
    }
  }, [currentLanguage]);

  return (
    <>
      <Head>
        <html lang={currentLanguage} />
      </Head>
      <Outlet />
    </>
  );
}