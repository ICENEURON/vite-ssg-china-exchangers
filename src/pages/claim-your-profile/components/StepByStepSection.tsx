import { useState } from "react"
import { Mail } from "lucide-react"
import { useTranslation } from "react-i18next"

export function StepByStepSection() {
    const { t } = useTranslation();
    const email = import.meta.env.VITE_CONTACT_EMAIL;
    const copiedText = t('pages.profile.submission.contact.copied');

    const requiredTitle = t("pages.profile.submission.required.title");
    const requiredDesc = t("pages.profile.submission.required.description");

    const mediaTitle = t("pages.profile.submission.media.title");
    const mediaDesc = t("pages.profile.submission.media.description");

    const subjectLabel = t("pages.profile.submission.contact.subject_label");
    const subjectDesc = t("pages.profile.submission.contact.subject_description");

    const [copied, setCopied] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="pb-14 px-2 bg-background flex flex-col items-center">
            <div className="container mx-auto max-w-6xl p-4 flex flex-col items-center gap-6">
                <div className="bg-slate-900 rounded-xl p-6 md:p-10 shadow-2xl relative overflow-hidden w-full flex flex-col items-center">
                    <div className="flex items-center justify-center relative z-10 border-b border-white/10 pb-6 mb-6 md:pb-10 md:mb-10 w-full">
                        <button
                            onClick={handleCopyEmail}
                            className="group relative flex flex-row items-center justify-center gap-4 transition-all duration-300 cursor-pointer"
                        >
                            <Mail className="w-7 h-7 md:w-8 md:h-8 text-primary shrink-0 transition-transform group-hover:scale-110" />
                            <span className="font-semibold text-2xl md:text-3xl tracking-tight text-white group-hover:underline underline-offset-4 transition-all">
                                {email}
                            </span>
                            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                {copied && (
                                    <div className="bg-orange-500/20 text-orange-500 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
                                        {copiedText}
                                    </div>
                                )}
                            </div>
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 lg:gap-10 relative z-10 w-full text-left">
                        <div className="flex flex-col items-start">
                            <h3 className="font-bold text-xl mb-4 flex items-center justify-start gap-3 text-white">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-muted-foreground text-base font-bold select-none">1</div>
                                {requiredTitle}
                            </h3>
                            <p className="text-zinc-400 leading-relaxed text-sm">
                                {requiredDesc}
                            </p>
                        </div>

                        <div className="flex flex-col items-start">
                            <h3 className="font-bold text-xl mb-4 flex items-center justify-start gap-3 text-white">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500 text-white text-base font-bold select-none">2</div>
                                {mediaTitle}
                            </h3>
                            <p className="text-zinc-400 leading-relaxed text-sm">
                                {mediaDesc}
                            </p>
                        </div>

                        <div className="flex flex-col items-start md:col-span-2 lg:col-span-1">
                            <h3 className="font-bold text-xl mb-4 flex items-center justify-start gap-3 text-white">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500 text-white text-base font-bold select-none">3</div>
                                {subjectLabel}
                            </h3>
                            <p className="text-zinc-400 leading-relaxed text-sm">
                                {subjectDesc}
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/10 text-center w-full">
                        <p className="text-sm text-muted-foreground italic px-4">
                            {t('pages.profile.submission.footer_note')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
