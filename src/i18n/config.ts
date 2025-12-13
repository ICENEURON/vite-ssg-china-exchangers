import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources, defaultNS } from '../locales';
import { getLanguageFromPath } from '../utils/language-routing';

const isBrowser = () => typeof window !== 'undefined';

// 从URL路径获取初始语言
const getInitialLanguage = () => {
  if (isBrowser()) {
    // 从当前URL路径获取语言
    const language = getLanguageFromPath(window.location.pathname);
    return language;
  }

  // 对于SSR，尝试从全局SSR上下文或路径名获取语言
  if (typeof globalThis !== 'undefined' && globalThis.__SSR_PATHNAME__) {
    return getLanguageFromPath(globalThis.__SSR_PATHNAME__);
  }

  // SSR默认使用英语
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    defaultNS,

    interpolation: {
      escapeValue: false, // React已经处理了XSS防护
    },

    // 禁用调试以减少控制台输出
    debug: false,

    saveMissing: true,
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      console.log(`[i18n] Missing Key: '${key}'`);
      console.log(`Language: '${lng}', Namespace: '${ns}'`);
      console.log(`Fallback: '${fallbackValue}'`);
    },
  });

// 语言切换函数
export const changeLanguage = (language: string) => {
  i18n.changeLanguage(language);
  if (isBrowser()) {
    localStorage.setItem('language', language);
    // 更新全局状态
    window.__LANGUAGE__ = language;
  }
};

export default i18n;