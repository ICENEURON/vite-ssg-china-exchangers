import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Shield, Factory, Database } from "lucide-react";

export function HeroSection() {
    const { t } = useTranslation("translation");

    return (
        <section className="relative py-16 lg:py-24 overflow-hidden bg-gray-900">
            <div className="absolute inset-0" />
            <div className="absolute inset-0 bg-[url('/static/images/home-hero.png')] bg-cover bg-center mix-blend-overlay opacity-60" />
            <div className="relative container mx-auto px-2 text-center z-10">
                <h1 className="text-white mb-10 max-w-5xl mx-auto px-12">
                    {t("pages.home.hero.title")}
                </h1>
                <h5 className="text-gray-200 mb-10 max-w-3xl mx-auto px-12">
                    {t("pages.home.hero.subtitle")}
                </h5>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <Button size="lg" variant="default" asChild>
                        <a href="/rfq">
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
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-gray-400 text-sm font-medium border-t border-gray-700/50 pt-8 max-w-4xl mx-auto">
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="text-sm text-gray-300">{t("pages.home.hero.trust_bar.verified")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Factory className="h-5 w-5 text-primary" />
                        <span className="text-sm text-gray-300">{t("pages.home.hero.trust_bar.direct")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        <span className="text-sm text-gray-300">{t("pages.home.hero.trust_bar.database")}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
