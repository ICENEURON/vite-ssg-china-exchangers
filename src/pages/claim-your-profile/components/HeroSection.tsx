
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge";
import { ShieldCheck, Mail, CheckCircle2 } from "lucide-react"
import { useTranslation } from "react-i18next"

export function HeroSection() {
    const { t } = useTranslation();
    return (
        <section className="relative overflow-hidden py-24 lg:py-32 px-8 lg:px-16 bg-background">
            {/* Dynamic Background */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-[100px] opacity-20 pointer-events-none">
                <div className="aspect-square w-[800px] rounded-full bg-blue-600/40 mix-blend-multiply dark:mix-blend-screen animate-pulse" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container relative px-4 mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Content Left */}
                    <div className="text-left space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                        <Badge variant="secondary" className="bg-blue-200/80 text-accent border-blue-400/50 hover:bg-blue-200">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-800 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-800"></span>
                            </span>
                            {t("pages.profile.hero.status_badge")}
                        </Badge>

                        <h1 className="font-extrabold">
                            {t('pages.profile.hero.title_prefix')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 animate-gradient-x">{t('pages.profile.hero.title_suffix')}</span>
                        </h1>

                        <h4 className="text-muted max-w-xl text-muted/90">
                            {t('pages.profile.hero.description')}
                        </h4>

                        <div className="flex flex-wrap gap-4 pt-4 text-sm font-medium text-accent">
                            <div className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="w-4 h-4 text-blue-800" /> {t('pages.profile.hero.features.manual_verification')}</div>
                            <div className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="w-4 h-4 text-blue-800" /> {t('pages.profile.hero.features.license_check')}</div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all bg-blue-600 hover:bg-blue-700 group" asChild>
                                <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}?subject=[Claim Profile] Verification Request`}>
                                    <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                    {t('pages.profile.hero.cta')}
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Visual Right: High-Fidelity Certificate */}
                    <div className="hidden lg:block relative group perspective-[2000px] z-10">

                        {/* Visual Backdrop (Glow) */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-amber-500/10 blur-3xl transform rotate-6 scale-90" />

                        {/* The "Document" */}
                        <div className="relative mx-auto w-[420px] h-[580px] bg-[#fdfbf7] dark:bg-[#1a1a1a] rounded-[4px] shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 transform rotate-y-[8deg] rotate-x-[4deg] hover:rotate-y-0 hover:rotate-x-0 transition-all duration-700 ease-out preserve-3d">
                            {/* Paper Texture Overlay */}
                            <div className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none" />
                            {/* Border Guilloche Pattern (Simulated) */}
                            <div className="absolute inset-3 border-[3px] border-double border-zinc-300 dark:border-zinc-700 opacity-50" />
                            <div className="absolute inset-4 border border-zinc-200 dark:border-zinc-800 opacity-30" />
                            {/* Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none rotate-[-30deg]">
                                <ShieldCheck className="w-72 h-72" />
                            </div>
                            {/* Content Layer */}
                            <div className="relative h-full flex flex-col">
                                {/* Header */}
                                <div className="text-center mb-10 space-y-2">
                                    <div className="flex justify-center mb-4">
                                        <ShieldCheck className="w-12 h-12 text-accent" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground tracking-wide">{t('pages.profile.hero.certificate.title')}</h3>
                                    <div className="h-px w-24 bg-zinc-300 dark:bg-zinc-700 mx-auto" />
                                </div>

                                {/* Body */}
                                <div className="flex-1 space-y-4 px-4 text-center">
                                    <p className="text-sm font-serif italic text-muted">{t('pages.profile.hero.certificate.certifies_text')}</p>
                                    <div className="space-y-4">
                                        <div className="h-2 w-full" />
                                        <p className="text-[10px] uppercase tracking-wider text-muted">{t('pages.profile.hero.certificate.company_name_placeholder')}</p>
                                        <div className="h-1 w-full" />
                                    </div>

                                    <p className="text-sm font-serif italic text-muted">{t('pages.profile.hero.certificate.identified_text')}</p>

                                    <div className="font-serif font-bold text-foreground text-lg border-b border-zinc-300 dark:border-zinc-700 pb-1">
                                        {t('pages.profile.hero.certificate.database_name')}
                                    </div>
                                </div>

                                {/* Footer Seals */}
                                <div className="mt-auto flex items-end justify-between px-2 pt-8">
                                    <div className="text-center space-y-1">
                                        <div className="w-24 border-b border-zinc-400 dark:border-zinc-600 mb-1" />
                                        <div className="text-[10px] uppercase text-muted font-bold">{t('pages.profile.hero.certificate.signature_label')}</div>
                                    </div>

                                    {/* Gold Seal Effect */}
                                    <div className="relative w-20 h-20">
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 rounded-full shadow-lg flex items-center justify-center p-1">
                                            <div className="w-full h-full border-[1px] border-yellow-200 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-500 to-yellow-700">
                                                <ShieldCheck className="w-10 h-10 text-yellow-100 drop-shadow-md" />
                                            </div>
                                        </div>
                                        {/* Shine Animation */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent rounded-full opacity-0 hover:opacity-100 animate-[shimmer_2s_infinite]" />
                                    </div>
                                </div>
                            </div>

                            {/* Prominent Stamp */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-12 pointer-events-none">
                                <div className="border-[6px] border-red-600/20 text-red-600/20 font-black text-4xl px-8 py-4 rounded-lg uppercase tracking-widest mix-blend-multiply dark:mix-blend-color-dodge">
                                    {t('pages.profile.hero.certificate.status_stamp')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
