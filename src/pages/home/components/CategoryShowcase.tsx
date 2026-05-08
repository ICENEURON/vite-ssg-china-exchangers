import { ArrowRight, CheckCircle2, Factory } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { addLanguageToPath, useCurrentLanguage } from "../../../utils/language-routing";

export function CategoryShowcase() {
    const { t } = useTranslation("translation");
    const currentLanguage = useCurrentLanguage();
    const manufacturersPath = addLanguageToPath("/manufacturers", currentLanguage);
    const productsPath = addLanguageToPath("/products", currentLanguage);
    const details = t("pages.home.categoryShowcase.details", { returnObjects: true }) as string[];

    return (
        <section className="pt-14 pb-7 px-2 flex justify-center bg-white">
            <div className="container px-4 max-w-6xl flex flex-col items-center justify-center gap-8 text-center">
                <div className="max-w-4xl">
                    <Label className="mb-4 text-primary justify-center">
                        <Factory className="size-4" />
                        {t("pages.home.categoryShowcase.eyebrow")}
                    </Label>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        {t("pages.home.categoryShowcase.title")}
                    </h2>
                    <p className="mt-4 text-muted leading-relaxed md:text-lg">
                        {t("pages.home.categoryShowcase.description")}
                    </p>
                </div>

                <div className="grid w-full grid-cols-1 gap-3 text-left md:grid-cols-3">
                    {details.map((detail) => (
                        <div key={detail} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                            <p className="text-sm leading-6 text-slate-700">{detail}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button size="lg" variant="default" asChild>
                        <a href={manufacturersPath}>
                            {t("pages.home.categoryShowcase.cta")}
                            <ArrowRight className="size-4" />
                        </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <a href={productsPath}>
                            {t("pages.home.categoryShowcase.secondaryCta")}
                            <ArrowRight className="size-4" />
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
}
