import { Head } from 'vite-react-ssg'
import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card'

export default function AboutPage() {
  const { t } = useTranslation('translation')

  const whatThisIsParagraphs = t('pages.about.sections.whatThisIs.paragraphs', {
    returnObjects: true,
  }) as string[]

  const whatThisIsNotItems = t('pages.about.sections.whatThisIsNot.items', {
    returnObjects: true,
  }) as string[]

  const approachParagraphs = t('pages.about.sections.approach.paragraphs', {
    returnObjects: true,
  }) as string[]

  const aiUsageParagraphs = t('pages.about.sections.aiUsage.paragraphs', {
    returnObjects: true,
  }) as string[]

  const audienceParagraphs = t('pages.about.sections.audience.paragraphs', {
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
          <p className="text-xl md:text-2xl mb-3">
            {t('pages.about.hero.subtitle')}
          </p>
          <p className="text-lg mb-2">
            {t('pages.about.hero.intro1')}
          </p>
          <p className="text-lg text-muted-foreground mb-6">
            {t('pages.about.hero.intro2')}
          </p>

          <div className="flex flex-wrap gap-3 flex justify-center">
            <Button size="lg" asChild>
              <a href="/">
                Back to weekly watchlist
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/docs">
                View analysis methodology
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* What this is / what this is not */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-[1.5fr,1fr]">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t('pages.about.sections.whatThisIs.title')}
            </h2>
            <div className="space-y-3 text-sm md:text-base text-muted-foreground">
              {Array.isArray(whatThisIsParagraphs) &&
                whatThisIsParagraphs.map((p, index) => <p key={index}>{p}</p>)}
            </div>
          </div>

          <Card className="self-start">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">
                {t('pages.about.sections.whatThisIsNot.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                {Array.isArray(whatThisIsNotItems) &&
                  whatThisIsNotItems.map((item, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70" />
                      <span>{item}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Approach */}
      <section className="py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t('pages.about.sections.approach.title')}
          </h2>
          <div className="space-y-3 text-sm md:text-base text-muted-foreground">
            {Array.isArray(approachParagraphs) &&
              approachParagraphs.map((p, index) => <p key={index}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* AI usage */}
      <section className="py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t('pages.about.sections.aiUsage.title')}
          </h2>
          <div className="space-y-3 text-sm md:text-base text-muted-foreground">
            {Array.isArray(aiUsageParagraphs) &&
              aiUsageParagraphs.map((p, index) => <p key={index}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t('pages.about.sections.audience.title')}
          </h2>
          <div className="space-y-3 text-sm md:text-base text-muted-foreground">
            {Array.isArray(audienceParagraphs) &&
              audienceParagraphs.map((p, index) => <p key={index}>{p}</p>)}
          </div>
        </div>
      </section>

    </>
  )
}
