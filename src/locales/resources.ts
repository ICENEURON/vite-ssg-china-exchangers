import en from './en';
import zh from './zh';

export const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
} as const;

export const defaultNS = 'translation' as const;

export type Resources = typeof resources;
export type Locale = keyof Resources;