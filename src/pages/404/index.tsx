import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";
import { Button } from "../../components/ui/button";
import { SeoHead } from "../../components/seo/SeoHead";
import { useCurrentLanguage, addLanguageToPath } from "../../utils/language-routing";

export default function NotFoundPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.404' });
  const currentLanguage = useCurrentLanguage();
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://heatexdirect.com";
  const siteName = import.meta.env.VITE_SITE_TITLE || "HeatEx Direct";
  const currentUrl = new URL(location.pathname, siteUrl).href;

  const homeLink = addLanguageToPath('/', currentLanguage);

  return (
    <>
      <SeoHead
        title={t('title')}
        description={t('description')}
        canonicalUrl={currentUrl}
        siteName={siteName}
      />
      <section className="mx-auto flex min-h-[64vh] w-full max-w-4xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <span className="text-8xl font-bold text-blue-600 drop-shadow-[0_10px_18px_rgba(37,99,235,0.28)]">
          {t('title')}
        </span>
        <p className="mt-3 max-w-xl text-xl font-bold text-gray-900">
          {t('description')}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="min-w-40 bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700">
            <Link to={homeLink}>
              <Home className="h-4 w-4" />
              {t('backButton')}
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
