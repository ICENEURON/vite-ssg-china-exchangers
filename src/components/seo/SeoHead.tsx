import { Head } from 'vite-react-ssg';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../../locales/languages';

export const DEFAULT_OG_IMAGE = 'https://heatexdirect.com/static/websites/heatex-direct.png';

type StructuredData = Record<string, unknown> | Array<Record<string, unknown>>;
type AlternateLink = {
  hrefLang: string;
  href: string;
};

type SeoHeadProps = {
  title: string;
  description?: string;
  keywords?: string;
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  siteName?: string;
  structuredData?: StructuredData;
};

function getPathWithoutLanguage(pathname: string) {
  const nonDefaultLanguages = SUPPORTED_LANGUAGES
    .filter((language) => language !== DEFAULT_LANGUAGE)
    .sort((a, b) => b.length - a.length);

  for (const language of nonDefaultLanguages) {
    const prefix = `/${language}`;

    if (pathname === prefix) {
      return '/';
    }

    if (pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length) || '/';
    }
  }

  return pathname || '/';
}

function getLocalizedPath(pathname: string, language: string) {
  if (language === DEFAULT_LANGUAGE) {
    return pathname;
  }

  return pathname === '/' ? `/${language}` : `/${language}${pathname}`;
}

function buildAlternateLinks(canonicalUrl: string): AlternateLink[] {
  try {
    const url = new URL(canonicalUrl);
    const basePath = getPathWithoutLanguage(url.pathname);
    const origin = url.origin;
    const links = SUPPORTED_LANGUAGES.map((language) => ({
      hrefLang: language,
      href: new URL(getLocalizedPath(basePath, language), origin).href,
    }));
    const defaultHref = new URL(getLocalizedPath(basePath, DEFAULT_LANGUAGE), origin).href;

    return [
      ...links,
      {
        hrefLang: 'x-default',
        href: defaultHref,
      },
    ];
  } catch {
    return [];
  }
}

export function SeoHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  siteName = 'HeatEx Direct',
  structuredData,
}: SeoHeadProps) {
  const resolvedDescription = description?.trim();
  const resolvedKeywords = keywords?.trim();
  const resolvedOgTitle = ogTitle?.trim() || title;
  const resolvedOgDescription = ogDescription?.trim() || resolvedDescription;
  const structuredDataJson = structuredData
    ? JSON.stringify(structuredData).replace(/</g, '\\u003c')
    : null;
  const alternateLinks = buildAlternateLinks(canonicalUrl);

  return (
    <Head>
      <title>{title}</title>
      <link rel="canonical" href={canonicalUrl} />
      {alternateLinks.map((link) => (
        <link key={link.hrefLang} rel="alternate" hrefLang={link.hrefLang} href={link.href} />
      ))}
      {resolvedDescription && <meta name="description" content={resolvedDescription} />}
      {resolvedKeywords && <meta name="keywords" content={resolvedKeywords} />}
      <meta property="og:title" content={resolvedOgTitle} />
      {resolvedOgDescription && <meta property="og:description" content={resolvedOgDescription} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      {structuredDataJson && (
        <script type="application/ld+json">
          {structuredDataJson}
        </script>
      )}
    </Head>
  );
}
