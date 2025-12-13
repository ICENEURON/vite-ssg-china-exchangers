
import { Head } from 'vite-react-ssg'
import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui/button'
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '../../components/ui/card'
import { CheckCircle2, FileText, BarChart3, PenTool } from 'lucide-react'

export default function ContentMarketingServicesPage() {
    const { t } = useTranslation('translation')

    const strategyItems = t('pages.content-marketing-services.services.strategy.items', {
        returnObjects: true,
    }) as string[]

    const creationItems = t('pages.content-marketing-services.services.creation.items', {
        returnObjects: true,
    }) as string[]

    const distributionItems = t('pages.content-marketing-services.services.distribution.items', {
        returnObjects: true,
    }) as string[]

    const services = [
        {
            key: 'strategy',
            icon: FileText,
            titleKey: 'pages.content-marketing-services.services.strategy.title',
            items: strategyItems,
        },
        {
            key: 'creation',
            icon: PenTool,
            titleKey: 'pages.content-marketing-services.services.creation.title',
            items: creationItems,
        },
        {
            key: 'distribution',
            icon: BarChart3,
            titleKey: 'pages.content-marketing-services.services.distribution.title',
            items: distributionItems,
        },
    ]

    return (
        <>
            <Head>
                <title>{t('pages.content-marketing-services.title')}</title>
                <meta
                    name="description"
                    content={t('pages.content-marketing-services.meta.description')}
                />
                <meta
                    name="keywords"
                    content={t('pages.content-marketing-services.meta.keywords')}
                />
            </Head>

            {/* Hero */}
            <section className="py-12 px-4 md:py-20">
                <div className="grid text-center gap-6 mx-auto max-w-4xl">
                    <h1 className="gradient-text mb-4 text-4xl md:text-5xl font-bold">
                        {t('pages.content-marketing-services.hero.title')}
                    </h1>
                    <p className="text-xl md:text-2xl mb-3 font-semibold text-foreground">
                        {t('pages.content-marketing-services.hero.subtitle')}
                    </p>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        {t('pages.content-marketing-services.hero.intro')}
                    </p>

                    <div className="flex justify-center">
                        <Button size="lg" asChild>
                            <a href="#contact">
                                {t('pages.content-marketing-services.cta.button')}
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                        {services.map((service) => (
                            <Card key={service.key} className="relative overflow-hidden border-none shadow-md">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
                                <CardHeader>
                                    <service.icon className="h-10 w-10 text-primary mb-4" />
                                    <CardTitle className="text-2xl">
                                        {t(service.titleKey)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-4">
                                        {Array.isArray(service.items) &&
                                            service.items.map((item, index) => {
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
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section id="contact" className="py-20">
                <div className="container mx-auto max-w-3xl px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        {t('pages.content-marketing-services.cta.title')}
                    </h2>
                    <Button size="lg" className="text-lg px-8 py-6 h-auto" asChild>
                        <a href="mailto:contact@chinaexchangers.com">
                            {t('pages.content-marketing-services.cta.button')}
                        </a>
                    </Button>
                </div>
            </section>
        </>
    )
}
