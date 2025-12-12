import { useLocation } from 'react-router-dom';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../../locales';

export type Language = typeof SUPPORTED_LANGUAGES[number];

// 动态生成语言映射
const LANGUAGE_TO_PATH: Record<Language, string> = SUPPORTED_LANGUAGES.reduce((acc, lang) => {
  acc[lang] = lang === DEFAULT_LANGUAGE ? '' : lang;
  return acc;
}, {} as Record<Language, string>);

const PATH_TO_LANGUAGE: Record<string, Language> = Object.entries(LANGUAGE_TO_PATH).reduce((acc, [lang, path]) => {
  acc[path] = lang as Language;
  return acc;
}, {} as Record<string, Language>);

// 导出供其他地方使用
export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE };

// 从路径名提取语言信息的辅助函数
function extractLanguageInfo(pathname: string): { language: Language; remainingPath: string } {
  if (!pathname || typeof pathname !== 'string') {
    return { language: DEFAULT_LANGUAGE, remainingPath: pathname || '/' };
  }
  
  // 先检查精确匹配（如 /zh 或 /ja）
  const pathSegments = pathname.replace(/^\//, '').split('/');
  const firstSegment = pathSegments[0];
  
  if (PATH_TO_LANGUAGE[firstSegment]) {
    const language = PATH_TO_LANGUAGE[firstSegment];
    const remainingPath = pathSegments.slice(1).join('/');
    return { 
      language, 
      remainingPath: remainingPath ? `/${remainingPath}` : '/' 
    };
  }
  
  return { language: DEFAULT_LANGUAGE, remainingPath: pathname };
}

// 从URL路径获取语言
export function getLanguageFromPath(pathname: string): Language {
  return extractLanguageInfo(pathname).language;
}

// 获取去除语言前缀的路径
export function getPathWithoutLanguage(pathname: string): string {
  return extractLanguageInfo(pathname).remainingPath;
}

// 向路径添加语言前缀
export function addLanguageToPath(path: string, language: Language): string {
  const langPath = LANGUAGE_TO_PATH[language];
  
  if (!langPath) {
    return path; // 英语不需要前缀
  }
  
  // 特别处理根路径
  if (path === '/' || path === '') {
    return `/${langPath}`;
  }
  
  // 对于其他路径，添加语言前缀
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${langPath}${cleanPath}`;
}

// 从React Router获取当前语言
export function useCurrentLanguage(): Language {
  const location = useLocation();
  
  // 处理SSR情况，location可能未完全初始化
  if (!location || !location.pathname) {
    return DEFAULT_LANGUAGE;
  }
  
  return getLanguageFromPath(location.pathname);
}

// 为所有支持的语言生成路由
export function generateLocalizedRoutes<T extends { path: string }>(routes: T[]): T[] {
  const localizedRoutes: T[] = [];
  
  // 添加默认语言路由（无前缀）
  localizedRoutes.push(...routes);
  
  // 为所有非默认语言添加路由
  SUPPORTED_LANGUAGES.forEach(language => {
    if (language !== DEFAULT_LANGUAGE) {
      routes.forEach(route => {
        if (route.path !== '*') { // 不对通配符路由进行本地化
          localizedRoutes.push({
            ...route,
            path: addLanguageToPath(route.path, language)
          });
        }
      });
    }
  });
  
  return localizedRoutes;
}