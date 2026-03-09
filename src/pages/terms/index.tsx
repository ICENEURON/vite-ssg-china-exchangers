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

      <main className="min-h-screen w-full flex flex-col items-center py-16 px-4">
        <div className="w-full max-w-5xl flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {t('pages.terms.hero.title')}
            </h1>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8 w-full p-2">
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-foreground">{t('pages.terms.sections.acceptance.title')}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {t('pages.terms.sections.acceptance.content')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-foreground">{t('pages.terms.sections.usePolicy.title')}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {t('pages.terms.sections.usePolicy.content')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-foreground">{t('pages.terms.sections.privacy.title')}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {t('pages.terms.sections.privacy.content')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-foreground">{t('pages.terms.sections.disclaimers.title')}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {t('pages.terms.sections.disclaimers.content')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-foreground">{t('pages.terms.sections.limitation.title')}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {t('pages.terms.sections.limitation.content')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-foreground">{t('pages.terms.sections.changes.title')}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {t('pages.terms.sections.changes.content')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}