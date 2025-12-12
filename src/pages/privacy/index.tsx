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
      
      <section className="py-12 px-4 mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{t('pages.privacy.hero.title')}</h1>
          <p className="mt-4 text-muted-foreground">
            {t('pages.privacy.hero.subtitle')}
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h3>{t('pages.privacy.sections.introduction.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('pages.privacy.sections.introduction.content')}
            </p>
          </div>

          <div>
            <h3>{t('pages.privacy.sections.collection.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('pages.privacy.sections.collection.content')}
            </p>
          </div>

          <div>
            <h3>{t('pages.privacy.sections.usage.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('pages.privacy.sections.usage.content')}
            </p>
          </div>

          <div>
            <h3>{t('pages.privacy.sections.sharing.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('pages.privacy.sections.sharing.content')}
            </p>
          </div>

          <div>
            <h3>{t('pages.privacy.sections.security.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('pages.privacy.sections.security.content')}
            </p>
          </div>

          <div>
            <h3>{t('pages.privacy.sections.cookies.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('pages.privacy.sections.cookies.content')}
            </p>
          </div>

          <div>
            <h3>{t('pages.privacy.sections.contact.title')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('pages.privacy.sections.contact.content')}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}