import { Button } from "../../../components/ui/button"
import { Camera, FileText, Mail, Send } from "lucide-react"
import { useTranslation } from "react-i18next"

export function StepByStepSection() {
    const { t } = useTranslation();
    const email = import.meta.env.VITE_CONTACT_EMAIL;
    const requiredItems = t("pages.profile.submission.required.items", { returnObjects: true }) as Array<{
        title: string;
        description: string;
    }>;
    const mediaItems = t("pages.profile.submission.media.items", { returnObjects: true }) as Array<{
        title: string;
        description: string;
    }>;
    const subject = t("pages.profile.submission.contact.subject_value");
    const encodedSubject = encodeURIComponent(subject);

    return (
        <section className="py-14 px-2 bg-background flex flex-col items-center">
            <div className="container mx-auto max-w-6xl p-4 flex flex-col items-center gap-6">
                <div className="text-center max-w-2xl px-2">
                    <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground md:text-4xl">{t('pages.profile.submission.title')}</h2>
                    <p className="text-lg leading-8 text-muted">
                        {t('pages.profile.submission.description')}
                    </p>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 lg:p-8 shadow-2xl relative overflow-hidden group w-full flex flex-col items-center">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-8 relative z-10 border-b border-white/20 pb-8 w-full">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                            <div className="flex flex-col items-center gap-2 bg-white/5 px-6 py-4 rounded-lg w-full max-w-xs">
                                <div className="p-3 rounded-xl text-primary shrink-0">
                                    <Mail className="w-6 h-6 justify-center" />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('pages.profile.submission.contact.email_label')}</span>
                                    <a href={`mailto:${email}`} className="font-bold text-white text-lg hover:text-primary transition-colors text-center break-all">{email}</a>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-2 bg-white/5 px-6 py-4 rounded-lg w-full max-w-xs">
                                <div className="p-3 rounded-xl text-primary shrink-0">
                                    <FileText className="w-6 h-6 justify-center" />
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('pages.profile.submission.contact.subject_label')}</span>
                                    <p className="font-bold text-white text-lg hover:text-primary transition-colors break-words">{subject}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-center mt-2 lg:mt-0 lg:ml-4">
                            <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all rounded-lg" asChild>
                                <a href={`mailto:${email}?subject=${encodedSubject}`}>
                                    <Send className="w-5 h-5 mr-2" />
                                    {t('pages.profile.submission.cta_button')}
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative z-10 w-full px-4 text-center md:text-left">
                        <div className="flex flex-col items-center md:items-start p-2">
                            <h3 className="font-bold text-2xl mb-6 flex items-center justify-center md:justify-start gap-3 text-white">
                                <div className="grid place-items-center w-8 h-8 rounded-lg bg-accent text-muted-foreground text-lg font-bold leading-none select-none">1</div>
                                {t('pages.profile.submission.required.title')}
                            </h3>
                            <ul className="space-y-6 flex flex-col items-center md:items-start w-full">
                                {requiredItems.map((item) => (
                                    <li key={item.title} className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                        <div className="w-3 h-3 bg-primary rounded-full mt-2 shrink-0" />
                                        <div>
                                            <strong className="block text-lg text-zinc-100 mb-1">{item.title}</strong>
                                            <span className="text-zinc-400 leading-relaxed block">{item.description}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col items-center md:items-start p-2">
                            <h3 className="font-bold text-2xl mb-6 flex items-center justify-center md:justify-start gap-3 text-white">
                                <div className="grid place-items-center w-8 h-8 rounded-lg bg-destructive text-muted-foreground text-lg font-bold leading-none select-none">2</div>
                                {t('pages.profile.submission.media.title')}
                            </h3>
                            <ul className="space-y-6 flex flex-col items-center md:items-start w-full">
                                {mediaItems.map((item, index) => {
                                    const Icon = index === 0 ? Camera : FileText;

                                    return (
                                        <li key={item.title} className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                            <div className="mt-1 rounded-lg shrink-0 text-destructive">
                                                <Icon className="w-5 h-5 flex" />
                                            </div>
                                            <div>
                                                <strong className="block text-lg text-zinc-100 mb-1">{item.title}</strong>
                                                <span className="text-zinc-400 leading-relaxed block">{item.description}</span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/20 text-center w-full">
                        <p className="text-md text-muted-foreground italic px-4">
                            {t('pages.profile.submission.footer_note')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
