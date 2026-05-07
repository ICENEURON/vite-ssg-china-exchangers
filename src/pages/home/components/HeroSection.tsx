import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { QuoteCta } from "../../../components/ui/quote-cta";
import { Database, Factory, Mail, ShieldCheck } from "lucide-react";
import { addLanguageToPath, useCurrentLanguage } from "../../../utils/language-routing";

export function HeroSection() {
    const { t } = useTranslation("translation");
    const currentLanguage = useCurrentLanguage();
    const trustItems = t("pages.home.hero.trust_bar", { returnObjects: true }) as string[];
    const trustIcons = [ShieldCheck, Factory, Database, Mail];
    const rfqPath = addLanguageToPath("/rfq", currentLanguage);
    const manufacturersPath = addLanguageToPath("/manufacturers", currentLanguage);

    return (
        <section className="relative px-2 py-16 flex justify-center bg-gray-900 overflow-hidden min-h-[620px]">
            <div className="absolute inset-0 bg-[url('/static/websites/home-hero.png')] bg-cover bg-center opacity-45" />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/95" />

            <div className="relative container px-4 max-w-6xl flex flex-col items-center justify-center text-center z-10 gap-6">
                <p className="inline-flex items-center justify-center rounded-sm border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-gray-100 backdrop-blur">
                    {t("pages.home.hero.eyebrow")}
                </p>

                <h1 className="text-white max-w-5xl text-[2.6rem] md:text-[4.5rem] font-bold leading-tight p-2">
                    {t("pages.home.hero.title")}
                </h1>

                <p className="text-xl md:text-2xl text-gray-100 max-w-4xl leading-relaxed p-2">
                    {t("pages.home.hero.subtitle")}
                </p>

                <p className="text-base md:text-lg text-gray-300 max-w-3xl leading-relaxed p-2">
                    {t("pages.home.hero.description")}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4">
                    <QuoteCta size="lg" asChild>
                        <a href={rfqPath}>
                            <Mail className="w-5 h-5" />
                            {t("navigation.menu.rfq")}
                        </a>
                    </QuoteCta>
                    <Button size="lg" variant="secondary" asChild>
                        <a href={manufacturersPath}>
                            {t("pages.home.hero.cta_secondary")}
                        </a>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-gray-300 text-sm font-medium border-t border-white/15 p-4 mt-4 w-full">
                    {trustItems.map((item, index) => {
                        const Icon = trustIcons[index] || ShieldCheck;

                        return (
                            <div key={item} className="flex items-center justify-center gap-3 rounded-sm border border-white/10 bg-white/5 px-3 py-3">
                                <Icon className="h-5 w-5 text-orange-300" />
                                <span>{item}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
