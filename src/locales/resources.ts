import type { SupportedLanguage } from './languages';

export const defaultNS = 'translation' as const;

export type LocaleResource = typeof import('./en').default;
export type Resources = Record<SupportedLanguage, { translation: LocaleResource }>;
export type Locale = SupportedLanguage;

const localeResourceLoaders: Record<SupportedLanguage, () => Promise<{ default: LocaleResource }>> = {
  en: () => import('./en'),
  zh: () => import('./zh'),
  ru: () => import('./ru'),
  es: () => import('./es'),
  fr: () => import('./fr'),
  ar: () => import('./ar'),
};

export async function loadLocaleResource(language: SupportedLanguage): Promise<LocaleResource> {
  return (await localeResourceLoaders[language]()).default;
}
