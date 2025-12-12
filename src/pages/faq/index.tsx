import { Head } from 'vite-react-ssg'
import { useTranslation } from 'react-i18next'
import { Badge } from '../../components/ui/badge'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../components/ui/accordion'

type FaqQuestion = {
  question: string
  answer: string
}

type FaqGroup = {
  id: string
  title: string
  questions: FaqQuestion[]
}

export default function FaqPage() {
  const { t } = useTranslation('translation')

  const groups = t('pages.faq.groups', {
    returnObjects: true,
  }) as FaqGroup[]

  return (
    <>
      <Head>
        <title>{t('pages.faq.title')}</title>
        <meta
          name="description"
          content={t('pages.faq.meta.description')}
        />
        <meta
          name="keywords"
          content={t('pages.faq.meta.keywords')}
        />
      </Head>

      {/* Hero */}
      <section className="py-12 px-4 flex flex-col items-center">
        <div className="grid text-center gap-6 mx-auto max-w-5xl">
          <h1 className="gradient-text mb-4">
            {t('pages.faq.hero.title')}
          </h1>
          <p className="text-xl">
            {t('pages.faq.hero.subtitle')}
          </p>
          <p className="text-lg">
            {t('pages.faq.hero.intro1')}
          </p>
          <p className="text-lg mb-6">
            {t('pages.faq.hero.intro2')}
          </p>
        </div>
          <Badge
            className="mb-4 text-sm uppercase"
          >
            {t('pages.faq.hero.eyebrow')}
          </Badge>
      </section>

      {/* FAQ groups */}
      <section className="pt-6 pb-12">
        <div className="container mx-auto max-w-5xl px-4 space-y-10">
          {Array.isArray(groups) &&
            groups.map((group) => (
              <div key={group.id} className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold">
                  {group.title}
                </h3>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full rounded-lg bg-background"
                >
                  {Array.isArray(group.questions) &&
                    group.questions.map((item, index) => (
                      <AccordionItem
                        key={index}
                        value={`${group.id}-${index}`}
                        className="last:border-0"
                      >
                        <AccordionTrigger className="px-4 text-left text-sm md:text-base">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="px-4 pb-4 text-sm text-muted-foreground">
                            {item.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>
            ))}
        </div>
      </section>

    </>
  )
}
