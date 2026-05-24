import en from './en';
import zh from './zh';
import ru from './ru';

export const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
  ru: {
    translation: ru,
  },
} as const;

export const defaultNS = 'translation' as const;

export type Resources = typeof resources;
export type Locale = keyof Resources;
