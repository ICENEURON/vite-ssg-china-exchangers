import languagesData from './languages.json';

// 从 JSON 文件推导出语言配置类型
export type LanguageConfig = {
  flag: string;
  name: string;
};

export type SupportedLanguage = keyof typeof languagesData;

export const languages: Record<SupportedLanguage, LanguageConfig> = languagesData;

// 导出语言代码数组，用于验证等
export const supportedLanguageCodes = Object.keys(languagesData) as SupportedLanguage[];

// 直接从 JSON 配置中获取支持的语言和默认语言
export const SUPPORTED_LANGUAGES = supportedLanguageCodes;
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'; // 可以改为从 languages.json 第一个
export const NON_DEFAULT_LANGUAGES = supportedLanguageCodes.filter(lang => lang !== DEFAULT_LANGUAGE);