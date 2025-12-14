// 初始状态工具函数
export function getInitialTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined') {
    // 首先尝试使用index.html中脚本设置的全局状态
    if (window.__THEME__) {
      return window.__THEME__;
    }
    // 回退到直接读取localStorage
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    } catch {
      // 忽略localStorage错误
    }
    // 回退到系统偏好设置
    try {
      const enableThemeToggle = (window.__ENV__ && window.__ENV__.ENABLE_THEME_TOGGLE) !== 'false';
      if (enableThemeToggle && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // 忽略matchMedia错误
    }
  }
  return 'light';
}

export function getInitialLanguage(): string {
  if (typeof window !== 'undefined' && window.__LANGUAGE__) {
    return window.__LANGUAGE__;
  }
  return 'en';
}