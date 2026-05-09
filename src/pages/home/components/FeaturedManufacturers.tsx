import { ArrowRight, Factory } from "lucide-react";
import { useTranslation } from "react-i18next";
import manufacturerScores from "../../../data/manufacturer_scores.json";
import { addLanguageToPath, useCurrentLanguage } from "../../../utils/language-routing";

type ManufacturerListItem = {
    name: string;
    short_description: string;
    slug: string;
};

type ManufacturerScore = {
    manufacturer_slug: string;
    order: number;
};

export function FeaturedManufacturers() {
    const { t } = useTranslation("translation");
    const currentLanguage = useCurrentLanguage();
    const manufacturers = t("pages.manufacturers.list", { returnObjects: true }) as ManufacturerListItem[];
    const orderBySlug = new Map((manufacturerScores as ManufacturerScore[]).map((score) => [score.manufacturer_slug, score.order]));
    const featuredManufacturers = [...manufacturers]
        .sort((first, second) => (orderBySlug.get(first.slug) ?? 999) - (orderBySlug.get(second.slug) ?? 999))
        .slice(0, 3);
    const manufacturersPath = addLanguageToPath("/manufacturers", currentLanguage);

    return (
        <section className="flex justify-center bg-white px-2 py-14">
            <div className="container flex max-w-6xl flex-col gap-8 px-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                            <Factory className="size-4" />
                            {t("pages.home.featuredManufacturers.eyebrow")}
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            {t("pages.home.featuredManufacturers.title")}
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-muted md:text-base">
                            {t("pages.home.featuredManufacturers.description")}
                        </p>
                    </div>
                    <a
                        href={manufacturersPath}
                        className="inline-flex h-10 w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-md border border-primary/20 px-4 text-sm font-semibold text-primary transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary-hover"
                    >
                        {t("pages.home.featuredManufacturers.cta")}
                        <ArrowRight className="size-4 shrink-0" />
                    </a>
                </div>

                <div className="divide-y divide-slate-200 border-y border-slate-200">
                    {featuredManufacturers.map((manufacturer) => {
                        const profilePath = addLanguageToPath(`/manufacturers/${manufacturer.slug}`, currentLanguage);

                        return (
                            <article
                                key={manufacturer.slug}
                                className="group py-5 text-left transition-colors duration-200 hover:bg-slate-50 md:px-3"
                            >
                                <h3 className="text-left text-lg font-bold leading-7 text-foreground">
                                    <a href={profilePath} className="underline-offset-4 transition-colors duration-200 group-hover:text-primary group-hover:underline">
                                        {manufacturer.name}
                                    </a>
                                </h3>
                                <p className="mt-2 max-w-3xl text-left text-sm leading-6 text-muted">{manufacturer.short_description}</p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}