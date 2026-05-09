import { ArrowRight, PackageSearch } from "lucide-react";
import { useTranslation } from "react-i18next";
import { addLanguageToPath, useCurrentLanguage } from "../../../utils/language-routing";

export function CategoryShowcase() {
    const { t } = useTranslation("translation");
    const currentLanguage = useCurrentLanguage();
    const productsPath = addLanguageToPath("/products", currentLanguage);
    const categories = t("pages.home.categoryShowcase.categories", { returnObjects: true }) as Array<{
        title: string;
        body: string;
    }>;

    return (
        <section className="flex justify-center bg-white px-2 py-14">
            <div className="container flex max-w-6xl flex-col gap-8 px-4">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                            <PackageSearch className="size-4" />
                            {t("pages.home.categoryShowcase.eyebrow")}
                        </p>
                        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            {t("pages.home.categoryShowcase.title")}
                        </h2>
                    </div>
                    <a
                        href={productsPath}
                        className="inline-flex h-10 w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-md border border-primary/20 px-4 text-sm font-semibold text-primary transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary-hover"
                    >
                        {t("pages.home.categoryShowcase.secondaryCta")}
                        <ArrowRight className="size-4 shrink-0" />
                    </a>
                </div>

                <div className="divide-y divide-slate-200 border-y border-slate-200">
                    {categories.map((category) => (
                        <article
                            key={category.title}
                            className="grid gap-4 py-5 text-left md:grid-cols-[minmax(0,0.38fr)_minmax(0,1fr)] md:items-start md:px-4"
                        >
                            <div>
                                <h3 className="text-base font-semibold text-foreground">
                                    {category.title}
                                </h3>
                            </div>
                            <p className="text-sm leading-6 text-muted">{category.body}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
