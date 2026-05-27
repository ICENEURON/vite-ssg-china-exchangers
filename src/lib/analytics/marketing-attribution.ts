const ATTRIBUTION_STORAGE_KEY = 'heatex_direct_session_marketing_attribution';
const VISITOR_ID_STORAGE_KEY = 'heatex_direct_visitor_id';
const RFQ_DRAFT_ID_STORAGE_KEY = 'heatex_direct_rfq_draft_id';

const TRACKED_QUERY_KEYS = ['utm_source'] as const;

type TrackedQueryKey = typeof TRACKED_QUERY_KEYS[number];

export type MarketingTouchpoint = {
  capturedAt: string;
  landingPage: string;
  referrer: string | null;
  source: string;
  sourceDomain: string | null;
  query: Partial<Record<TrackedQueryKey, string>>;
};

export type MarketingAttribution = {
  visitorId: string | null;
  firstTouch: MarketingTouchpoint | null;
  lastTouch: MarketingTouchpoint | null;
};

export type MarketingAttributionPayload = {
  utm_source: string | null;
  source_url: string | null;
  landing_page: string | null;
};

function isBrowser() {
  return typeof window !== 'undefined';
}

function readStoredAttribution(): MarketingAttribution {
  if (!isBrowser()) return { visitorId: null, firstTouch: null, lastTouch: null };

  try {
    const storedValue = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!storedValue) {
      return {
        visitorId: getOrCreateVisitorId(),
        firstTouch: null,
        lastTouch: null,
      };
    }

    const parsed = JSON.parse(storedValue) as Partial<MarketingAttribution>;

    return {
      visitorId: getOrCreateVisitorId(),
      firstTouch: parsed.firstTouch || null,
      lastTouch: parsed.lastTouch || null,
    };
  } catch {
    return {
      visitorId: getOrCreateVisitorId(),
      firstTouch: null,
      lastTouch: null,
    };
  }
}

function writeStoredAttribution(value: MarketingAttribution) {
  if (!isBrowser()) return;

  try {
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Attribution is useful for reporting, but it should never block browsing.
  }
}

function extractTrackedQuery(search: string) {
  const params = new URLSearchParams(search);

  return TRACKED_QUERY_KEYS.reduce<MarketingTouchpoint['query']>((query, key) => {
    const value = params.get(key);
    if (value) query[key] = value;
    return query;
  }, {});
}

function hasTrackedQuery(query: MarketingTouchpoint['query']) {
  return Object.keys(query).length > 0;
}

function createStableId(prefix: string) {
  const randomValue = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${randomValue}`;
}

function readStorageValue(storage: Storage, key: string) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageValue(storage: Storage, key: string, value: string) {
  try {
    storage.setItem(key, value);
  } catch {
    // Browser storage can be unavailable in private modes. Attribution should not block the RFQ flow.
  }
}

function removeStorageValue(storage: Storage, key: string) {
  try {
    storage.removeItem(key);
  } catch {
    // No-op.
  }
}

export function getOrCreateVisitorId() {
  if (!isBrowser()) return null;

  const existingVisitorId = readStorageValue(window.localStorage, VISITOR_ID_STORAGE_KEY);
  if (existingVisitorId) return existingVisitorId;

  const visitorId = createStableId('visitor');
  writeStorageValue(window.localStorage, VISITOR_ID_STORAGE_KEY, visitorId);
  return visitorId;
}

export function getOrCreateRfqDraftId() {
  if (!isBrowser()) return null;

  const existingDraftId =
    readStorageValue(window.sessionStorage, RFQ_DRAFT_ID_STORAGE_KEY) ||
    readStorageValue(window.localStorage, RFQ_DRAFT_ID_STORAGE_KEY);

  if (existingDraftId) return existingDraftId;

  const draftId = createStableId('rfq_draft');
  writeStorageValue(window.sessionStorage, RFQ_DRAFT_ID_STORAGE_KEY, draftId);
  writeStorageValue(window.localStorage, RFQ_DRAFT_ID_STORAGE_KEY, draftId);
  return draftId;
}

export function clearRfqDraftId() {
  if (!isBrowser()) return;

  removeStorageValue(window.sessionStorage, RFQ_DRAFT_ID_STORAGE_KEY);
  removeStorageValue(window.localStorage, RFQ_DRAFT_ID_STORAGE_KEY);
}

function getHostname(value: string | null) {
  if (!value) return null;

  try {
    return new URL(value).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

function normalizeSource(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9_./-]+/g, '_');
}

function inferTouchpointSource(query: MarketingTouchpoint['query'], referrer: string | null) {
  const referrerHost = getHostname(referrer);

  if (query.utm_source) {
    return {
      source: normalizeSource(query.utm_source),
      sourceDomain: referrerHost,
    };
  }

  if (referrerHost?.includes('linkedin.')) {
    return { source: 'linkedin', sourceDomain: referrerHost };
  }

  if (referrerHost?.includes('facebook.') || referrerHost?.includes('instagram.')) {
    return { source: 'meta', sourceDomain: referrerHost };
  }

  if (referrerHost?.includes('reddit.')) {
    return { source: 'reddit', sourceDomain: referrerHost };
  }

  if (referrerHost?.includes('google.')) {
    return { source: 'google_organic', sourceDomain: referrerHost };
  }

  if (referrerHost?.includes('bing.') || referrerHost?.includes('duckduckgo.') || referrerHost?.includes('yahoo.')) {
    return { source: 'organic_search', sourceDomain: referrerHost };
  }

  if (referrerHost) {
    return { source: 'referral', sourceDomain: referrerHost };
  }

  return { source: 'direct', sourceDomain: null };
}

function getCurrentTouchpoint(pathname: string, search: string): MarketingTouchpoint {
  const landingPage = `${pathname}${search}`;
  const query = extractTrackedQuery(search);
  const referrer = isBrowser() && document.referrer ? document.referrer : null;
  const source = inferTouchpointSource(query, referrer);

  return {
    capturedAt: new Date().toISOString(),
    landingPage,
    referrer,
    ...source,
    query,
  };
}

export function captureMarketingAttribution(pathname: string, search: string) {
  if (!isBrowser()) return;

  getOrCreateVisitorId();

  const touchpoint = getCurrentTouchpoint(pathname, search);
  const referrerHost = getHostname(touchpoint.referrer);
  const hasExternalReferrer = Boolean(referrerHost && referrerHost !== window.location.hostname.replace(/^www\./, '').toLowerCase());
  const storedAttribution = readStoredAttribution();
  const shouldUpdateLastTouch = !storedAttribution.lastTouch || hasTrackedQuery(touchpoint.query) || hasExternalReferrer;
  const nextAttribution: MarketingAttribution = {
    visitorId: storedAttribution.visitorId,
    firstTouch: storedAttribution.firstTouch || touchpoint,
    lastTouch: shouldUpdateLastTouch ? touchpoint : storedAttribution.lastTouch,
  };

  writeStoredAttribution(nextAttribution);
}

export function getMarketingAttribution() {
  return readStoredAttribution();
}

export function getMarketingAttributionPayload(sourceUrl: string | null, fallbackLandingPage: string | null = null): MarketingAttributionPayload {
  const attribution = getMarketingAttribution();

  return {
    utm_source: attribution.firstTouch?.query.utm_source || attribution.lastTouch?.query.utm_source || null,
    source_url: sourceUrl,
    landing_page: attribution.firstTouch?.landingPage || fallbackLandingPage,
  };
}
