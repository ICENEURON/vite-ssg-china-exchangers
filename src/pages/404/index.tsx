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
      <h1>{t('title') || '404'}</h1>
      <h2>{t('heading') || 'Page not found'}</h2>
      <p className="mt-3 text-sm text-muted-foreground">
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
