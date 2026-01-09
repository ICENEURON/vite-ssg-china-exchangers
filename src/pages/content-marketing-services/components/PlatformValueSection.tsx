
import { TrendingUp, Users, Search, Share2, Globe2 } from "lucide-react"
import { useTranslation } from "react-i18next"

export function PlatformValueSection() {
    const { t } = useTranslation("translation", { keyPrefix: "pages.cms.platform_impact" });

    return (
        <section className="pt-12 pb-20">
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="mb-8 md:text-center max-w-3xl mx-auto">
                    <h1 className="font-bold tracking-tight mb-4">{t("title")}</h1>
                    <p className="text-lg text-muted">
                        {t("description")}
                    </p>
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
                                <TrendingUp className="w-6 h-6" />
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
                    <div className="group relative rounded-3xl hidden md:flex flex-col justify-between hover:border-primary/50 transition-colors p-20 min-h-[300px]">
                        <div className="relative h-full w-full rounded-xl flex items-center justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
                            <div className="relative text-accent/60">
                                <Globe2 className="h-24 w-24" />
                            </div>
                            {/* Orbiting dots */}
                            <div className="absolute h-full w-full border border-accent/20 rounded-full animate-[spin_8s_linear_infinite]" />
                            <div className="absolute h-full w-full rounded-full animate-[spin_10s_linear_infinite_reverse]">
                                <div className="absolute -top-1 left-1/2 w-2 h-2 bg-accent rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                            </div>
                            <div className="absolute h-full w-full border border-accent/20 rounded-full animate-[spin_6s_linear_infinite]" />
                        </div>
                    </div>

                    {/* Card 3: Trust & Shareability */}
                    <div className="group relative overflow-hidden rounded-3xl hidden md:flex flex-col justify-between transition-colors min-h-[120px]">
                        <div className="relative h-full w-full rounded-xl flex items-center justify-center">
                            {/* Stacked Cards Effect */}
                            <div className="absolute w-36 h-42 bg-background border border-purple-500/20 rounded-lg shadow-lg rotate-[-6deg] translate-x-[-8px] scale-90 opacity-60 transition-transform duration-500 group-hover:translate-x-[-24px] group-hover:rotate-[-12deg]" />
                            <div className="absolute w-36 h-42 bg-background border border-purple-500/20 rounded-lg shadow-lg rotate-[6deg] translate-x-[8px] scale-95 opacity-80 transition-transform duration-500 group-hover:translate-x-[24px] group-hover:rotate-[12deg]" />
                            <div className="relative w-36 h-42 bg-background border border-purple-500/40 rounded-lg shadow-xl flex flex-col p-3 gap-2 transition-transform duration-500 group-hover:scale-110">
                                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-1">
                                    <Share2 className="w-6 h-6 text-purple-500" />
                                </div>
                                <div className="w-full h-1.5 bg-purple-500/10 rounded-full" />
                                <div className="w-2/3 h-1.5 bg-purple-500/10 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Verified Badge Impact (Large - Spans 2 cols) */}
                    <div className="group relative overflow-hidden rounded-3xl bg-zinc-950 text-white p-8 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8 items-center hover:ring-2 ring-primary/50 transition-all">
                        {/* Abstract Visual */}
                        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 w-full min-h-[160px] sm:col-span-1">
                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600" />
                                <div>
                                    <div className="w-8 h-2 bg-white/20 rounded-full mb-1" />
                                    <div className="w-4 h-2 bg-white/10 rounded-full" />
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
