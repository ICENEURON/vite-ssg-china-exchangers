import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { defaultNS, loadLocaleResource } from '../locales';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../locales/languages';
import { getLanguageFromPath } from '../utils/language-routing';

const isBrowser = () => typeof window !== 'undefined';
const languageLoadPromises = new Map<SupportedLanguage, Promise<void>>();

function isSupportedLanguage(language: string): language is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(language);
}

function normalizeLanguage(language: string): SupportedLanguage {
  return isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;
}

export function getLoadedTranslationResource(language: string) {
  return i18n.getResourceBundle(normalizeLanguage(language), defaultNS);
}

async function addLanguageResource(language: SupportedLanguage) {
  if (i18n.hasResourceBundle(language, defaultNS)) {
    return;
  }

  const existingLoadPromise = languageLoadPromises.get(language);

  if (existingLoadPromise) {
    await existingLoadPromise;
    return;
  }

  const loadPromise = loadLocaleResource(language)
    .then((resource) => {
      i18n.addResourceBundle(language, defaultNS, resource, true, true);
    })
    .finally(() => {
      languageLoadPromises.delete(language);
    });

  languageLoadPromises.set(language, loadPromise);
  await loadPromise;
}

export async function ensureLanguageResource(language: string) {
  const normalizedLanguage = normalizeLanguage(language);

  if (normalizedLanguage !== DEFAULT_LANGUAGE) {
    await addLanguageResource(DEFAULT_LANGUAGE);
  }

  await addLanguageResource(normalizedLanguage);
}

export async function syncLanguageToPathAsync(pathname: string) {
  const language = getLanguageFromPath(pathname);
  await ensureLanguageResource(language);
  return syncLanguageToPath(pathname);
}

export const getInitialLanguage = () => {
  if (isBrowser()) {
    return getLanguageFromPath(window.location.pathname);
  }

  if (typeof globalThis !== 'undefined' && globalThis.__SSR_PATHNAME__) {
    return getLanguageFromPath(globalThis.__SSR_PATHNAME__);
  }

  return DEFAULT_LANGUAGE;
};

export const syncLanguageToPath = (pathname: string) => {
  const language = getLanguageFromPath(pathname);

  if (i18n.language !== language) {
    i18n.changeLanguage(language);
  }

  if (isBrowser()) {
    window.__LANGUAGE__ = language;
    document.documentElement.lang = language;
  }

  return language;
};

i18n
  .use(initReactI18next)
  .init({
    resources: {},
    lng: getInitialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    ns: [defaultNS],
    defaultNS,
    initImmediate: false,
    react: {
      useSuspense: false,
    },

    interpolation: {
      escapeValue: false,
    },

    debug: false,

    saveMissing: true,
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      console.log(`[i18n] Missing Key: '${key}'`);
      console.log(`Language: '${lng}', Namespace: '${ns}'`);
      console.log(`Fallback: '${fallbackValue}'`);
    },
  });

export const changeLanguage = async (language: string) => {
  const normalizedLanguage = normalizeLanguage(language);
  await ensureLanguageResource(normalizedLanguage);
  i18n.changeLanguage(normalizedLanguage);

  if (isBrowser()) {
    localStorage.setItem('language', normalizedLanguage);
    window.__LANGUAGE__ = normalizedLanguage;
  }
};

export default i18n;
