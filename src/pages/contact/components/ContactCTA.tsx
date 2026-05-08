import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { useTranslation } from "react-i18next";

export function ContactCTA() {
    const { t } = useTranslation("translation");
    const email = import.meta.env.VITE_CONTACT_EMAIL;
    const checklist = t("pages.contact.cta.checklist", { returnObjects: true }) as string[];

    return (
        <section className="relative py-12 px-2 flex flex-col justify-center items-center w-full bg-slate-900 text-white overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 items-center gap-8 z-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="flex flex-col items-center justify-center p-4 gap-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center">
                        {t("pages.contact.cta.title")}
                    </h2>
                    <p className="text-lg text-slate-400 text-center p-2">
                        {t("pages.contact.cta.subtitle")}
                    </p>
                </div>

                <div className="flex flex-col gap-5 p-4">
                    <div className="flex flex-col items-center justify-center gap-4 w-full text-center">
                        <a
                            href={`mailto:${email}`}
                            className="group flex w-full flex-row items-center justify-center p-6 gap-4 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white text-lg md:text-2xl font-bold rounded-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02]"
                        >
                            <Mail className="w-6 h-6" />
                            <span className="text-center">{email}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>

                        <Badge className="bg-green-500/20 text-green-300 border-green-500/40 hover:bg-green-500/30 p-2 text-sm font-medium text-center mt-1">
                            {t("pages.contact.cta.response_badge")}
                        </Badge>

                        <p className="text-sm text-slate-500 leading-relaxed text-center">
                            {t("pages.contact.cta.note")}
                        </p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur">
                        <h3 className="text-xl font-bold text-white">
                            {t("pages.contact.cta.checklist_title")}
                        </h3>
                        <div className="mt-5 grid grid-cols-1 gap-3">
                            {checklist.map((item) => (
                                <div key={item} className="flex items-start gap-3 text-left text-sm leading-6 text-slate-300">
                                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-orange-300" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
