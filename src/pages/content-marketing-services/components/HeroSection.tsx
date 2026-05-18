
import { Button } from "../../../components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTranslation, Trans } from "react-i18next"

export function HeroSection() {
    const { t } = useTranslation("translation", { keyPrefix: "pages.cms.hero" });

    const handleScrollToEmail: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault();
        const el = document.getElementById("cms-email");
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY - 50;
        window.scrollTo({ top: y, behavior: "smooth" });
    };

    return (
        <section className="relative overflow-hidden px-2 py-8 md:py-10">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 blur-3xl opacity-20 pointer-events-none">
                <div className="aspect-square w-[800px] rounded-full bg-foreground/40 mix-blend-multiply" />
            </div>
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 blur-3xl opacity-20 pointer-events-none">
                <div className="aspect-square w-[600px] rounded-full bg-blue-500/40 mix-blend-multiply" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-grid-cms pointer-events-none" />

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />

            <div className="container relative mx-auto max-w-5xl px-2 pt-8 text-center md:pt-12">
                {/* Badge removed per requirement */}

                <h1 className="font-extrabold tracking-tight mb-6">
                    {t("title")}
                </h1>

                <p className="mt-6 text-xl text-muted max-w-3xl mx-auto leading-relaxed">
                    <Trans
                        i18nKey="pages.cms.hero.description"
                        components={[
                            <strong className="font-extrabold" key="0" />,
                            <strong className="text-orange-600 font-extrabold" key="1" />,
                        ]}
                    />
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="h-14 px-8 text-lg rounded-full group" asChild>
                        <a href="#cms-email" onClick={handleScrollToEmail}>
                            {t("buttons.start_publishing")}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    )
}
