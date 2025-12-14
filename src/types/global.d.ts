// 全局类型声明
declare global {
  interface Window {
    __THEME__?: 'light' | 'dark';
    __LANGUAGE__?: string;
    __ENV__?: {
      DEFAULT_LANGUAGE: string;
      SUPPORTED_LANGUAGES: string;
      ENABLE_LANGUAGE_TOGGLE: string;
      ENABLE_THEME_TOGGLE: string;
    };
  }

  var __SSR_PATHNAME__: string | undefined;
}

export { };