// 全局类型声明
declare global {
  interface Window {
    __THEME__?: 'light' | 'dark';
    __LANGUAGE__?: string;
  }
  
  var __SSR_PATHNAME__: string | undefined;
}

export {};