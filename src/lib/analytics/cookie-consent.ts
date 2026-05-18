import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import './cookie-consent.css';

const analyticsCategory = 'analytics';
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-077PBFJFEZ';

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

function getCurrentLanguage() {
  return window.__LANGUAGE__ === 'zh' || window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
}

function getLocalizedPrivacyPath() {
  return getCurrentLanguage() === 'zh' ? '/zh/privacy' : '/privacy';
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
        flipButtons: true,
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
        en: {
          consentModal: {
            title: 'Cookie Policy',
            description: 'HeatEx Direct uses cookies to operate the website and understand site usage. By using this site and selecting Accept Terms, you agree to our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Use</a>.',
            acceptAllBtn: 'Accept Terms',
            showPreferencesBtn: 'Learn More',
            closeIconLabel: 'Close',
          },
          preferencesModal: {
            title: 'Cookie preferences',
            acceptAllBtn: 'Accept all',
            savePreferencesBtn: 'Save',
            closeIconLabel: 'Close',
            sections: [
              {
                title: 'Necessary cookies',
                description: 'Required for core site features and remembering your cookie choice.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Analytics cookies',
                description: 'Helps us understand how visitors use the site so we can improve content and navigation.',
                linkedCategory: analyticsCategory,
                cookieTable: {
                  headers: {
                    name: 'Cookie',
                    domain: 'Domain',
                    desc: 'Purpose',
                  },
                  body: [
                    {
                      name: '_ga, _ga_*',
                      domain: cookieDomainLabel,
                      desc: 'Measures site usage when analytics is accepted.',
                    },
                  ],
                },
              },
            ],
          },
        },
        zh: {
          consentModal: {
            title: 'Cookie 政策',
            description: 'HeatEx Direct 使用 Cookie 来运行网站并了解网站使用情况。当你使用本网站并选择接受条款时，即表示你同意我们的 <a href="/zh/privacy">隐私政策</a> 和 <a href="/zh/terms">使用条款</a>。',
            acceptAllBtn: '接受条款',
            showPreferencesBtn: '了解更多',
            closeIconLabel: '关闭',
          },
          preferencesModal: {
            title: 'Cookie 偏好设置',
            acceptAllBtn: '全部同意',
            savePreferencesBtn: '保存',
            closeIconLabel: '关闭',
            sections: [
              {
                title: '必要 Cookie',
                description: '用于网站核心功能，并记住你的 Cookie 选择。',
                linkedCategory: 'necessary',
              },
              {
                title: '分析 Cookie',
                description: '帮助我们了解访客如何使用网站，以改进内容和导航。',
                linkedCategory: analyticsCategory,
                cookieTable: {
                  headers: {
                    name: 'Cookie',
                    domain: '域名',
                    desc: '用途',
                  },
                  body: [
                    {
                      name: '_ga, _ga_*',
                      domain: cookieDomainLabel,
                      desc: '在你同意分析后，用于衡量网站使用情况。',
                    },
                  ],
                },
              },
            ],
          },
        },
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