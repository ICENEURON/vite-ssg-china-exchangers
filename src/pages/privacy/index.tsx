import { Head } from 'vite-react-ssg'
import { useTranslation } from 'react-i18next'

export default function PrivacyPage() {
  const { t } = useTranslation('translation')
  const sections = Object.values(
    t('pages.privacy.sections', { returnObjects: true }) as Record<string, { title: string; content: string }>
  )

  return (
    <>
      <Head>
        <title>{t('pages.privacy.title')}</title>
        <meta name="description" content={t('pages.privacy.meta.description')} />
        <meta name="keywords" content={t('pages.privacy.meta.keywords')} />
      </Head>

      <main className="min-h-screen w-full flex flex-col items-center bg-white px-4 py-16 dark:bg-slate-950">
        <article className="w-full max-w-4xl">
          {/* Header */}
          <header className="mb-12 flex flex-col items-start gap-4 pb-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {t('pages.privacy.hero.title')}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {t('pages.privacy.hero.subtitle')}
            </p>
          </header>

          {/* Content */}
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title} className="scroll-mt-24">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">{section.title}</h2>
                <p className="mt-3 text-lg leading-8 text-slate-600 dark:text-slate-300">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </article>
      </main>
    </>
  )
}