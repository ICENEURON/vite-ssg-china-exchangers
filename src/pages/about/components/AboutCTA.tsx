
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export function AboutCTA() {
    const { t } = useTranslation("translation");
    const email = import.meta.env.VITE_CONTACT_EMAIL;

    return (
        <section className="py-24 px-4 bg-slate-900 text-white text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto max-w-3xl space-y-8 relative z-10">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        {t("pages.about.cta.title")}
                    </h1>
                    <h5 className="text-muted-foreground">
                        {t("pages.about.cta.subtitle")}
                    </h5>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <Button size="lg" className="h-16 px-10 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 transition-all hover:scale-110" asChild>
                        <Link to="/manufacturers">
                            {t("pages.about.cta.button")} <ArrowRight className="ml-2 w-6 h-6" />
                        </Link>
                    </Button>

                    <div className="flex items-center gap-3 text-gray-500 mt-4 pt-8 border-t border-border/30 w-full justify-center">
                        <Mail className="w-5 h-5" />
                        <span className="text-md font-medium">
                            {t("pages.about.cta.email_text")} <a href={`mailto:${email}`} className="text-white hover:text-primary transition-colors">{email}</a>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
