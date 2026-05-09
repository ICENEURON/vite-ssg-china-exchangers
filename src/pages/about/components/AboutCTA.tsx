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
        <section className="py-10 px-2 flex justify-center bg-slate-900 text-white text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="container px-4 max-w-6xl flex flex-col items-center justify-center gap-4 relative z-10 w-full text-center">
                <div className="flex flex-col items-center justify-center gap-4 p-4 w-full text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        {t("pages.about.cta.title")}
                    </h1>
                    <h4 className="text-muted-foreground">
                        {t("pages.about.cta.subtitle")}
                    </h4>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 p-4 w-full">
                    <Button size="lg" className="h-16 px-10 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 transition-all hover:scale-110 flex items-center justify-center gap-4" asChild>
                        <Link to={manufacturersPath}>
                            {t("pages.about.cta.button")} <ArrowRight className="w-6 h-6" />
                        </Link>
                    </Button>

                    <div className="flex items-center justify-center gap-4 text-gray-500 mt-4 p-4 border-t border-border/30 w-full">
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
