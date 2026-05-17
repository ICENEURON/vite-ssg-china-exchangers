import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ContactCTA() {
    const { t } = useTranslation("translation");
    const email = import.meta.env.VITE_CONTACT_EMAIL;
    const checklist = t("pages.contact.cta.checklist", { returnObjects: true }) as string[];

    return (
        <section id="contact-email" className="scroll-mt-24 flex justify-center bg-navbar/95 px-2 py-16 text-white">
            <div className="container max-w-5xl px-4">
                <div className="grid overflow-hidden border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 md:grid-cols-[0.95fr_1.05fr]">
                    <div className="flex flex-col gap-5 border-b border-white/10 bg-white/[0.03] p-6 md:border-b-0 md:border-r md:p-8">
                        <div>
                            <div className="flex items-center gap-3 text-orange-200">
                                <Mail className="size-7 text-orange-300" />
                                <p className="text-xl font-bold tracking-tight text-white md:text-2xl">
                                    {t("pages.contact.cta.email_label")}
                                </p>
                            </div>
                            <p className="mt-3 text-sm leading-7 text-gray-400">
                                {t("pages.contact.cta.note")}
                            </p>
                        </div>
                        <a
                            href={`mailto:${email}`}
                            className="group flex w-full flex-row items-center justify-between gap-4 border border-white/85 bg-white px-5 py-4 text-base font-bold text-slate-950 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-xl hover:shadow-black/25 md:text-lg"
                        >
                            <span className="break-all">{email}</span>
                            <ArrowRight className="size-5 shrink-0 text-slate-500 transition-all group-hover:translate-x-1 group-hover:text-blue-700" />
                        </a>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h3 className="text-xl font-bold text-white">
                                {t("pages.contact.cta.checklist_title")}
                            </h3>
                        </div>
                        <div className="mt-6 grid grid-cols-1 gap-3">
                            {checklist.map((item) => (
                                <div key={item} className="flex items-start gap-3 border border-white/10 bg-white/[0.03] p-4 text-left text-sm leading-6 text-slate-300 transition-colors duration-300 hover:border-orange-300/30 hover:bg-orange-300/5">
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
