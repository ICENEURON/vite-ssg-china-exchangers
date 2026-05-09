import { useTranslation } from "react-i18next";
import { useState } from "react";
import { QuoteCta } from "../../../components/ui/quote-cta";
import { BrandText } from "../../../components/ui/brand-text";
import { ArrowRight, Factory, Mail, PackageSearch } from "lucide-react";
import { addLanguageToPath, useCurrentLanguage } from "../../../utils/language-routing";
import { RfqLink } from "../../../utils/rfq-routing/link";

export function HeroSection() {
    const { t } = useTranslation("translation");
    const [activePathIndex, setActivePathIndex] = useState<number | null>(null);
    const currentLanguage = useCurrentLanguage();
    const paths = t("pages.home.hero.paths", { returnObjects: true }) as Array<{
        title: string;
        body: string;
    }>;
    const manufacturersPath = addLanguageToPath("/manufacturers", currentLanguage);
    const productsPath = addLanguageToPath("/products", currentLanguage);
    const pathIcons = [Factory, PackageSearch];
    const pathHrefs = [manufacturersPath, productsPath];

    return (
        <section className="relative isolate flex min-h-[650px] justify-center overflow-hidden bg-navbar px-2 py-16 text-navbar-foreground">
            <div className="absolute inset-0 -z-20 bg-[url('/static/websites/home-hero.png')] bg-cover bg-center opacity-40" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navbar/90 via-navbar/82 to-navbar" />

            <div className="container z-10 flex max-w-6xl flex-col justify-center gap-7 px-4">
                <p className="w-fit rounded-full border border-orange-300/35 bg-orange-300/10 px-3 py-1.5 text-sm font-semibold text-orange-100 shadow-sm shadow-black/10">
                    {t("pages.home.hero.eyebrow")}
                </p>

                <div className="max-w-5xl space-y-5">
                    <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
                        {t("pages.home.hero.title")}
                    </h1>

                    <p className="max-w-3xl text-lg leading-8 text-gray-100 md:text-xl">
                        <BrandText text={t("pages.home.hero.subtitle")} directClassName="text-orange-300" />
                    </p>

                    <p className="max-w-3xl text-sm leading-7 text-gray-300 md:text-base">
                        {t("pages.home.hero.description")}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <QuoteCta size="lg" asChild>
                        <RfqLink>
                            <Mail className="w-5 h-5" />
                            {t("navigation.menu.rfq")}
                        </RfqLink>
                    </QuoteCta>
                </div>

                <div className="grid max-w-4xl gap-5 border-t border-white/15 pt-5 md:grid-cols-2">
                    {paths.map((path, index) => {
                        const Icon = pathIcons[index] || Factory;
                        const isActive = activePathIndex === index;
                        const content = (
                            <>
                                <div className="flex items-center justify-between gap-3">
                                    <div
                                        className="flex min-w-0 items-center gap-2 whitespace-nowrap text-base font-semibold transition-colors duration-200"
                                        style={{ color: isActive ? "var(--orange-500)" : "var(--white)" }}
                                    >
                                        <Icon
                                            className="size-5 shrink-0 transition-colors duration-200"
                                            style={{ color: isActive ? "var(--orange-500)" : "var(--orange-300)" }}
                                        />
                                        <span className="truncate">{path.title}</span>
                                    </div>
                                    <ArrowRight
                                        className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                                        style={{ color: isActive ? "var(--orange-500)" : "var(--orange-200)" }}
                                    />
                                </div>
                                <p
                                    className="mt-3 text-sm leading-6 transition-colors duration-200"
                                    style={{ color: isActive ? "var(--slate-800)" : "var(--gray-300)" }}
                                >
                                    {path.body}
                                </p>
                            </>
                        );

                        const className = `group rounded-sm border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${isActive ? "border-white bg-white" : "border-white/15 bg-white/5"}`;

                        return (
                            <a
                                key={path.title}
                                href={pathHrefs[index]}
                                className={className}
                                style={isActive ? { backgroundColor: "var(--white)", borderColor: "var(--white)" } : undefined}
                                onMouseEnter={() => setActivePathIndex(index)}
                                onMouseLeave={() => setActivePathIndex(null)}
                                onFocus={() => setActivePathIndex(index)}
                                onBlur={() => setActivePathIndex(null)}
                            >
                                {content}
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
