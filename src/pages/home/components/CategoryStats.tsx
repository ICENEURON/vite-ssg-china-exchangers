import { useTranslation } from "react-i18next";

export function CategoryStats() {
    const { t } = useTranslation("translation");
    const manufacturers = t("pages.manufacturers.list", { returnObjects: true }) as unknown[];
    const products = t("pages.products.list", { returnObjects: true }) as unknown[];
    const industries = t("industries", { returnObjects: true }) as unknown[];
    const stats = [
        {
            value: String(manufacturers.length),
            label: t("pages.home.categoryShowcase.stats.manufacturers"),
            accent: "text-sky-600",
            card: "bg-sky-50 border-sky-100",
        },
        {
            value: `${products.length}+`,
            label: t("pages.home.categoryShowcase.stats.products"),
            accent: "text-emerald-600",
            card: "bg-emerald-50 border-emerald-100",
        },
        {
            value: String(industries.length),
            label: t("pages.home.categoryShowcase.stats.industries"),
            accent: "text-orange-500",
            card: "bg-orange-50 border-orange-100",
        },
    ];

    return (
        <section className="flex justify-center bg-white px-2 py-10">
            <div className="container max-w-6xl px-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {stats.map((stat) => (
                        <article
                            key={stat.label}
                            className={`rounded-sm border px-5 py-6 text-center ${stat.card}`}
                        >
                            <div className="text-4xl font-extrabold leading-none tracking-normal md:text-5xl lg:text-6xl">
                                <span className={stat.accent}>{stat.value}</span>
                            </div>
                            <div className="mt-3 text-base font-semibold leading-6 text-slate-800">
                                {stat.label}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
