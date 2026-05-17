
import { BarChart3, ClipboardCheck, Newspaper, Search, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

export function PlatformValueSection() {
    const { t } = useTranslation("translation", { keyPrefix: "pages.cms.platform_impact" });

    return (
        <section className="pt-8 pb-12 md:pt-10 md:pb-14">
            <div className="container px-4 mx-auto max-w-6xl">

                <div className="mb-5 grid gap-3 md:grid-cols-3">
                    {(t("overview", { returnObjects: true }) as { label: string; value: string }[]).map((item, index) => {
                        const icons = [Newspaper, Users, ClipboardCheck];
                        const Icon = icons[index] || Newspaper;

                        return (
                            <div key={item.label} className="rounded-xl border border-border/30 bg-card p-5">
                                <div className="mb-6 flex items-center gap-3">
                                    <Icon className="h-6 w-6 shrink-0 text-accent" />
                                    <h4 className="text-2xl font-extrabold leading-tight">{item.label}</h4>
                                </div>
                                <p className="text-muted">{item.value}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">

                    {/* Card 1: SEO Dominance (Large - Spans 2 cols) */}
                    <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-white p-8 md:col-span-2 flex flex-col justify-between transition-colors hover:border-blue-600 min-h-[300px] md:min-h-[300px]">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Search className="w-36 h-36 -mr-6 -mt-6 rotate-12 text-white" />
                        </div>

                        <div className="relative z-10">
                            <div className="mb-6 flex items-center gap-3">
                                <BarChart3 className="h-6 w-6 shrink-0 text-white" />
                                <h4 className="text-2xl font-extrabold leading-tight">{t("items.seo.title")}</h4>
                            </div>
                            <p className="max-w-md text-blue-50/90">
                                {t("items.seo.description")}
                            </p>
                        </div>

                        {/* Simulated Graph Line */}
                        <div className="w-full h-16 mt-6 flex items-end gap-1">
                            {[40, 65, 55, 80, 70, 90, 85, 100].map((h, i) => (
                                <div key={i} className="flex-1 rounded-t-sm bg-white/20 transition-colors group-hover:bg-white/30" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>


                    {/* Card 2: Direct Audience */}
                    <div className="group relative rounded-2xl border border-border/20 bg-card p-8 min-h-[300px] flex flex-col justify-between hover:border-primary/50 transition-colors">
                        <div>
                            <div className="mb-6 flex items-center gap-3">
                                <Users className="h-6 w-6 shrink-0 text-blue-500" />
                                <h4 className="text-2xl font-extrabold leading-tight">{t("items.audience.title")}</h4>
                            </div>
                            <p className="text-muted">{t("items.audience.description")}</p>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {(t("items.audience.segments", { returnObjects: true }) as string[]).map((segment) => (
                                <span key={segment} className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600">
                                    {segment}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Card 3: Editorial Fit */}
                    <div className="group relative overflow-hidden rounded-2xl border border-border/20 bg-card p-8 min-h-[220px] flex flex-col justify-between transition-colors hover:border-purple-500/30">
                        <div>
                            <div className="mb-6 flex items-center gap-3">
                                <ClipboardCheck className="h-6 w-6 shrink-0 text-purple-500" />
                                <h4 className="text-2xl font-extrabold leading-tight">{t("items.screening.title")}</h4>
                            </div>
                            <p className="text-muted">{t("items.screening.description")}</p>
                        </div>
                    </div>

                    {/* Card 4: Industry News Publishing */}
                    <div className="group relative grid grid-cols-1 items-center gap-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-8 text-white transition-all ring-blue-400/40 hover:ring-2 sm:grid-cols-3 md:col-span-2 md:gap-8">
                        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-4 w-full min-h-[160px] sm:col-span-1">
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
                            <h4 className="mb-6 text-2xl font-extrabold leading-tight">{t("items.verified.title")}</h4>
                            <p className="max-w-md text-blue-50/90 mb-6">
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
