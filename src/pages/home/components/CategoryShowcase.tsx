import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";

export function CategoryShowcase() {
    const { t } = useTranslation("translation");

    return (
        <section className="pt-16">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-xl border border-border">
                    {/* Left: Image */}
                    <div className="lg:w-1/2 relative min-h-[200px] lg:min-h-full">
                        <img
                            src="/static/images/home-hero.png"
                            alt={t("pages.home.categoryShowcase.alt")}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
                    </div>

                    {/* Right: Content */}
                    <div className="lg:w-1/2 p-8 flex flex-col justify-center items-start bg-white">
                        <h2 className="font-bold text-foreground mb-6 font-heading">
                            {t("pages.home.categoryShowcase.title")}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            {t("pages.home.categoryShowcase.description")}
                        </p>
                        <Button size="lg" variant="default" asChild>
                            <a href="/products">
                                {t("pages.home.categoryShowcase.cta")}
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
