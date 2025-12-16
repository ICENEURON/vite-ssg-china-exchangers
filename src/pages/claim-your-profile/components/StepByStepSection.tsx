import { Button } from "../../../components/ui/button"
import { Mail, FileText, Camera, Send } from "lucide-react"
import { useTranslation } from "react-i18next"

export function StepByStepSection() {
    const { t } = useTranslation();

    return (
        <section className="py-24 bg-background">
            <div className="container px-8 mx-auto max-w-5xl">
                <div className="text-center mb-8">
                    <h1 className="font-bold tracking-tight mb-4 text-foreground">{t('pages.profile.steps_guide.title')}</h1>
                    <h5 className="text-muted">
                        {t('pages.profile.steps_guide.description')}
                    </h5>
                </div>

                <div className="bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8 relative z-10 border-b border-white/20 pb-8">
                        <div className="space-y-4 text-left">
                            <div className="flex flex-col sm:flex-row items-center gap-2 bg-white/4 px-4 py-2 rounded-2xl">
                                <div className="p-3 rounded-xl text-primary shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('pages.profile.steps_guide.contact.email_label')}</span>
                                    <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`} className="font-bold text-white text-lg hover:text-primary transition-colors">{import.meta.env.VITE_CONTACT_EMAIL}</a>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-2 bg-white/4 px-4 py-2 rounded-2xl">
                                <div className="p-3 rounded-xl text-primary shrink-0">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col text-left items-start">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('pages.profile.steps_guide.contact.subject_label')}</span>
                                    <p className="font-bold text-white text-lg hover:text-primary transition-colors">{t('pages.profile.steps_guide.contact.subject_value')}</p>
                                </div>
                            </div>
                        </div>

                        <Button size="lg" className="shrink-0 h-14 px-8 text-base shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl" asChild>
                            <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}?subject=%5BClaim%20Profile%5D%20-%20YOUR%20COMPANY%20NAME`}>
                                <Send className="w-5 h-5 mr-2" />
                                {t('pages.profile.steps_guide.cta_button')}
                            </a>
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16 relative z-10">
                        <div>
                            <h3 className="font-bold text-2xl mb-8 flex items-center gap-3 text-white">
                                <div className="grid place-items-center w-8 h-8 rounded-lg bg-accent text-muted-foreground text-lg font-bold leading-none select-none">1</div>
                                {t('pages.profile.steps_guide.required_info.title')}
                            </h3>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="w-3 h-3 bg-primary rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                    <div>
                                        <strong className="block text-lg text-zinc-100 mb-1">{t('pages.profile.steps_guide.required_info.items.identity.title')}</strong>
                                        <span className="text-zinc-400 leading-relaxed">{t('pages.profile.steps_guide.required_info.items.identity.description')}</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-3 h-3 bg-primary rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                    <div>
                                        <strong className="block text-lg text-zinc-100 mb-1">{t('pages.profile.steps_guide.required_info.items.contact.title')}</strong>
                                        <span className="text-zinc-400 leading-relaxed">{t('pages.profile.steps_guide.required_info.items.contact.description')}</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-3 h-3 bg-primary rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                    <div>
                                        <strong className="block text-lg text-zinc-100 mb-1">{t('pages.profile.steps_guide.required_info.items.docs.title')}</strong>
                                        <span className="text-zinc-400 leading-relaxed">{t('pages.profile.steps_guide.required_info.items.docs.description')}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-2xl mb-8 flex items-center gap-3 text-white">
                                <div className="grid place-items-center w-8 h-8 rounded-lg bg-destructive text-muted-foreground text-lg font-bold leading-none select-none">2</div>
                                {t('pages.profile.steps_guide.optional_info.title')}
                            </h3>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="mt-1 rounded-lg shrink-0 text-destructive">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <strong className="block text-lg text-zinc-100 mb-1">{t('pages.profile.steps_guide.optional_info.items.photos.title')}</strong>
                                        <span className="text-zinc-400 leading-relaxed">{t('pages.profile.steps_guide.optional_info.items.photos.description')}</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="mt-1 rounded-lg  shrink-0 text-destructive">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <strong className="block text-lg text-zinc-100 mb-1">{t('pages.profile.steps_guide.optional_info.items.description.title')}</strong>
                                        <span className="text-zinc-400 leading-relaxed">{t('pages.profile.steps_guide.optional_info.items.description.description')}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/20 text-center">
                        <p className="text-md text-muted-foreground italic">
                            {t('pages.profile.steps_guide.footer_note')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
