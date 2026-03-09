import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Shield, Factory, Database, Mail } from "lucide-react";

export function HeroSection() {
    const { t } = useTranslation("translation");

    return (
        <section className="relative py-10 px-2 flex justify-center bg-gray-900 overflow-hidden min-h-144">
            <div className="absolute inset-0" />
            <div className="absolute inset-0 bg-[url('/static/websites/home-hero.png')] bg-cover bg-center mix-blend-overlay opacity-60" />
            <div className="relative container px-4 max-w-6xl flex flex-col items-center justify-center text-center z-10 gap-4">
                <h1 className="text-white p-2 mt-10">
                    {t("pages.home.hero.title")}
                </h1>
                <h5 className="text-gray-200 p-2">
                    {t("pages.home.hero.subtitle")}
                </h5>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105" asChild>
                        <a href="/rfq" className="flex gap-4 items-center justify-center">
                            <Mail className="w-5 h-5" />
                            {t("pages.home.hero.cta_primary")}
                        </a>
                    </Button>
                    <Button size="lg" variant="secondary" asChild>
                        <a href="/manufacturers">
                            {t("pages.home.hero.cta_secondary")}
                        </a>
                    </Button>
                </div>

                {/* Trust Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400 text-sm font-medium border-t border-gray-700/50 p-4 mt-6 w-full">
                    <div className="flex items-center justify-center gap-4">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="text-sm text-gray-300">{t("pages.home.hero.trust_bar.verified")}</span>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <Factory className="h-5 w-5 text-primary" />
                        <span className="text-sm text-gray-300">{t("pages.home.hero.trust_bar.direct")}</span>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <Database className="h-5 w-5 text-primary" />
                        <span className="text-sm text-gray-300">{t("pages.home.hero.trust_bar.database")}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
