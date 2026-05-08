import { useState, useMemo, useRef, useEffect } from 'react'
import { Head } from 'vite-react-ssg'
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useCurrentLanguage, addLanguageToPath } from "../../utils/language-routing";
import { ArrowRight, Filter, ChevronDown, X, Check, Factory, Mail } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { QuoteCta } from "../../components/ui/quote-cta";
import rankingSignals from "../../data/manufacturer_ranking_signals.json";

interface Industry {
    id: number;
    slug: string;
    name: string;
}

interface ProductImage {
    alt_text?: string;
    url: string;
}

interface ProductManufacturer {
    slug: string;
    name: string;
}

interface ProductListItem {
    slug: string;
    order?: number;
    manufacturer?: ProductManufacturer;
    name: string;
    short_description?: string;
    industries?: string[];
    images?: ProductImage[];
    url: string;
}

interface ManufacturerRankingSignal {
    order: number;
    slug: string;
}

interface ManufacturerRankingSignalFile {
    records: ManufacturerRankingSignal[];
}

const fallbackManufacturerOrder = 999;

export default function ProductsPage() {
    const { t } = useTranslation();
    const productsT = useTranslation("translation", { keyPrefix: "pages.products" });
    const currentLanguage = useCurrentLanguage();

    // Safely parse the products from translation JSON list
    const productsList = productsT.t("list", { returnObjects: true }) as ProductListItem[];
    const industries = t("industries", { returnObjects: true }) as Industry[];

    const [selectedIndustrySlugs, setSelectedIndustrySlugs] = useState<string[]>([]);
    const [selectedManufacturerSlugs, setSelectedManufacturerSlugs] = useState<string[]>([]);
    const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
    const [isManufacturerDropdownOpen, setIsManufacturerDropdownOpen] = useState(false);
    const industryDropdownRef = useRef<HTMLDivElement>(null);
    const manufacturerDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (industryDropdownRef.current && !industryDropdownRef.current.contains(event.target as Node)) {
                setIsIndustryDropdownOpen(false);
            }
            if (manufacturerDropdownRef.current && !manufacturerDropdownRef.current.contains(event.target as Node)) {
                setIsManufacturerDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleIndustry = (slug: string) => {
        setSelectedIndustrySlugs(prev =>
            prev.includes(slug)
                ? prev.filter(s => s !== slug)
                : [...prev, slug]
        );
    };

    const toggleManufacturer = (slug: string) => {
        setSelectedManufacturerSlugs(prev =>
            prev.includes(slug)
                ? prev.filter(s => s !== slug)
                : [...prev, slug]
        );
    };

    const removeIndustry = (slug: string) => {
        setSelectedIndustrySlugs(prev => prev.filter(s => s !== slug));
    };

    const removeManufacturer = (slug: string) => {
        setSelectedManufacturerSlugs(prev => prev.filter(s => s !== slug));
    };

    const clearAll = () => {
        setSelectedIndustrySlugs([]);
        setSelectedManufacturerSlugs([]);
        setIsIndustryDropdownOpen(false);
        setIsManufacturerDropdownOpen(false);
    };

    const signalsBySlug = useMemo(() => new Map(
        (rankingSignals as ManufacturerRankingSignalFile).records.map(signal => [signal.slug, signal])
    ), []);

    const manufacturers = useMemo(() => {
        const mfgMap = new Map<string, { slug: string, name: string }>();
        productsList.forEach(p => {
            if (p.manufacturer && !mfgMap.has(p.manufacturer.slug)) {
                mfgMap.set(p.manufacturer.slug, p.manufacturer);
            }
        });
        return Array.from(mfgMap.values()).sort((a, b) => {
            const orderA = signalsBySlug.get(a.slug)?.order ?? fallbackManufacturerOrder;
            const orderB = signalsBySlug.get(b.slug)?.order ?? fallbackManufacturerOrder;
            return orderA - orderB || a.name.localeCompare(b.name);
        });
    }, [productsList, signalsBySlug]);

    const sortedProducts = useMemo(() => (
        productsList
            .map((product, index) => ({
                product,
                productOrder: product.order ?? index,
                manufacturerOrder: product.manufacturer?.slug
                    ? signalsBySlug.get(product.manufacturer.slug)?.order ?? fallbackManufacturerOrder
                    : fallbackManufacturerOrder,
            }))
            .sort((a, b) => (
                a.manufacturerOrder - b.manufacturerOrder
                || a.productOrder - b.productOrder
                || a.product.name.localeCompare(b.product.name)
            ))
            .map(({ product }) => product)
    ), [productsList, signalsBySlug]);

    const filteredProducts = useMemo(() => {
        let result = sortedProducts;

        if (selectedIndustrySlugs.length > 0) {
            const selectedIndustryNames = industries
                .filter(i => selectedIndustrySlugs.includes(i.slug))
                .map(i => i.name);
            result = result.filter(p =>
                p.industries?.some((industryName: string) => selectedIndustryNames.includes(industryName))
            );
        }

        if (selectedManufacturerSlugs.length > 0) {
            result = result.filter(p =>
                p.manufacturer && selectedManufacturerSlugs.includes(p.manufacturer.slug)
            );
        }

        return result;
    }, [selectedIndustrySlugs, selectedManufacturerSlugs, sortedProducts, industries]);

    const selectedIndustries = useMemo(() =>
        industries.filter(i => selectedIndustrySlugs.includes(i.slug)),
        [industries, selectedIndustrySlugs]
    );

    const selectedManufacturers = useMemo(() =>
        manufacturers.filter(manufacturer => selectedManufacturerSlugs.includes(manufacturer.slug)),
        [manufacturers, selectedManufacturerSlugs]
    );

    const hasActiveFilters = selectedIndustrySlugs.length > 0 || selectedManufacturerSlugs.length > 0;

    return (
        <>
            <Head>
                <title>{productsT.t("title")}</title>
                <meta name="description" content={productsT.t("description")} />
            </Head>

            <main className="min-h-screen bg-background pb-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-slate-900 py-[61.67px] px-6 md:px-12">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900" />
                    <div className="relative max-w-6xl mx-auto z-10 flex flex-col items-center text-center">
                        <Badge className="mb-6 bg-primary/20 text-blue-300 border-none px-4 py-1.5 backdrop-blur-md">
                            {productsT.t("hero.badge")}
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight max-w-4xl">
                            {productsT.t("title")}
                        </h1>
                        <p className="text-xl text-slate-300 max-w-3xl leading-relaxed mb-10">
                            {productsT.t("description")}
                        </p>
                    </div>
                </section>

                <section className="py-10">
                    <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                        <div className="mb-8">
                            <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                                <div className="relative" ref={manufacturerDropdownRef}>
                                    <button
                                        onClick={() => setIsManufacturerDropdownOpen(!isManufacturerDropdownOpen)}
                                        className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-background active:scale-[0.98]"
                                    >
                                        <Factory className="w-4 h-4 text-primary" />
                                        <span>{productsT.t("filter_manufacturer")}</span>
                                        <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-300 ${isManufacturerDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isManufacturerDropdownOpen && (
                                        <div className="absolute top-full left-0 z-50 mt-3 w-80 overflow-hidden rounded-lg border border-border/50 bg-card shadow-xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                                            <div className="p-2.5 max-h-[340px] overflow-y-auto custom-scrollbar">
                                                <button
                                                    onClick={() => setSelectedManufacturerSlugs([])}
                                                    className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all group ${selectedManufacturerSlugs.length === 0 ? 'bg-primary/[0.06] text-primary' : 'text-foreground hover:bg-zinc-950/[0.04] dark:hover:bg-white/[0.06]'
                                                        }`}
                                                >
                                                    <span className="font-bold">{productsT.t("filter_all_manufacturers")}</span>
                                                    {selectedManufacturerSlugs.length === 0 && <Check className="w-4 h-4" />}
                                                </button>
                                                <div className="h-px bg-border/40 my-2 mx-2" />
                                                <div className="grid gap-1">
                                                    {manufacturers.map((manufacturer) => {
                                                        const isSelected = selectedManufacturerSlugs.includes(manufacturer.slug);
                                                        return (
                                                            <button
                                                                key={manufacturer.slug}
                                                                onClick={() => toggleManufacturer(manufacturer.slug)}
                                                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-all group ${isSelected
                                                                    ? 'bg-primary/[0.06] text-primary font-semibold'
                                                                    : 'text-foreground hover:bg-zinc-950/[0.04] dark:hover:bg-white/[0.06]'
                                                                    }`}
                                                            >
                                                                <span className="text-left leading-tight pr-2">{manufacturer.name}</span>
                                                                {isSelected && <Check className="w-4 h-4 shrink-0 animate-in zoom-in duration-200" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative" ref={industryDropdownRef}>
                                    <button
                                        onClick={() => setIsIndustryDropdownOpen(!isIndustryDropdownOpen)}
                                        className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-background active:scale-[0.98]"
                                    >
                                        <Filter className="w-4 h-4 text-primary" />
                                        <span>{productsT.t("filter_by")}</span>
                                        <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-300 ${isIndustryDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isIndustryDropdownOpen && (
                                        <div className="absolute top-full left-0 z-50 mt-3 w-72 overflow-hidden rounded-lg border border-border/50 bg-card shadow-xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                                            <div className="p-2.5 max-h-[340px] overflow-y-auto custom-scrollbar">
                                                <button
                                                    onClick={() => setSelectedIndustrySlugs([])}
                                                    className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all group ${selectedIndustrySlugs.length === 0 ? 'bg-primary/[0.06] text-primary' : 'text-foreground hover:bg-zinc-950/[0.04] dark:hover:bg-white/[0.06]'
                                                        }`}
                                                >
                                                    <span className="font-bold">{productsT.t("filter_all")}</span>
                                                    {selectedIndustrySlugs.length === 0 && <Check className="w-4 h-4" />}
                                                </button>
                                                <div className="h-px bg-border/40 my-2 mx-2" />
                                                <div className="grid gap-1">
                                                    {industries.map((industry) => {
                                                        const isSelected = selectedIndustrySlugs.includes(industry.slug);
                                                        return (
                                                            <button
                                                                key={industry.id}
                                                                onClick={() => toggleIndustry(industry.slug)}
                                                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-all group ${isSelected
                                                                    ? 'bg-primary/[0.06] text-primary font-semibold'
                                                                    : 'text-foreground hover:bg-zinc-950/[0.04] dark:hover:bg-white/[0.06]'
                                                                    }`}
                                                            >
                                                                <span>{industry.name}</span>
                                                                {isSelected && <Check className="w-4 h-4 animate-in zoom-in duration-200" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {hasActiveFilters && (
                                    <button
                                        onClick={clearAll}
                                        className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-500/10 hover:text-red-400 active:scale-95"
                                    >
                                        <X className="w-4 h-4" />
                                        {productsT.t("clear_all")}
                                    </button>
                                )}
                            </div>

                            {hasActiveFilters && (
                                <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                                    {selectedManufacturers.map((manufacturer) => (
                                        <div
                                            key={manufacturer.slug}
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1 bg-primary/5 text-primary border border-primary/20 rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all group"
                                        >
                                            <span className="leading-none">{manufacturer.name}</span>
                                            <button
                                                onClick={() => removeManufacturer(manufacturer.slug)}
                                                className="hover:bg-primary/20 rounded-full p-1 transition-all group-hover:scale-110 flex items-center justify-center"
                                                aria-label={`Remove ${manufacturer.name}`}
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    {selectedIndustries.map((industry) => (
                                        <div
                                            key={industry.slug}
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1 bg-primary/5 text-primary border border-primary/20 rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all group"
                                        >
                                            <span className="leading-none">{industry.name}</span>
                                            <button
                                                onClick={() => removeIndustry(industry.slug)}
                                                className="hover:bg-primary/20 rounded-full p-1 transition-all group-hover:scale-110 flex items-center justify-center"
                                                aria-label={`Remove ${industry.name}`}
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <Link
                                    key={product.slug}
                                    to={addLanguageToPath(`/products/${product.url}`, currentLanguage)}
                                    className="group flex h-full flex-col overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
                                >
                                    <div className="h-56 overflow-hidden bg-white flex items-center justify-center relative p-4">
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-10 pointer-events-none" />
                                        {product.images && product.images.length > 0 ? (
                                            <img
                                                src={product.images[0].url}
                                                alt={product.images[0].alt_text || product.name}
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-in-out mix-blend-multiply"
                                            />
                                        ) : (
                                            <div className="text-slate-400">{productsT.t("card.no_image")}</div>
                                        )}
                                    </div>

                                    <div className="p-4 flex flex-col flex-1 border-t border-border/40">
                                        <div className="h-14 overflow-hidden">
                                            <h3
                                                className="font-bold text-foreground transition-colors group-hover:text-primary group-hover:underline"
                                                style={{ fontSize: "22px", lineHeight: "28px" }}
                                            >
                                                {product.name}
                                            </h3>
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                                            {product.short_description}
                                        </p>

                                        <div className="mt-3 flex flex-wrap content-start items-start gap-1.5">
                                            {(product.industries ?? []).map((ind, idx) => (
                                                <Badge key={`${ind}-${idx}`} variant="secondary" className="rounded-full border-blue-600/20 bg-blue-200/30 px-2 py-0.5 text-[11px] font-bold text-blue-700 hover:bg-blue-200/30">
                                                    {ind}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="mt-auto pt-4">
                                            <div className="flex items-center text-sm font-semibold text-primary group-hover:underline">
                                                {productsT.t("card.explore_details")}
                                                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}

                            {filteredProducts.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-500 md:col-span-2 xl:col-span-3">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                        <Filter className="w-8 h-8 text-muted-foreground/50" />
                                    </div>
                                    <h3 className="text-lg font-medium text-foreground mb-2">
                                        {productsT.t("no_results")}
                                    </h3>
                                    <button
                                        onClick={clearAll}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        {productsT.t("clear_all")}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-5xl mx-auto px-6 md:px-12 mt-24">
                    <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden border border-blue-800">
                        <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-[100px] -mr-16 -mt-16 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 p-32 bg-orange-500/10 rounded-full blur-[100px] -ml-16 -mb-16 pointer-events-none" />

                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
                            {productsT.t("cta.title")}
                        </h2>
                        <p className="text-blue-200 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                            {productsT.t("cta.description")}
                        </p>
                        <QuoteCta size="lg" className="relative z-10 text-lg h-14 px-8" asChild>
                            <Link to={addLanguageToPath("/rfq", currentLanguage)}>
                                <Mail className="w-5 h-5" />
                                {t("navigation.menu.rfq")}
                            </Link>
                        </QuoteCta>
                    </div>
                </section>
            </main>
        </>
    );
}
