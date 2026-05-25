import en from './en';
import zh from './zh';
import ru from './ru';
import es from './es';
import fr from './fr';
import ar from './ar';

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
  fr: {
    translation: fr,
  },
  ar: {
    translation: ar,
  },
} as const;

export const defaultNS = 'translation' as const;

export type Resources = typeof resources;
export type Locale = keyof Resources;
