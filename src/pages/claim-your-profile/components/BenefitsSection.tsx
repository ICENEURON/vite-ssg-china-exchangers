
import { BadgeCheck, Search, ArrowUpRight } from "lucide-react"
import { useTranslation, Trans } from "react-i18next"

export function BenefitsSection() {
    const { t } = useTranslation();
    return (
        <section className="py-16">
            <div className="container px-8 mx-auto max-w-7xl">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h1 className="font-bold tracking-tight mb-4 text-accent">{t('pages.profile.benefits.header.title')}</h1>
                        <p className="text-xl text-foreground">
                            <Trans i18nKey="pages.profile.benefits.header.description" components={{ strong: <strong /> }} />
                        </p>
                    </div>

                    <div className="hidden md:block shrink-0">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/40 shadow-sm text-sm font-bold text-destructive whitespace-nowrap">
                            <span className="relative flex h-2 w-2 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                            </span>
                            {t('pages.profile.benefits.header.verified_badge')}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Card 1: Preferential Ranking (Tall) */}
                    <div className="group relative overflow-hidden rounded-[2rem] bg-zinc-900 text-white p-8 lg:row-span-1 flex flex-col justify-between transition-all shadow-xl min-h-[340px]">
                        <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform duration-500 pointer-events-none">
                            <Search className="w-40 h-40 -mr-12 -mt-12" />
                        </div>

                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                                <ArrowUpRight className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{t('pages.profile.benefits.cards.ranking.title')}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                <Trans i18nKey="pages.profile.benefits.cards.ranking.description" components={{ strong: <strong /> }} />
                            </p>
                        </div>

                        <div className="mt-6 flex items-center gap-3 text-sm font-bold text-green-400">
                            <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-green-400 w-[85%]" />
                            </div>
                            {t('pages.profile.benefits.cards.ranking.traffic_badge')}
                        </div>
                    </div>

                    {/* Card 2: The Verified Badge (Wide - Spans 2 cols) */}
                    <div className="group relative overflow-hidden rounded-[2rem] bg-card/30 border border-border/60 p-8 lg:col-span-2 flex flex-col lg:flex-row gap-8 hover:border-primary/30 transition-colors min-h-[340px]">
                        <div className="flex-1 text-center lg:text-left z-10 flex flex-col justify-between">
                            <div>
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 mb-6">
                                    <BadgeCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{t('pages.profile.benefits.cards.verified_signal.title')}</h3>
                                <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-6 leading-relaxed">
                                    {t('pages.profile.benefits.cards.verified_signal.description')}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold border border-blue-100 dark:border-blue-900">{t('pages.profile.benefits.cards.verified_signal.badges.verified')}</span>
                                <span className="px-3 py-1 bg-muted text-muted-foreground rounded-lg text-xs font-bold border">{t('pages.profile.benefits.cards.verified_signal.badges.audit')}</span>
                            </div>
                        </div>

                        <div className="shrink-0 relative flex items-center justify-center">
                            {/* Abstract Badge Visual */}
                            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-lg group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                                <div className="w-full h-full bg-background rounded-full flex flex-col items-center justify-center border-4 border-transparent p-4 relative">
                                    <BadgeCheck className="w-16 h-16 text-blue-600 mb-2 fill-blue-600/10" />
                                    <div className="font-bold text-foreground text-center leading-tight">
                                        <Trans i18nKey="pages.profile.benefits.cards.verified_signal.official_supplier" components={{ br: <br /> }} />
                                    </div>

                                    <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-zinc-200 dark:border-zinc-700 animate-[spin_10s_linear_infinite]" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
