import { Head } from 'vite-react-ssg'
import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default function AboutPage() {
  const { t } = useTranslation('translation')

  const missionParagraphs = t('pages.about.sections.mission.paragraphs', {
    returnObjects: true,
  }) as string[]

  const techStackItems = t('pages.about.sections.techStack.items', {
    returnObjects: true,
  }) as string[]

  const philosophyParagraphs = t('pages.about.sections.philosophy.paragraphs', {
    returnObjects: true,
  }) as string[]

  const communityParagraphs = t('pages.about.sections.community.paragraphs', {
    returnObjects: true,
  }) as string[]

  return (
    <>
      <Head>
        <title>{t('pages.about.title')}</title>
        <meta
          name="description"
          content={t('pages.about.meta.description')}
        />
        <meta
          name="keywords"
          content={t('pages.about.meta.keywords')}
        />
      </Head>

      {/* Hero */}
      <section className="py-12 px-4">
        <div className="grid text-center gap-6 mx-auto max-w-5xl">
          <h1 className="gradient-text mb-4">
            {t('pages.about.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-3 font-semibold">
            {t('pages.about.hero.subtitle')}
          </p>
          <p className="text-lg mb-2 max-w-3xl mx-auto">
            {t('pages.about.hero.intro1')}
          </p>
          <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
            {t('pages.about.hero.intro2')}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" asChild>
              <a href="/">
                Explore Features
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/claim-your-profile">
                Read Documentation
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t('pages.about.sections.mission.title')}
            </h2>
          </div>
          <div className="space-y-4 text-center max-w-3xl mx-auto text-muted-foreground">
            {Array.isArray(missionParagraphs) &&
              missionParagraphs.map((p, index) => <p key={index}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* Tech Stack & Philosophy */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-4 grid gap-12 md:grid-cols-2">

          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('pages.about.sections.techStack.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {Array.isArray(techStackItems) &&
                  techStackItems.map((item, index) => {
                    // Simple markdown parser for bold text in JSON
                    const parts = item.split('**');
                    return (
                      <li key={index} className="flex gap-3 items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm md:text-base text-muted-foreground">
                          {parts.length > 1 ? (
                            <>
                              <strong className="text-foreground font-semibold">{parts[1]}</strong>
                              {parts[2]}
                            </>
                          ) : item}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </CardContent>
          </Card>

          {/* Philosophy */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              {t('pages.about.sections.philosophy.title')}
            </h2>
            <div className="space-y-6 text-muted-foreground">
              {Array.isArray(philosophyParagraphs) &&
                philosophyParagraphs.map((p, index) => {
                  const parts = p.split('**');
                  return (
                    <div key={index} className="pl-4 border-l-2 border-primary/20">
                      {parts.length > 1 ? (
                        <p>
                          <strong className="text-foreground block mb-1">{parts[1]}</strong>
                          {parts[2].replace(/^: /, '')}
                        </p>
                      ) : <p>{p}</p>}
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="py-12 border-t">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t('pages.about.sections.community.title')}
          </h2>
          <div className="space-y-3 text-muted-foreground max-w-2xl mx-auto mb-8">
            {Array.isArray(communityParagraphs) &&
              communityParagraphs.map((p, index) => <p key={index}>{p}</p>)}
          </div>
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </Button>
        </div>
      </section>

    </>
  )
}
