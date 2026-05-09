import { useTranslation, Trans } from "react-i18next";
import { Badge } from "../../../components/ui/badge";
import { Quote } from "lucide-react";

export function AboutHero() {
    const { t } = useTranslation("translation");

    return (
        <section className="relative py-10 px-2 flex justify-center flex-col items-center justify-center text-center bg-gradient-to-b from-slate-50 from-95% to-transparent overflow-hidden">
            <div className="absolute inset-0 bg-grid-hero-start pointer-events-none" />
            <div className="container pt-16 px-2 relative max-w-6xl flex flex-col items-center justify-center gap-2 z-10 w-full">
                <Badge variant="secondary" className="bg-blue-200/80 text-accent border-blue-400/50 hover:bg-blue-200 px-4 py-2 text-sm">
                    {t("pages.about.hero.badge")}
                </Badge>

                <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] p-2 text-center w-full">
                    <Trans
                        i18nKey="pages.about.hero.title"
                        components={{ 1: <span className="text-orange-500" /> }}
                    />
                </h1>

                <h3 className="text-center w-full">
                    <span className="text-primary block">{t("pages.about.hero.title_highlight")}</span>
                </h3>

                <p className="text-xl text-slate-600 w-full text-center leading-relaxed font-light p-2">
                    {t("pages.about.hero.description_1")}
                </p>

                {/* Styled Trust Gap Section */}
                <div className="relative group cursor-default flex flex-col items-center justify-center p-4 gap-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-orange-500 to-primary rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 pointer-events-none" />
                    <div className="relative p-4 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex flex-row items-center justify-center gap-4">
                        <Quote className="w-6 h-6 text-primary/20 rotate-180 shrink-0" />
                        <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-lg md:text-xl font-medium text-center">
                            <span>{t("pages.about.hero.description_2_prefix")}</span>
                            <span className="text-primary font-bold underline decoration-orange-500 underline-offset-4 decoration-2">
                                {t("pages.about.hero.description_2_highlight")}
                            </span>
                            <span>{t("pages.about.hero.description_2_suffix")}</span>
                        </div>
                        <Quote className="w-6 h-6 text-primary/20 shrink-0" />
                    </div>
                </div>

            </div>
        </section>
    );
}
