
import { Button } from "../../../components/ui/button"
import { ArrowRight, Globe } from "lucide-react"
import { useTranslation, Trans } from "react-i18next"

export function HeroSection() {
    const { t } = useTranslation("translation", { keyPrefix: "pages.cms.hero" });

    return (
        <section className="relative overflow-hidden py-20 px-4">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 blur-3xl opacity-20 pointer-events-none">
                <div className="aspect-square w-[800px] rounded-full bg-foreground/40 mix-blend-multiply" />
            </div>
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 blur-3xl opacity-20 pointer-events-none">
                <div className="aspect-square w-[600px] rounded-full bg-blue-500/40 mix-blend-multiply" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />

            <div className="container relative px-4 mx-auto max-w-5xl text-center">
                {/* Badge */}
                <div className="inline-flex items-center rounded-full border border-orange-600/50 px-3 py-1 text-sm font-medium bg-secondary/50 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Globe className="mr-2 h-3.5 w-3.5 text-orange-600" />
                    <span className="text-orange-600">{t("badge")}</span>
                </div>

                <h1 className="font-extrabold tracking-tight mb-6">
                    <Trans i18nKey="pages.cms.hero.title" components={[<span className="text-accent" key="0" />]} />
                </h1>

                <p className="mt-6 text-xl text-muted max-w-2xl mx-auto leading-relaxed">
                    {t("description")}
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="h-14 px-8 text-lg rounded-full group" asChild>
                        <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}>
                            {t("buttons.start_publishing")}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    )
}
