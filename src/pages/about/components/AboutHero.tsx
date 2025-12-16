
import { useTranslation, Trans } from "react-i18next";
import { Badge } from "../../../components/ui/badge";
import { Quote } from "lucide-react";

export function AboutHero() {
    const { t } = useTranslation("translation");

    return (
        <section className="relative pt-24 pb-8 px-4 flex flex-col items-center text-center bg-gradient-to-b from-slate-50 from-95% to-transparent overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_100%_80%_at_0%_0%,#000_70%,transparent_100%)] pointer-events-none" />
            <div className="relative max-w-5xl mx-auto px-6 space-y-4 z-10 flex flex-col items-center">
                <Badge variant="secondary" className="bg-blue-200/80 text-accent border-blue-400/50 hover:bg-blue-200 px-4 py-1 text-sm">
                    {t("pages.about.hero.badge")}
                </Badge>

                <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.1]">
                    <Trans
                        i18nKey="pages.about.hero.title"
                        components={{ 1: <span className="text-orange-500" /> }}
                    />
                    <br className="hidden md:block" />
                </h1>

                <h3>
                    <span className="text-primary block">{t("pages.about.hero.title_highlight")}</span>
                </h3>

                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
                    {t("pages.about.hero.description_1")}
                </p>

                {/* Styled Trust Gap Section */}
                <div className="relative mt-4 group cursor-default">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-orange-500 to-primary rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                    <div className="relative px-8 py-6 bg-white dark:bg-slate-900 ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center space-x-6">
                        <Quote className="w-6 h-6 text-primary/20 rotate-180 absolute top-2 left-2" />
                        <div className="text-lg md:text-xl font-medium px-6">
                            {t("pages.about.hero.description_2_prefix")} <span className="text-primary font-bold underline decoration-orange-500 underline-offset-4 decoration-2">{t("pages.about.hero.description_2_highlight")}</span> {t("pages.about.hero.description_2_suffix")}
                        </div>

                        <Quote className="w-6 h-6 text-primary/20 absolute bottom-2 right-2" />
                    </div>
                </div>

            </div>
        </section>
    );
}
