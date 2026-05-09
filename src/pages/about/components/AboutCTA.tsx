import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { addLanguageToPath, useCurrentLanguage } from "../../../utils/language-routing";

export function AboutCTA() {
    const { t } = useTranslation("translation");
    const currentLanguage = useCurrentLanguage();
    const email = import.meta.env.VITE_CONTACT_EMAIL;
    const manufacturersPath = addLanguageToPath("/manufacturers", currentLanguage);

    return (
        <section className="flex justify-center bg-slate-900 px-2 py-12 text-center text-white">
            <div className="container flex max-w-6xl flex-col items-center justify-center gap-5 px-4 text-center">
                <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        {t("pages.about.cta.title")}
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-gray-300 md:text-base">
                        {t("pages.about.cta.subtitle")}
                    </p>
                </div>

                <div className="flex w-full flex-col items-center justify-center gap-4">
                    <Button size="lg" className="h-12 px-6 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-3" asChild>
                        <Link to={manufacturersPath}>
                            {t("pages.about.cta.button")} <ArrowRight className="w-6 h-6" />
                        </Link>
                    </Button>

                    <div className="mt-2 flex w-full items-center justify-center gap-3 border-t border-white/10 p-4 text-gray-400">
                        <Mail className="w-5 h-5 shrink-0" />
                        <span className="text-md font-medium">
                            {t("pages.about.cta.email_text")} <a href={`mailto:${email}`} className="text-white hover:text-primary transition-colors">{email}</a>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
