import { Head } from 'vite-react-ssg'
import { useTranslation } from 'react-i18next'

export default function PrivacyPage() {
  const { t } = useTranslation('translation')

  return (
    <>
      <Head>
        <title>{t('pages.privacy.title')}</title>
        <meta name="description" content={t('pages.privacy.meta.description')} />
        <meta name="keywords" content={t('pages.privacy.meta.keywords')} />
      </Head>

      <main className="min-h-screen w-full flex flex-col items-center py-16 px-4">
        <div className="w-full max-w-5xl flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {t('pages.privacy.hero.title')}
            </h1>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8 w-full p-2">
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-foreground">{t('pages.privacy.sections.introduction.title')}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {t('pages.privacy.sections.introduction.content')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-foreground">{t('pages.privacy.sections.collection.title')}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {t('pages.privacy.sections.collection.content')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-foreground">{t('pages.privacy.sections.usage.title')}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {t('pages.privacy.sections.usage.content')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-foreground">{t('pages.privacy.sections.sharing.title')}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {t('pages.privacy.sections.sharing.content')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-foreground">{t('pages.privacy.sections.security.title')}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {t('pages.privacy.sections.security.content')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-foreground">{t('pages.privacy.sections.cookies.title')}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {t('pages.privacy.sections.cookies.content')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-foreground">{t('pages.privacy.sections.contact.title')}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {t('pages.privacy.sections.contact.content')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}