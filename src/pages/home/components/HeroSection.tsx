import { useTranslation } from "react-i18next";
import { useState } from "react";
import { BrandText } from "../../../components/ui/brand-text";
import { ResponsiveHeroImage } from "../../../components/ui/responsive-hero-image";
import { ArrowRight, Factory, PackageSearch } from "lucide-react";
import { addLanguageToPath, useCurrentLanguage } from "../../../utils/language-routing";

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
            <ResponsiveHeroImage src="/static/websites/home-hero.png" className="-z-20" />
            <div className="absolute inset-0 -z-10 bg-navbar/[0.97]" />

            <div className="container z-10 flex max-w-6xl flex-col justify-center gap-7 px-4">
                <p className="hidden w-fit rounded-sm border border-orange-300/35 bg-orange-300/10 px-3 py-1.5 text-sm font-semibold text-orange-100 shadow-sm shadow-black/10 md:block">
                    {t("pages.home.hero.eyebrow")}
                </p>

                <div className="max-w-5xl space-y-5">
                    <h1 className="home-hero-title max-w-4xl font-bold text-white">
                        {t("pages.home.hero.title")}
                    </h1>

                    <p className="max-w-3xl text-lg leading-8 text-gray-100 md:text-xl">
                        <BrandText text={t("pages.home.hero.subtitle")} directClassName="text-orange-300" />
                    </p>

                    <p className="max-w-3xl text-sm leading-7 text-gray-300 md:text-base">
                        {t("pages.home.hero.description")}
                    </p>
                </div>

                <div className="mt-5 grid max-w-[50rem] gap-5 md:grid-cols-2">
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

                        const className = `group min-h-[136px] rounded-sm border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${isActive ? "border-white bg-white" : "border-white/15 bg-white/5"}`;

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
