
import { Button } from "../../../components/ui/button"
import { Send } from "lucide-react"
import { useTranslation } from "react-i18next"

export function CTASection() {
    const { t } = useTranslation("translation", { keyPrefix: "pages.cms.cta" });

    return (
        <section className="py-16 bg-background">
            <div className="container px-4 mx-auto max-w-4xl text-center">
                <div className="group relative overflow-hidden rounded-[2.5rem] bg-zinc-950 px-8 py-20 text-center shadow-2xl">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#3b82f640,transparent_70%)] opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 pointer-events-none">
                        <Send className="w-64 h-64 text-white" />
                    </div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                            {t("title")}
                        </h2>
                        <p className="text-lg text-zinc-400 mb-10">
                            {t("description")}
                        </p>

                        <div className="flex flex-row gap-4 justify-center">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-white text-zinc-950 hover:bg-zinc-200" asChild>
                                <a href="mailto:editor@china-heatexchangers.com">
                                    <Send className="w-5 h-5 mr-2" />
                                    {t("button")}
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
