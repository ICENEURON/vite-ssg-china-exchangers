import { BadgeCheck } from "lucide-react"
import { useTranslation } from "react-i18next"

export function HeroSection() {
    const { t } = useTranslation("translation", { keyPrefix: "pages.manufacturers.hero" });

    return (
        <section className="relative px-4 py-[99px] overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src="/static/websites/manufacturers-hero.png"
                    alt="Industrial Facility"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-navbar/90" />
            </div>

            <div className="relative z-10 container mx-auto px-4 max-w-5xl text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20 mb-3 backdrop-blur-sm">
                    <BadgeCheck className="w-4 h-4" /> {t("badge")}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-white">
                    {t("title")}
                </h1>
                <p className="text-base md:text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed">
                    {t("description")}
                </p>
            </div>
        </section>
    )
}
