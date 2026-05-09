import { Building2, Factory, Globe2, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Label } from "../../../components/ui/label";

export function CompanyIntro() {
    const { t } = useTranslation("translation");
    const facts = t("pages.home.companyIntro.facts", { returnObjects: true }) as string[];
    const paragraphs = t("pages.home.companyIntro.paragraphs", { returnObjects: true }) as string[];
    const factIcons = [Globe2, MapPin, Factory];

    return (
        <section className="py-14 px-2 flex justify-center bg-white">
            <div className="container px-4 max-w-6xl flex flex-col gap-8">
                <div className="max-w-4xl">
                    <Label className="mb-4 text-primary">
                        <Building2 className="size-4" />
                        {t("pages.home.companyIntro.eyebrow")}
                    </Label>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        {t("pages.home.companyIntro.title")}
                    </h2>
                    <p className="mt-4 max-w-2xl text-muted leading-relaxed md:text-lg">
                        {t("pages.home.companyIntro.lead")}
                    </p>
                </div>

                <div className="grid gap-3 border-y border-slate-200 py-4 md:grid-cols-3">
                    {facts.map((fact, index) => {
                        const Icon = factIcons[index] || Building2;

                        return (
                            <div key={fact} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <Icon className="size-4 text-primary" />
                                {fact}
                            </div>
                        );
                    })}
                </div>

                <div className="max-w-5xl border-t border-slate-200 pt-7">
                    <p className="text-lg leading-8 text-slate-800">
                        {t("pages.home.companyIntro.body")}
                    </p>

                    <div className="mt-6 space-y-5 text-left">
                        {paragraphs.map((paragraph) => (
                            <p key={paragraph} className="text-sm leading-7 text-muted md:text-base">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
