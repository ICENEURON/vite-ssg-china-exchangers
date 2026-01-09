import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { useCurrentLanguage, addLanguageToPath } from "../../utils/language-routing";

export default function NotFoundPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.404' });
  const currentLanguage = useCurrentLanguage();

  // Generate language-aware home link
  const homeLink = addLanguageToPath('/', currentLanguage);

  return (
    <section className="mx-auto flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <span className="text-accent font-bold text-7xl">{t('title') || '404'}</span>
      <h1>{t('heading') || 'Page not found'}</h1>
      <p className="my-3 text-md text-muted">
        {t('description') || "The page you're looking for doesn't exist or has been moved."}
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link to={homeLink}>{t('backButton') || 'Back to Home'}</Link>
        </Button>
      </div>
    </section>
  );
}
