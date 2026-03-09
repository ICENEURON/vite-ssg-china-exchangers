import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";

export function CategoryShowcase() {
    const { t } = useTranslation("translation");

    return (
        <section className="py-10 px-2 flex justify-center">
            <div className="container px-4 max-w-6xl flex flex-col items-center justify-center">
                <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-xl border border-border/20 items-center justify-center w-full text-center">
                    {/* Left: Image */}
                    <div className="flex-1 w-full relative min-h-[300px]">
                        <img
                            src="/static/websites/home-hero.png"
                            alt={t("pages.home.categoryShowcase.alt")}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-accent/10 mix-blend-multiply" />
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 p-6 flex flex-col justify-center items-center bg-white gap-4 w-full">
                        <h2 className="font-bold text-foreground font-heading p-2">
                            {t("pages.home.categoryShowcase.title")}
                        </h2>
                        <p className="text-lg text-muted leading-relaxed p-2 max-w-xl">
                            {t("pages.home.categoryShowcase.description")}
                        </p>
                        <Button size="lg" variant="default" asChild>
                            <a href="/manufacturers">
                                {t("pages.home.categoryShowcase.cta")}
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
