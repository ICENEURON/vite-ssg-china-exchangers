import { useState, useMemo, useRef, useEffect } from 'react'
import { Head } from 'vite-react-ssg'
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useCurrentLanguage, addLanguageToPath } from "../../utils/language-routing";
import { ArrowRight, Filter, ChevronDown, X, Check, Factory, Mail } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { QuoteCta } from "../../components/ui/quote-cta";

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
    manufacturer?: ProductManufacturer;
    name: string;
    short_description?: string;
    industries?: string[];
    images?: ProductImage[];
    url: string;
}

export default function ProductsPage() {
    const { t } = useTranslation();
    const productsT = useTranslation("translation", { keyPrefix: "pages.products" });
    const currentLanguage = useCurrentLanguage();

    // Safely parse the products from translation JSON list
    const productsList = productsT.t("list", { returnObjects: true }) as ProductListItem[];
    const industries = t("industries", { returnObjects: true }) as Industry[];

    const [selectedIndustrySlugs, setSelectedIndustrySlugs] = useState<string[]>([]);
    const [selectedManufacturerSlugs, setSelectedManufacturerSlugs] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
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

    const clearAll = () => {
        setSelectedIndustrySlugs([]);
        setSelectedManufacturerSlugs([]);
        setIsDropdownOpen(false);
    };

    const manufacturers = useMemo(() => {
        const mfgMap = new Map<string, { slug: string, name: string }>();
        productsList.forEach(p => {
            if (p.manufacturer && !mfgMap.has(p.manufacturer.slug)) {
                mfgMap.set(p.manufacturer.slug, p.manufacturer);
            }
        });
        return Array.from(mfgMap.values());
    }, [productsList]);

    const filteredProducts = useMemo(() => {
        let result = productsList;

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
    }, [selectedIndustrySlugs, selectedManufacturerSlugs, productsList, industries]);

    const selectedIndustries = useMemo(() =>
        industries.filter(i => selectedIndustrySlugs.includes(i.slug)),
        [industries, selectedIndustrySlugs]
    );

    return (
        <>
            <Head>
                <title>{productsT.t("title")}</title>
                <meta name="description" content={productsT.t("description")} />
            </Head>

            <main className="min-h-screen bg-background pb-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-slate-900 py-24 px-6 md:px-12">
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

                {/* Filter Section */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 mt-12 mb-8">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 px-5 py-2.5 bg-card/40 backdrop-blur-md border border-border/60 rounded-xl text-sm font-semibold hover:border-primary/50 hover:bg-card transition-all shadow-sm active:scale-[0.98]"
                            >
                                <Filter className="w-4 h-4 text-primary" />
                                <span className="text-foreground/90">{productsT.t("filter_by")}</span>
                                <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-3 w-72 bg-card border border-border/50 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                                    <div className="p-2.5 max-h-[340px] overflow-y-auto custom-scrollbar">
                                        <button
                                            onClick={clearAll}
                                            className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-all group ${selectedIndustrySlugs.length === 0 ? 'bg-primary/20 text-primary' : 'text-foreground/70 hover:bg-primary/20 hover:text-foreground'
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
                                                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl transition-all group ${isSelected
                                                            ? 'bg-primary/5 text-primary font-semibold'
                                                            : 'text-foreground/70 hover:bg-muted hover:text-foreground'
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

                        {selectedIndustrySlugs.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="text-sm font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex items-center justify-center gap-2 px-3 py-1.5 active:scale-95"
                            >
                                <X className="w-4 h-4" />
                                {productsT.t("clear_all")}
                            </button>
                        )}
                    </div>

                    {/* Selected Tags */}
                    {selectedIndustries.length > 0 && (
                        <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
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
                </section>

                {/* Categories Grid */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 mt-4 relative z-20 flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar Filter */}
                    <aside className="w-full lg:w-56 shrink-0 z-20">
                        <div className="bg-card border border-border/50 rounded-2xl shadow-sm sticky top-24 overflow-hidden">
                            <div className="p-2.5">
                                <div className="px-4 py-2 flex items-center gap-2 mb-1">
                                    <Factory className="w-4 h-4 text-primary shrink-0" />
                                    <span className="font-bold text-sm text-foreground">Manufacturers</span>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar flex flex-col">
                                    <button
                                        onClick={() => setSelectedManufacturerSlugs([])}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-all group ${selectedManufacturerSlugs.length === 0 ? 'bg-primary/20 text-primary' : 'text-foreground/70 hover:bg-primary/20 hover:text-foreground'
                                            }`}
                                    >
                                        <span className="font-bold">{productsT.t("filter_all")}</span>
                                        {selectedManufacturerSlugs.length === 0 && <Check className="w-4 h-4 shrink-0" />}
                                    </button>
                                    <div className="h-px bg-border/40 my-2 mx-2" />

                                    <div className="grid gap-1">
                                        {manufacturers.map((mfg) => {
                                            const isSelected = selectedManufacturerSlugs.includes(mfg.slug);
                                            return (
                                                <button
                                                    key={mfg.slug}
                                                    onClick={() => toggleManufacturer(mfg.slug)}
                                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl transition-all group ${isSelected
                                                        ? 'bg-primary/5 text-primary font-semibold'
                                                        : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                                                        }`}
                                                >
                                                    <span className="text-left leading-tight pr-2">{mfg.name}</span>
                                                    {isSelected && <Check className="w-4 h-4 shrink-0 animate-in zoom-in duration-200" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 h-fit">
                        {filteredProducts.map((product) => (
                            <Link
                                key={product.slug}
                                to={addLanguageToPath(`/products/${product.url}`, currentLanguage)}
                                className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 flex flex-col"
                            >
                                {/* Image Area */}
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

                                {/* Content Area */}
                                <div className="p-6 flex flex-col flex-1 border-t border-slate-100 dark:border-zinc-800">
                                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-zinc-100 group-hover:text-primary transition-colors line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 line-clamp-3">
                                        {product.short_description}
                                    </p>

                                    <div className="mt-6 flex flex-col gap-3">
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            {(product.industries ?? []).slice(0, 3).map((ind, idx) => (
                                                <Badge key={idx} variant="secondary" className="font-normal bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700">
                                                    {ind}
                                                </Badge>
                                            ))}
                                            {(product.industries?.length ?? 0) > 3 && (
                                                <Badge variant="secondary" className="font-normal bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400">
                                                    {productsT.t("card.more_industries", { count: (product.industries?.length ?? 0) - 3 })}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center text-sm font-semibold text-primary mt-3 group-hover:underline">
                                            {productsT.t("card.explore_details")}
                                            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm col-span-full">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                <Filter className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-zinc-100 mb-2">
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
