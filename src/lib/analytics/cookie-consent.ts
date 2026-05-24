import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import './cookie-consent.css';
import enCookie from '../../locales/en/components/cookie.json';
import esCookie from '../../locales/es/components/cookie.json';
import ruCookie from '../../locales/ru/components/cookie.json';
import zhCookie from '../../locales/zh/components/cookie.json';

const analyticsCategory = 'analytics';
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-077PBFJFEZ';
const cookieTranslations = {
  en: enCookie,
  es: esCookie,
  ru: ruCookie,
  zh: zhCookie,
} as const;

type CookieLanguage = keyof typeof cookieTranslations;

let gaLoaded = false;
let cookieConsentInitialized = false;
let learnMoreRoutingInitialized = false;

function getSiteHostname() {
  const configuredSiteUrl = import.meta.env.VITE_SITE_URL;

  if (configuredSiteUrl) {
    try {
      return new URL(configuredSiteUrl).hostname;
    } catch {
      // Fall back to the current host when the configured URL is malformed.
    }
  }

  return window.location.hostname;
}

function isCookieLanguage(language: string | undefined): language is CookieLanguage {
  return Boolean(language && language in cookieTranslations);
}

function getCurrentLanguage(): CookieLanguage {
  if (isCookieLanguage(window.__LANGUAGE__)) return window.__LANGUAGE__;

  const pathLanguage = window.location.pathname.replace(/^\//, '').split('/')[0];
  return isCookieLanguage(pathLanguage) ? pathLanguage : 'en';
}

function getLocalizedPath(language: CookieLanguage, path: string) {
  return language === 'en' ? path : `/${language}${path}`;
}

function getLocalizedPrivacyPath() {
  return getLocalizedPath(getCurrentLanguage(), '/privacy');
}

function interpolateLinks(text: string, language: CookieLanguage) {
  return text
    .replaceAll('{{privacyPath}}', getLocalizedPath(language, '/privacy'))
    .replaceAll('{{termsPath}}', getLocalizedPath(language, '/terms'));
}

function buildCookieTranslation(language: CookieLanguage, cookieDomainLabel: string) {
  const translation = cookieTranslations[language];
  const necessarySection = translation.preferencesModal.sections.necessary;
  const analyticsSection = translation.preferencesModal.sections.analytics;

  return {
    consentModal: {
      ...translation.consentModal,
      description: interpolateLinks(translation.consentModal.description, language),
    },
    preferencesModal: {
      title: translation.preferencesModal.title,
      acceptAllBtn: translation.preferencesModal.acceptAllBtn,
      acceptNecessaryBtn: translation.preferencesModal.acceptNecessaryBtn,
      savePreferencesBtn: translation.preferencesModal.savePreferencesBtn,
      closeIconLabel: translation.preferencesModal.closeIconLabel,
      sections: [
        {
          title: necessarySection.title,
          description: necessarySection.description,
          linkedCategory: 'necessary',
        },
        {
          title: analyticsSection.title,
          description: analyticsSection.description,
          linkedCategory: analyticsCategory,
          cookieTable: {
            headers: analyticsSection.tableHeaders,
            body: [
              {
                name: analyticsSection.tableBody.name,
                domain: cookieDomainLabel,
                desc: analyticsSection.tableBody.desc,
              },
            ],
          },
        },
      ],
    },
  };
}

function routeLearnMoreToPrivacy() {
  if (learnMoreRoutingInitialized) return;

  learnMoreRoutingInitialized = true;
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const learnMoreButton = target.closest(
        '#cc-main .cm [data-role="show"], [data-cc="show-preferencesModal"]',
      );

      if (!learnMoreButton) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      window.location.assign(getLocalizedPrivacyPath());
    },
    true,
  );
}

function initializeDataLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args) => {
    window.dataLayer?.push(args);
  });

  const hasConsentDefault = window.dataLayer.some(
    (entry) => Array.isArray(entry) && entry[0] === 'consent' && entry[1] === 'default',
  );

  if (hasConsentDefault) return;

  window.gtag('consent', 'default', {
    ad_personalization: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    analytics_storage: 'denied',
  });
}

function setAnalyticsConsent(granted: boolean) {
  window.gtag?.('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  });
}

function loadGa4() {
  if (!gaMeasurementId || gaLoaded) return;

  gaLoaded = true;
  window[`ga-disable-${gaMeasurementId}`] = false;

  const scriptUrl = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
  const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = scriptUrl;
    document.head.appendChild(script);
  }

  window.gtag?.('js', new Date());
  window.gtag?.('config', gaMeasurementId, {
    send_page_view: false,
  });
  trackPageView(window.location.pathname + window.location.search, document.title);
}

function disableGa4() {
  if (gaMeasurementId) {
    window[`ga-disable-${gaMeasurementId}`] = true;
  }
}

function syncAnalyticsState() {
  const analyticsAccepted = CookieConsent.acceptedCategory(analyticsCategory);

  setAnalyticsConsent(analyticsAccepted);

  if (analyticsAccepted) {
    loadGa4();
    return;
  }

  disableGa4();
}

export function initializeCookieConsent() {
  if (typeof window === 'undefined') return;

  initializeDataLayer();
  routeLearnMoreToPrivacy();

  const cookieDomainLabel = getSiteHostname();

  CookieConsent.run({
    mode: 'opt-in',
    cookie: {
      name: 'heatex_direct_cookie_consent',
      expiresAfterDays: 180,
      sameSite: 'Lax',
    },
    guiOptions: {
      consentModal: {
        layout: 'bar',
        position: 'bottom',
        equalWeightButtons: false,
        flipButtons: false,
      },
      preferencesModal: {
        layout: 'box',
        equalWeightButtons: true,
      },
    },
    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      [analyticsCategory]: {
        autoClear: {
          cookies: [
            { name: /^_ga/ },
            { name: '_gid' },
            { name: '_gat' },
          ],
        },
      },
    },
    language: {
      default: getCurrentLanguage(),
      autoDetect: 'document',
      translations: {
        en: buildCookieTranslation('en', cookieDomainLabel),
        es: buildCookieTranslation('es', cookieDomainLabel),
        ru: buildCookieTranslation('ru', cookieDomainLabel),
        zh: buildCookieTranslation('zh', cookieDomainLabel),
      },
    },
    onConsent: syncAnalyticsState,
    onChange: syncAnalyticsState,
  }).then(() => {
    cookieConsentInitialized = true;
    void syncCookieConsentLanguage(getCurrentLanguage());
  });
}

export async function syncCookieConsentLanguage(language: string) {
  if (!cookieConsentInitialized) return false;

  return CookieConsent.setLanguage(language, true);
}

export function trackPageView(path: string, title: string) {
  if (!gaMeasurementId || !gaLoaded || !CookieConsent.acceptedCategory(analyticsCategory)) return;

  window.gtag?.('event', 'page_view', {
    page_location: window.location.origin + path,
    page_path: path,
    page_title: title,
  });
}

export function showCookiePreferences() {
  CookieConsent.showPreferences();
}