import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { ArrowRight, Building2, CheckCircle2, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { addLanguageToPath, useCurrentLanguage } from "../../../utils/language-routing";

function BrandName() {
    return (
        <span className="whitespace-nowrap">
            HeatEx <span className="text-orange-300">Direct</span>
        </span>
    );
}

export function ContactHero() {
    const { t } = useTranslation("translation");
    const currentLanguage = useCurrentLanguage();
    const email = import.meta.env.VITE_CONTACT_EMAIL;
    const updateProfilePath = addLanguageToPath("/update-your-profile", currentLanguage);
    const contentMarketingPath = addLanguageToPath("/content-marketing-services", currentLanguage);

    return (
        <section className="relative isolate flex min-h-[560px] justify-center overflow-hidden bg-navbar px-2 py-16 text-navbar-foreground">
            <div className="absolute inset-0 -z-20 bg-[url('/static/websites/home-hero.png')] bg-cover bg-center opacity-30" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navbar/92 via-navbar/86 to-navbar" />

            <div className="container z-10 flex max-w-6xl flex-col justify-center gap-7 px-4">
                <div className="max-w-5xl space-y-5">
                    <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
                        {t("pages.contact.hero.title_prefix")}
                        <BrandName />
                        {t("pages.contact.hero.title_suffix")}
                    </h1>

                    <p className="max-w-3xl text-lg leading-8 text-gray-100 md:text-xl">
                        {t("pages.contact.hero.subtitle")}
                    </p>

                    <p className="max-w-3xl text-sm leading-7 text-gray-300 md:text-base">
                        <BrandName />
                        {t("pages.contact.hero.description")}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button size="lg" className="bg-primary px-6 py-4 text-white hover:bg-primary/90" asChild>
                        <Link to={updateProfilePath}>
                            <Building2 className="size-5" />
                            {t("pages.contact.hero.primary_cta")}
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-white/25 bg-white/10 px-6 py-4 text-white hover:bg-white hover:text-slate-900" asChild>
                        <Link to={contentMarketingPath}>
                            <Newspaper className="size-5" />
                            {t("pages.contact.hero.secondary_cta")}
                        </Link>
                    </Button>
                </div>

                <a href={`mailto:${email}`} className="flex w-fit items-center gap-2 text-sm font-semibold text-gray-200 transition-colors hover:text-orange-200">
                    <CheckCircle2 className="size-4 text-orange-300" />
                    {t("pages.contact.hero.email_prefix")} {email}
                    <ArrowRight className="size-4" />
                </a>
            </div>
        </section>
    );
}
