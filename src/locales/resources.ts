import en from './en';
import zh from './zh';
import ja from './ja';

export const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
  ja: {
    translation: ja,
  },
} as const;

export const defaultNS = 'translation' as const;

export type Resources = typeof resources;
export type Locale = keyof Resources;