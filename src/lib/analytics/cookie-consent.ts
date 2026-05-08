import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import './cookie-consent.css';

const analyticsCategory = 'analytics';
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

let gaLoaded = false;
let cookieConsentInitialized = false;

function getCurrentLanguage() {
  return window.__LANGUAGE__ === 'zh' || window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
}

function initializeDataLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args) => {
    window.dataLayer?.push(args);
  };

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

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
  document.head.appendChild(script);

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

  CookieConsent.run({
    mode: 'opt-in',
    cookie: {
      name: 'heatex_direct_cookie_consent',
      expiresAfterDays: 180,
      sameSite: 'Lax',
    },
    guiOptions: {
      consentModal: {
        layout: 'box',
        position: 'bottom right',
        equalWeightButtons: true,
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
            title: 'Cookie preferences',
            description: 'We use necessary cookies and, with your permission, analytics cookies to improve the site.',
            acceptAllBtn: 'Accept',
            acceptNecessaryBtn: 'Reject',
            showPreferencesBtn: 'Manage',
            footer: '<a href="/privacy">Privacy Policy</a>',
          },
          preferencesModal: {
            title: 'Cookie preferences',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
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
                      domain: 'heatexdirect.com',
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
            title: 'Cookie 偏好设置',
            description: '我们使用必要 Cookie，并在你同意后使用分析 Cookie 改进网站。',
            acceptAllBtn: '同意',
            acceptNecessaryBtn: '拒绝',
            showPreferencesBtn: '管理',
            footer: '<a href="/zh/privacy">隐私政策</a>',
          },
          preferencesModal: {
            title: 'Cookie 偏好设置',
            acceptAllBtn: '全部同意',
            acceptNecessaryBtn: '全部拒绝',
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
                      domain: 'heatexdirect.com',
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