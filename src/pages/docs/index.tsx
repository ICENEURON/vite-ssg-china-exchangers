import { Head } from 'vite-react-ssg'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../components/ui/carousel'
import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'

type Slide = {
  id: string
  title: string
  subtitle: string
  bullets: string[]
}

export default function DocsPage() {
  const { t } = useTranslation('translation')

  const overviewParagraphs = t('pages.docs.overview.paragraphs', {
    returnObjects: true,
  }) as string[]

  const slides = t('pages.docs.carousel.slides', {
    returnObjects: true,
  }) as Slide[]

  const processSteps = t('pages.docs.process.steps', {
    returnObjects: true,
  }) as string[]

  return (
    <>
      <Head>
        <title>{t('pages.docs.title')}</title>
        <meta name="description" content={t('pages.docs.meta.description')} />
        <meta name="keywords" content={t('pages.docs.meta.keywords')} />
      </Head>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="grid text-center gap-6 mx-auto max-w-5xl">
          <h1 className="gradient-text mb-4 text-4xl md:text-5xl font-bold">
            {t('pages.docs.hero.title')}
          </h1>
          <h3 className="text-xl font-semibold">
            {t('pages.docs.hero.subtitle')}
          </h3>
          <p className="text-lg text-muted-foreground">
            {t('pages.docs.hero.intro')}
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t('pages.docs.overview.title')}
          </h2>
          <div className="space-y-3 text-sm md:text-base text-muted-foreground">
            {Array.isArray(overviewParagraphs) &&
              overviewParagraphs.map((p, index) => <p key={index}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* Core Concepts Carousel */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-6 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {t('pages.docs.carousel.title')}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              {t('pages.docs.carousel.subtitle')}
            </p>
          </div>

          <div className="relative px-4 md:px-12">
            <Carousel className="w-full">
              <CarouselContent>
                {Array.isArray(slides) &&
                  slides.map((slide, index) => (
                    <CarouselItem key={index}>
                      <div className="bg-card text-card-foreground flex flex-col gap-6 py-8 shadow-sm border h-full select-none">
                        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-8 pb-3 border-b">
                          <div className="leading-none pb-1 text-xl font-semibold">
                            {slide.title}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {slide.subtitle}
                          </div>
                        </div>
                        <div className="px-8 pb-4">
                          <ul className="space-y-3 text-sm text-muted-foreground">
                            {slide.bullets.map((bullet, idx) => (
                              <li key={idx} className="flex gap-3 items-start">
                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 md:-left-12" />
              <CarouselNext className="right-0 md:-right-12" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Deployment Process */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {t('pages.docs.process.title')}
          </h2>
          <ol className="space-y-4 text-sm md:text-base max-w-3xl mx-auto">
            {Array.isArray(processSteps) &&
              processSteps.map((step, index) => (
                <li
                  key={index}
                  className="flex gap-4 p-4 bg-muted/50 border border-border/50"
                >
                  <span className="font-semibold text-primary shrink-0">{index + 1}.</span>
                  <span className="flex items-center">{step}</span>
                </li>
              ))}
          </ol>
        </div>
      </section>
    </>
  )
}

