import { useTranslation, Trans } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { BrandText } from "../../../components/ui/brand-text";
import { ResponsiveHeroImage } from "../../../components/ui/responsive-hero-image";

export function AboutHero() {
    const { t } = useTranslation("translation");
    const highlights = t("pages.about.hero.highlights", { returnObjects: true }) as string[];

    return (
        <section className="relative isolate flex min-h-[560px] justify-center overflow-hidden bg-navbar px-2 py-16 text-navbar-foreground">
            <ResponsiveHeroImage src="/static/websites/about-hero.png" className="-z-20" />
            <div className="absolute inset-0 -z-10 bg-navbar/[0.97]" />

            <div className="container z-10 flex max-w-6xl flex-col justify-center gap-7 px-4">
                <div className="max-w-5xl space-y-5">
                    <h1 className="max-w-4xl font-bold leading-tight text-white md:text-6xl">
                        <Trans
                            i18nKey="pages.about.hero.title"
                            components={{ 1: <span className="text-orange-300" /> }}
                        />
                    </h1>

                    <p className="max-w-3xl text-lg leading-8 text-gray-100 md:text-xl">
                        <BrandText text={t("pages.about.hero.title_highlight")} directClassName="text-orange-300" />
                    </p>

                    <p className="max-w-3xl text-sm leading-7 text-gray-300 md:text-base">
                        {t("pages.about.hero.description_1")}
                    </p>
                </div>

                <div className="flex max-w-4xl flex-col gap-3 border-y border-white/15 py-5">
                    {highlights.map((highlight) => (
                        <div key={highlight} className="flex items-start gap-3 text-sm leading-6 text-gray-200 md:text-base">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-orange-300" />
                            <span>{highlight}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
