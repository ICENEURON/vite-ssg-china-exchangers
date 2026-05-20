import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SeoHead } from '../../components/seo/SeoHead'

type LegalSection = {
  title: string
  content: string | string[]
}

function getLegalTitle(title: string) {
  return title.replace(/^\d+\.\s*/, '')
}

export default function PrivacyPage() {
  const { t } = useTranslation('translation')
  const location = useLocation()
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://heatexdirect.com"
  const siteName = import.meta.env.VITE_SITE_TITLE || "HeatEx Direct"
  const currentUrl = new URL(location.pathname, siteUrl).href
  const sections = Object.values(
    t('pages.privacy.sections', { returnObjects: true }) as Record<string, LegalSection>
  )

  return (
    <>
      <SeoHead
        title={t('pages.privacy.title')}
        description={t('pages.privacy.meta.description')}
        keywords={t('pages.privacy.meta.keywords')}
        canonicalUrl={currentUrl}
        siteName={siteName}
      />

      <main className="min-h-screen w-full flex flex-col items-center bg-white px-4 py-16">
        <article className="w-full max-w-4xl">
          {/* Header */}
          <header className="mb-12 flex flex-col items-start gap-4 pb-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {t('pages.privacy.hero.title')}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              {t('pages.privacy.hero.subtitle')}
            </p>
          </header>

          {/* Content */}
          <div className="space-y-10">
            {sections.map((section) => {
              const paragraphs = Array.isArray(section.content) ? section.content : [section.content]

              return (
                <section key={section.title} className="scroll-mt-24">
                  <h4 className="text-lg font-semibold leading-7 text-foreground">{getLegalTitle(section.title)}</h4>
                  <div className="mt-3 space-y-4">
                    {paragraphs.map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex} className="text-base leading-7 text-slate-600">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </article>
      </main>
    </>
  )
}
