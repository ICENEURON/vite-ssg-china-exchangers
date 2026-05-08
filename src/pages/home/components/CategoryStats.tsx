import { useTranslation } from "react-i18next";

export function CategoryStats() {
    const { t } = useTranslation("translation");
    const manufacturers = t("pages.manufacturers.list", { returnObjects: true }) as Array<{
        industries?: string[];
    }>;
    const products = t("pages.products.list", { returnObjects: true }) as unknown[];
    const industryCount = new Set(manufacturers.flatMap((manufacturer) => manufacturer.industries || [])).size;
    const stats = [
        {
            value: String(manufacturers.length),
            label: t("pages.home.categoryShowcase.stats.manufacturers"),
            accent: "text-sky-600",
            glow: "bg-sky-500/10",
        },
        {
            value: `${products.length}+`,
            label: t("pages.home.categoryShowcase.stats.products"),
            accent: "text-emerald-600",
            glow: "bg-emerald-500/10",
        },
        {
            value: `${industryCount}+`,
            label: t("pages.home.categoryShowcase.stats.industries"),
            accent: "text-orange-500",
            glow: "bg-orange-500/10",
        },
    ];

    return (
        <section className="relative px-2 py-8 flex justify-center bg-white">
            <div className="container relative px-4 max-w-6xl">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 px-6 py-7 text-center shadow-sm"
                        >
                            <div className={`absolute right-3 top-3 size-20 rounded-full ${stat.glow}`} />
                            <p className={`relative font-heading text-[clamp(5.75rem,17vw,8rem)] font-extrabold leading-none md:text-[clamp(7rem,10vw,9.75rem)] ${stat.accent}`}>
                                {stat.value}
                            </p>
                            <p className="relative mx-auto mt-3 max-w-[13rem] text-sm font-semibold leading-5 text-slate-700 md:text-base">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}