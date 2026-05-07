import { useTranslation } from "react-i18next";
import { ArrowUpRight, BadgeCheck, Building2, Factory, Globe2, LayoutGrid, MapPin } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { addLanguageToPath, useCurrentLanguage } from "../../../utils/language-routing";

export function CategoryShowcase() {
    const { t } = useTranslation("translation");
    const currentLanguage = useCurrentLanguage();
    const manufacturers = t("pages.manufacturers.list", { returnObjects: true }) as Array<{
        name: string;
        short_description?: string;
        slug: string;
        city?: string;
        country_name?: string;
        industries?: string[];
    }>;
    const products = t("pages.products.list", { returnObjects: true }) as unknown[];
    const industryCount = new Set(manufacturers.flatMap((manufacturer) => manufacturer.industries || [])).size;
    const manufacturersPath = addLanguageToPath("/manufacturers", currentLanguage);
    const productsPath = addLanguageToPath("/products", currentLanguage);
    const featuredManufacturers = manufacturers.slice(0, 3);
    const statIcons = [Building2, LayoutGrid, Globe2];
    const stats = [
        {
            value: String(manufacturers.length),
            label: t("pages.home.categoryShowcase.stats.manufacturers"),
            className: "bg-slate-950 text-white shadow-slate-900/25",
            iconClassName: "bg-white/10 text-orange-300 ring-white/10",
            valueClassName: "text-white",
            labelClassName: "text-slate-200",
        },
        {
            value: `${products.length}+`,
            label: t("pages.home.categoryShowcase.stats.products"),
            className: "bg-primary text-white shadow-primary/25",
            iconClassName: "bg-white/15 text-orange-200 ring-white/15",
            valueClassName: "text-white",
            labelClassName: "text-blue-50",
        },
        {
            value: `${industryCount}+`,
            label: t("pages.home.categoryShowcase.stats.industries"),
            className: "bg-orange-500 text-white shadow-orange-500/25",
            iconClassName: "bg-slate-950/15 text-white ring-white/20",
            valueClassName: "text-white",
            labelClassName: "text-orange-50",
        },
    ];

    return (
        <section className="py-16 px-2 flex justify-center bg-white">
            <div className="container px-4 max-w-6xl flex flex-col items-center justify-center gap-10">
                <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] rounded-sm overflow-hidden border border-slate-200 w-full bg-white shadow-sm">
                    <div className="w-full relative min-h-[360px]">
                        <img
                            src="/static/websites/home-hero.png"
                            alt={t("pages.home.categoryShowcase.alt")}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/35" />
                        <div className="absolute left-5 bottom-5 right-5 rounded-sm border border-white/15 bg-white/10 p-4 text-white backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <Factory className="h-5 w-5 text-orange-300" />
                                <p className="text-sm font-semibold">{t("pages.home.categoryShowcase.imageCaption")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-10 flex flex-col justify-center items-start bg-white gap-5 w-full text-left">
                        <p className="inline-flex items-center gap-2 rounded-sm bg-primary/5 px-3 py-2 text-sm font-semibold text-primary">
                            <BadgeCheck className="h-4 w-4" />
                            {t("pages.home.categoryShowcase.eyebrow")}
                        </p>
                        <h2 className="font-bold text-foreground font-heading">
                            {t("pages.home.categoryShowcase.title")}
                        </h2>
                        <p className="text-lg text-muted leading-relaxed max-w-2xl">
                            {t("pages.home.categoryShowcase.description")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button size="lg" variant="default" asChild>
                                <a href={manufacturersPath}>
                                    {t("pages.home.categoryShowcase.cta")}
                                </a>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <a href={productsPath}>
                                    {t("pages.home.categoryShowcase.secondaryCta")}
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
                    {stats.map((stat, index) => {
                        const Icon = statIcons[index] || Building2;

                        return (
                            <div key={stat.label} className={`min-h-[168px] p-5 shadow-lg md:p-6 ${stat.className}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className={`flex h-10 w-10 items-center justify-center ring-1 ${stat.iconClassName}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="font-heading text-xs font-bold text-white/70">0{index + 1}</span>
                                </div>
                                <p className={`mt-7 font-heading text-5xl font-extrabold leading-none md:text-6xl ${stat.valueClassName}`}>{stat.value}</p>
                                <p className={`mt-3 max-w-[15rem] text-sm font-semibold leading-snug md:text-base ${stat.labelClassName}`}>{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="w-full flex flex-col gap-5">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 border-b border-slate-200 pb-5">
                        <div>
                            <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                                {t("pages.home.categoryShowcase.featuredEyebrow")}
                            </p>
                            <h3 className="text-2xl font-bold text-foreground">
                                {t("pages.home.categoryShowcase.featuredTitle")}
                            </h3>
                        </div>
                        <a href={manufacturersPath} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                            {t("pages.home.categoryShowcase.featuredLink")}
                            <ArrowUpRight className="h-4 w-4" />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {featuredManufacturers.map((manufacturer, index) => (
                            <article key={manufacturer.slug} className="group rounded-sm border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/35 hover:shadow-md flex flex-col gap-4">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="inline-flex items-center gap-2 rounded-sm bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700">
                                        <MapPin className="h-3.5 w-3.5 text-primary" />
                                        {[manufacturer.city, manufacturer.country_name].filter(Boolean).join(", ")}
                                    </p>
                                    <span className="text-xs font-bold text-slate-400">0{index + 1}</span>
                                </div>
                                <h4 className="text-lg font-bold text-foreground leading-snug">
                                    {manufacturer.name}
                                </h4>
                                {manufacturer.short_description && (
                                    <p className="text-sm text-muted leading-relaxed flex-1">
                                        {manufacturer.short_description}
                                    </p>
                                )}
                                <a
                                    href={addLanguageToPath(`/manufacturers/${manufacturer.slug}`, currentLanguage)}
                                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:underline"
                                >
                                    {t("pages.home.categoryShowcase.viewProfile")}
                                    <ArrowUpRight className="h-4 w-4" />
                                </a>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
