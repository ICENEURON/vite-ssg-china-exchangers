
import { BarChart3, ClipboardCheck, Newspaper, Search, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

export function PlatformValueSection() {
    const { t } = useTranslation("translation", { keyPrefix: "pages.cms.platform_impact" });

    return (
        <section className="pt-12 pb-20">
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="mb-8 md:text-center max-w-3xl mx-auto">
                    <h2 className="font-bold tracking-tight mb-4">{t("title")}</h2>
                    <p className="text-lg text-muted">
                        {t("description")}
                    </p>
                </div>

                <div className="mb-5 grid gap-3 md:grid-cols-3">
                    {(t("overview", { returnObjects: true }) as { label: string; value: string }[]).map((item, index) => {
                        const icons = [Newspaper, Users, ClipboardCheck];
                        const Icon = icons[index] || Newspaper;

                        return (
                            <div key={item.label} className="rounded-2xl border border-border/30 bg-card p-5">
                                <Icon className="mb-3 h-5 w-5 text-accent" />
                                <p className="text-sm font-semibold text-muted">{item.label}</p>
                                <p className="mt-1 text-base font-bold leading-snug">{item.value}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Card 1: SEO Dominance (Large - Spans 2 cols) */}
                    <div className="group relative overflow-hidden rounded-3xl bg-card border border-border/20 p-8 md:col-span-2 flex flex-col justify-between hover:border-border/50 transition-colors min-h-[300px] md:min-h-[300px]">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Search className="w-48 h-48 -mr-12 -mt-12 rotate-12" />
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent mb-6">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold mb-2">{t("items.seo.title")}</h4>
                            <p className="text-muted max-w-md">
                                {t("items.seo.description")}
                            </p>
                        </div>

                        {/* Simulated Graph Line */}
                        <div className="w-full h-16 mt-6 flex items-end gap-1">
                            {[40, 65, 55, 80, 70, 90, 85, 100].map((h, i) => (
                                <div key={i} className="flex-1 bg-primary/20 rounded-t-sm group-hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>


                    {/* Card 2: Direct Audience */}
                    <div className="group relative rounded-3xl border border-border/20 bg-card p-8 min-h-[300px] flex flex-col justify-between hover:border-primary/50 transition-colors">
                        <div>
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 mb-6">
                                <Users className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold mb-2">{t("items.audience.title")}</h4>
                            <p className="text-muted">{t("items.audience.description")}</p>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {(t("items.audience.segments", { returnObjects: true }) as string[]).map((segment) => (
                                <span key={segment} className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-300">
                                    {segment}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Card 3: Editorial Fit */}
                    <div className="group relative overflow-hidden rounded-3xl border border-border/20 bg-card p-8 min-h-[220px] flex flex-col justify-between transition-colors hover:border-purple-500/30">
                        <div>
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 mb-6">
                                <ClipboardCheck className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold mb-2">{t("items.screening.title")}</h4>
                            <p className="text-muted">{t("items.screening.description")}</p>
                        </div>
                        <ul className="mt-5 space-y-2 text-sm text-foreground/80">
                            {(t("items.screening.items", { returnObjects: true }) as string[]).map((item) => (
                                <li key={item} className="flex gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Card 4: Industry News Publishing */}
                    <div className="group relative overflow-hidden rounded-3xl bg-zinc-950 text-white p-8 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8 items-center hover:ring-2 ring-primary/50 transition-all">
                        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 w-full min-h-[160px] sm:col-span-1">
                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500" />
                                <div>
                                    <div className="w-20 h-2 bg-white/20 rounded-full mb-1" />
                                    <div className="w-12 h-2 bg-white/10 rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="w-full h-2 bg-white/10 rounded-full" />
                                <div className="w-full h-2 bg-white/10 rounded-full" />
                                <div className="w-3/4 h-2 bg-white/10 rounded-full" />
                            </div>
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] bg-primary text-primary-foreground font-bold">
                                {t("items.verified.badge")}
                            </div>
                        </div>

                        <div className="text-center sm:text-left sm:col-span-2">
                            <h3 className="text-2xl font-bold mb-2">{t("items.verified.title")}</h3>
                            <p className="text-zinc-400 mb-6">
                                {t("items.verified.description")}
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                <span className="px-3 py-1 rounded-full bg-white/10 text-xs border border-white/10">{t("items.verified.tags.visibility")}</span>
                                <span className="px-3 py-1 rounded-full bg-white/10 text-xs border border-white/10">{t("items.verified.tags.trust")}</span>
                                <span className="px-3 py-1 rounded-full bg-white/10 text-xs border border-white/10">{t("items.verified.tags.expert")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
