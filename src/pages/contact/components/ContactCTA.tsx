import { Mail, ArrowRight } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { useTranslation } from "react-i18next";

export function ContactCTA() {
    const { t } = useTranslation("translation");
    const email = import.meta.env.VITE_CONTACT_EMAIL;

    return (
        <section className="py-24 px-4 bg-slate-900 text-white text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto max-w-3xl space-y-8 relative z-10">
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        {t("pages.contact.cta.title")}
                    </h2>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto">
                        {t("pages.contact.cta.subtitle")}
                    </p>
                </div>

                <div className="flex flex-col items-center gap-6">
                    {/* Email label */}
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                        {t("pages.contact.cta.email_label")}
                    </p>

                    {/* Email button */}
                    <a
                        href={`mailto:${email}`}
                        className="group inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white text-xl md:text-2xl font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                    >
                        <Mail className="w-6 h-6" />
                        {email}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>

                    {/* 48-hour badge */}
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/40 hover:bg-green-500/30 px-4 py-2 text-sm font-medium">
                        {t("pages.contact.cta.response_badge")}
                    </Badge>

                    {/* Note */}
                    <p className="text-sm text-slate-500 max-w-md leading-relaxed mt-4">
                        {t("pages.contact.cta.note")}
                    </p>
                </div>
            </div>
        </section>
    );
}
