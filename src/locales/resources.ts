import en from './en';
import zh from './zh';
import ru from './ru';
import es from './es';

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
  es: {
    translation: es,
  },
} as const;

export const defaultNS = 'translation' as const;

export type Resources = typeof resources;
export type Locale = keyof Resources;
