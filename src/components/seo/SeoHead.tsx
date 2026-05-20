import { Head } from 'vite-react-ssg';

export const DEFAULT_OG_IMAGE = 'https://heatexdirect.com/static/websites/heatex-direct.png';

type StructuredData = Record<string, unknown> | Array<Record<string, unknown>>;

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

  return (
    <Head>
      <title>{title}</title>
      <link rel="canonical" href={canonicalUrl} />
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
