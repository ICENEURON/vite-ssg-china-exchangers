import { Button } from "../../../components/ui/button"
import { Mail, FileText, Camera, Send } from "lucide-react"
import { useTranslation } from "react-i18next"

export function StepByStepSection() {
    const { t } = useTranslation();

    return (
        <section className="py-10 px-2 bg-background flex flex-col items-center">
            <div className="container mx-auto max-w-6xl p-4 flex flex-col items-center gap-6">
                <div className="text-center max-w-2xl px-2">
                    <h1 className="font-bold tracking-tight mb-4 text-foreground">{t('pages.profile.steps_guide.title')}</h1>
                    <h5 className="text-muted">
                        {t('pages.profile.steps_guide.description')}
                    </h5>
                </div>

                <div className="bg-gray-900 rounded-[2.5rem] p-6 lg:p-8 shadow-2xl relative overflow-hidden group w-full flex flex-col items-center">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-8 relative z-10 border-b border-white/20 pb-8 w-full">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                            <div className="flex flex-col items-center gap-2 bg-white/4 px-6 py-4 rounded-2xl w-full max-w-xs">
                                <div className="p-3 rounded-xl text-primary shrink-0">
                                    <Mail className="w-6 h-6 justify-center" />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('pages.profile.steps_guide.contact.email_label')}</span>
                                    <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`} className="font-bold text-white text-lg hover:text-primary transition-colors text-center break-all">{import.meta.env.VITE_CONTACT_EMAIL}</a>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-2 bg-white/4 px-6 py-4 rounded-2xl w-full max-w-xs">
                                <div className="p-3 rounded-xl text-primary shrink-0">
                                    <FileText className="w-6 h-6 justify-center" />
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('pages.profile.steps_guide.contact.subject_label')}</span>
                                    <p className="font-bold text-white text-lg hover:text-primary transition-colors break-words">{t('pages.profile.steps_guide.contact.subject_value')}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-center mt-2 lg:mt-0 lg:ml-4">
                            <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl" asChild>
                                <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}?subject=%5BClaim%20Profile%5D%20-%20YOUR%20COMPANY%20NAME`}>
                                    <Send className="w-5 h-5 mr-2" />
                                    {t('pages.profile.steps_guide.cta_button')}
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative z-10 w-full px-4 text-center md:text-left">
                        <div className="flex flex-col items-center md:items-start p-2">
                            <h3 className="font-bold text-2xl mb-6 flex items-center justify-center md:justify-start gap-3 text-white">
                                <div className="grid place-items-center w-8 h-8 rounded-lg bg-accent text-muted-foreground text-lg font-bold leading-none select-none">1</div>
                                {t('pages.profile.steps_guide.required_info.title')}
                            </h3>
                            <ul className="space-y-6 flex flex-col items-center md:items-start w-full">
                                <li className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                    <div className="w-3 h-3 bg-primary rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                    <div>
                                        <strong className="block text-lg text-zinc-100 mb-1">{t('pages.profile.steps_guide.required_info.items.identity.title')}</strong>
                                        <span className="text-zinc-400 leading-relaxed block">{t('pages.profile.steps_guide.required_info.items.identity.description')}</span>
                                    </div>
                                </li>
                                <li className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                    <div className="w-3 h-3 bg-primary rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                    <div>
                                        <strong className="block text-lg text-zinc-100 mb-1">{t('pages.profile.steps_guide.required_info.items.contact.title')}</strong>
                                        <span className="text-zinc-400 leading-relaxed block">{t('pages.profile.steps_guide.required_info.items.contact.description')}</span>
                                    </div>
                                </li>
                                <li className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                    <div className="w-3 h-3 bg-primary rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                    <div>
                                        <strong className="block text-lg text-zinc-100 mb-1">{t('pages.profile.steps_guide.required_info.items.docs.title')}</strong>
                                        <span className="text-zinc-400 leading-relaxed block">{t('pages.profile.steps_guide.required_info.items.docs.description')}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col items-center md:items-start p-2">
                            <h3 className="font-bold text-2xl mb-6 flex items-center justify-center md:justify-start gap-3 text-white">
                                <div className="grid place-items-center w-8 h-8 rounded-lg bg-destructive text-muted-foreground text-lg font-bold leading-none select-none">2</div>
                                {t('pages.profile.steps_guide.optional_info.title')}
                            </h3>
                            <ul className="space-y-6 flex flex-col items-center md:items-start w-full">
                                <li className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                    <div className="mt-1 rounded-lg shrink-0 text-destructive">
                                        <Camera className="w-5 h-5 flex" />
                                    </div>
                                    <div>
                                        <strong className="block text-lg text-zinc-100 mb-1">{t('pages.profile.steps_guide.optional_info.items.photos.title')}</strong>
                                        <span className="text-zinc-400 leading-relaxed block">{t('pages.profile.steps_guide.optional_info.items.photos.description')}</span>
                                    </div>
                                </li>
                                <li className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                    <div className="mt-1 rounded-lg shrink-0 text-destructive">
                                        <FileText className="w-5 h-5 flex" />
                                    </div>
                                    <div>
                                        <strong className="block text-lg text-zinc-100 mb-1">{t('pages.profile.steps_guide.optional_info.items.description.title')}</strong>
                                        <span className="text-zinc-400 leading-relaxed block">{t('pages.profile.steps_guide.optional_info.items.description.description')}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/20 text-center w-full">
                        <p className="text-md text-muted-foreground italic px-4">
                            {t('pages.profile.steps_guide.footer_note')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
