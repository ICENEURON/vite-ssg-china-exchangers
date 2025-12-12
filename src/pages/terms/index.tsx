import { Head } from 'vite-react-ssg'
import { useTranslation } from 'react-i18next'

export default function TermsPage() {
  const { t } = useTranslation('translation')

  return (
    <>
      <Head>
        <title>{t('pages.terms.title')}</title>
        <meta name="description" content={t('pages.terms.meta.description')} />
        <meta name="keywords" content={t('pages.terms.meta.keywords')} />
      </Head>
      
      <section className="py-12 px-4 mx-auto space-y-8">
        <div className="text-center">
          <h1>{t('pages.terms.hero.title')}</h1>
          <p className="mt-4 text-muted-foreground">
            {t('pages.terms.hero.subtitle')}
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h3>{t('pages.terms.sections.acceptance.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('pages.terms.sections.acceptance.content')}
            </p>
          </div>

          <div>
            <h3>{t('pages.terms.sections.usePolicy.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('pages.terms.sections.usePolicy.content')}
            </p>
          </div>

          <div>
            <h3>{t('pages.terms.sections.privacy.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('pages.terms.sections.privacy.content')}
            </p>
          </div>

          <div>
            <h3>{t('pages.terms.sections.disclaimers.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('pages.terms.sections.disclaimers.content')}
            </p>
          </div>

          <div>
            <h3>{t('pages.terms.sections.limitation.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('pages.terms.sections.limitation.content')}
            </p>
          </div>

          <div>
            <h3>{t('pages.terms.sections.changes.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('pages.terms.sections.changes.content')}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}