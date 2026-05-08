
import { useState, useMemo } from 'react'
import { Head } from 'vite-react-ssg'
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpDown, ChevronDown, X, Check, Filter, MapPin } from 'lucide-react';
import { FilterDropdown } from "../../components/ui/filter-dropdown"
import { ManufacturerCard } from "./components/ManufacturerCard"
import { HeroSection } from "./components/HeroSection"
import { useCurrentLanguage, addLanguageToPath } from "../../utils/language-routing"
import rankingSignals from "../../data/manufacturer_ranking_signals.json"

interface Manufacturer {
  id: string;
  name: string;
  location: string;
  verified: boolean;
  description: string;
  tags: string[];
  link: string;
  slug: string;
  city?: string;
  country_name?: string;
  short_description?: string;
  industries?: string[];
}

interface Industry {
  id: number;
  slug: string;
  name: string;
}

interface ProductListItem {
  manufacturer?: {
    slug?: string;
  };
}

interface ManufacturerRankingSignal {
  order: number;
  slug: string;
  profile_completeness_percent: number;
  response_time_tier: ResponseTimeTier;
  published_article_count: number;
}

interface ManufacturerRankingSignalFile {
  records: ManufacturerRankingSignal[];
}

type ResponseTimeTier = "within_24h" | "within_3_days" | "within_1_week" | "unknown";
type SortKey = "order" | "profile" | "response" | "products";
type ManufacturerDropdown = "industry" | "city" | "sort";

const fallbackSignal: Omit<ManufacturerRankingSignal, "slug"> = {
  order: 999,
  profile_completeness_percent: 70,
  response_time_tier: "unknown",
  published_article_count: 0,
};

function getResponseTierRank(tier: ResponseTimeTier) {
  switch (tier) {
    case "within_24h":
      return 1;
    case "within_3_days":
      return 2;
    case "within_1_week":
      return 3;
    case "unknown":
    default:
      return 4;
  }
}

export default function ManufacturersPage() {
  const { t } = useTranslation();
  const manufacturersT = useTranslation("translation", { keyPrefix: "pages.manufacturers" });
  const location = useLocation();
  const currentLanguage = useCurrentLanguage();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const siteName = import.meta.env.VITE_SITE_TITLE;
  const currentUrl = new URL(location.pathname, siteUrl).href;

  const industries = t("industries", { returnObjects: true }) as Industry[];
  const manufacturers = manufacturersT.t("list", { returnObjects: true }) as Manufacturer[];
  const products = t("pages.products.list", { returnObjects: true }) as ProductListItem[];

  const [selectedIndustrySlugs, setSelectedIndustrySlugs] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("order");
  const [openDropdown, setOpenDropdown] = useState<ManufacturerDropdown | null>(null);
  const isIndustryDropdownOpen = openDropdown === "industry";
  const isCityDropdownOpen = openDropdown === "city";
  const isSortDropdownOpen = openDropdown === "sort";
  const closeDropdowns = () => setOpenDropdown(null);
  const handleDropdownOpenChange = (dropdown: ManufacturerDropdown, open: boolean) => {
    setOpenDropdown(open ? dropdown : null);
  };

  const toggleIndustry = (slug: string) => {
    setSelectedIndustrySlugs(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    );
  };

  const removeIndustry = (slug: string) => {
    setSelectedIndustrySlugs(prev => prev.filter(s => s !== slug));
  };

  const toggleCity = (city: string) => {
    setSelectedCities(prev =>
      prev.includes(city)
        ? prev.filter(currentCity => currentCity !== city)
        : [...prev, city]
    );
  };

  const removeCity = (city: string) => {
    setSelectedCities(prev => prev.filter(currentCity => currentCity !== city));
  };

  const clearAll = () => {
    setSelectedIndustrySlugs([]);
    setSelectedCities([]);
    closeDropdowns();
  };

  const cities = useMemo(() => (
    Array.from(new Set(manufacturers.map(manufacturer => manufacturer.city).filter(Boolean) as string[]))
      .sort((a, b) => a.localeCompare(b))
  ), [manufacturers]);

  const signalsBySlug = useMemo(() => new Map(
    (rankingSignals as ManufacturerRankingSignalFile).records.map(signal => [signal.slug, signal])
  ), []);

  const productCountsByManufacturer = useMemo(() => {
    const counts = new Map<string, number>();

    products.forEach((product) => {
      const slug = product.manufacturer?.slug;
      if (!slug) return;
      counts.set(slug, (counts.get(slug) || 0) + 1);
    });

    return counts;
  }, [products]);

  const rankedManufacturers = useMemo(() => manufacturers.map((manufacturer) => {
    const signal = signalsBySlug.get(manufacturer.slug) || fallbackSignal;
    const productCount = productCountsByManufacturer.get(manufacturer.slug) || 0;

    return {
      ...manufacturer,
      ranking: {
        order: signal.order,
        profileCompletenessPercent: signal.profile_completeness_percent,
        responseTimeTier: signal.response_time_tier,
        responseTierRank: getResponseTierRank(signal.response_time_tier),
        publishedArticleCount: signal.published_article_count,
        productCount,
      },
    };
  }), [manufacturers, productCountsByManufacturer, signalsBySlug]);

  const filteredManufacturers = useMemo(() => {
    const selectedIndustryNames = selectedIndustrySlugs.length > 0
      ? industries
        .filter(i => selectedIndustrySlugs.includes(i.slug))
        .map(i => i.name)
      : [];

    const filtered = rankedManufacturers.filter(manufacturer => {
      const matchesIndustry = selectedIndustryNames.length === 0 || manufacturer.industries?.some(industryName => selectedIndustryNames.includes(industryName));
      const matchesCity = selectedCities.length === 0 || (manufacturer.city ? selectedCities.includes(manufacturer.city) : false);

      return matchesIndustry && matchesCity;
    });

    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "profile":
          return b.ranking.profileCompletenessPercent - a.ranking.profileCompletenessPercent;
        case "response":
          return a.ranking.responseTierRank - b.ranking.responseTierRank;
        case "products":
          return b.ranking.productCount - a.ranking.productCount;
        case "order":
        default:
          return a.ranking.order - b.ranking.order;
      }
    });
  }, [selectedIndustrySlugs, selectedCities, rankedManufacturers, industries, sortKey]);

  const selectedIndustries = useMemo(() =>
    industries.filter(i => selectedIndustrySlugs.includes(i.slug)),
    [industries, selectedIndustrySlugs]
  );

  const sortOptions = ["profile", "response", "products"] as SortKey[];
  const hasActiveFilters = selectedIndustrySlugs.length > 0 || selectedCities.length > 0;
  const selectedSortLabel = sortKey === "order"
    ? manufacturersT.t("sort_placeholder")
    : manufacturersT.t(`sort_options.${sortKey}`);

  return (
    <>
      <Head>
        <title>{manufacturersT.t("title")}</title>
        <link rel="canonical" href={currentUrl} />
        <meta name="title" content={manufacturersT.t("title")} />
        <meta name="description" content={manufacturersT.t("meta.description")} />
        <meta name="keywords" content={manufacturersT.t("meta.keywords")} />
        <meta property="og:title" content={manufacturersT.t("og.title")} />
        <meta property="og:description" content={manufacturersT.t("og.description")} />
        <meta property="og:image" content={manufacturersT.t("og.image")} />
        <meta property="og:url" content={manufacturersT.t("og.url", { url: currentUrl })} />
        <meta property="og:type" content={manufacturersT.t("og.type")} />
        <meta property="og:site_name" content={manufacturersT.t("og.site_name", { site_name: siteName })} />
      </Head>

      <main className="min-h-screen bg-background">

        <HeroSection />

        <section className="py-10">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">

            <div className="mb-8">
              <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                <FilterDropdown
                  open={isIndustryDropdownOpen}
                  onOpenChange={(open) => handleDropdownOpenChange("industry", open)}
                  contentClassName="w-72"
                  trigger={({ open, triggerProps }) => (
                    <button
                      {...triggerProps}
                      className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-background active:scale-[0.98]"
                    >
                      <Filter className="w-4 h-4 text-primary" />
                      <span>{manufacturersT.t("filter_industry")}</span>
                      <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                >
                      <div className="p-2.5 max-h-[340px] overflow-y-auto custom-scrollbar">
                        <button
                          onClick={() => setSelectedIndustrySlugs([])}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all group ${selectedIndustrySlugs.length === 0 ? 'bg-primary/[0.06] text-primary' : 'text-foreground hover:bg-zinc-950/[0.04] dark:hover:bg-white/[0.06]'
                            }`}
                        >
                          <span className="font-bold">{manufacturersT.t("filter_all_industries")}</span>
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
                </FilterDropdown>

                <FilterDropdown
                  open={isCityDropdownOpen}
                  onOpenChange={(open) => handleDropdownOpenChange("city", open)}
                  contentClassName="w-60"
                  trigger={({ open, triggerProps }) => (
                    <button
                      {...triggerProps}
                      className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-background active:scale-[0.98]"
                    >
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{manufacturersT.t("filter_city")}</span>
                      <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                >
                      <div className="p-2.5 max-h-[280px] overflow-y-auto custom-scrollbar">
                        <button
                          onClick={() => setSelectedCities([])}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all group ${selectedCities.length === 0 ? 'bg-primary/[0.06] text-primary' : 'text-foreground hover:bg-zinc-950/[0.04] dark:hover:bg-white/[0.06]'
                            }`}
                        >
                          <span className="font-bold">{manufacturersT.t("filter_all_cities")}</span>
                          {selectedCities.length === 0 && <Check className="w-4 h-4" />}
                        </button>
                        <div className="h-px bg-border/40 my-2 mx-2" />
                        <div className="grid gap-1">
                          {cities.map((city) => {
                            const isSelected = selectedCities.includes(city);
                            return (
                              <button
                                key={city}
                                onClick={() => toggleCity(city)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-all group ${isSelected
                                  ? 'bg-primary/[0.06] text-primary font-semibold'
                                  : 'text-foreground hover:bg-zinc-950/[0.04] dark:hover:bg-white/[0.06]'
                                  }`}
                              >
                                <span>{city}</span>
                                {isSelected && <Check className="w-4 h-4 animate-in zoom-in duration-200" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                </FilterDropdown>

                <FilterDropdown
                  open={isSortDropdownOpen}
                  onOpenChange={(open) => handleDropdownOpenChange("sort", open)}
                  contentClassName="w-72"
                  trigger={({ open, triggerProps }) => (
                    <button
                      {...triggerProps}
                      className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-background active:scale-[0.98]"
                    >
                      <ArrowUpDown className="h-4 w-4 text-primary" />
                      <span>{manufacturersT.t("sort_by")}</span>
                      <span className="text-zinc-600 dark:text-zinc-300">{selectedSortLabel}</span>
                      <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                >
                      <div className="p-2.5">
                        <div className="grid gap-1">
                          {sortOptions.map((option) => {
                            const isSelected = sortKey === option;
                            return (
                              <button
                                key={option}
                                onClick={() => {
                                  setSortKey(option);
                                  closeDropdowns();
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-all group ${isSelected
                                  ? 'bg-primary/[0.06] text-primary font-semibold'
                                  : 'text-foreground hover:bg-zinc-950/[0.04] dark:hover:bg-white/[0.06]'
                                  }`}
                              >
                                <span>{manufacturersT.t(`sort_options.${option}`)}</span>
                                {isSelected && <Check className="w-4 h-4 animate-in zoom-in duration-200" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                </FilterDropdown>

                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-500/10 hover:text-red-400 active:scale-95"
                  >
                    <X className="w-4 h-4" />
                    {manufacturersT.t("clear_all")}
                  </button>
                )}
              </div>

              {/* Selected Tags */}
              {hasActiveFilters && (
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
                  {selectedCities.map((city) => (
                    <div
                      key={city}
                      className="inline-flex items-center justify-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary shadow-sm transition-all hover:shadow-md group"
                    >
                      <span className="leading-none">{city}</span>
                      <button
                        onClick={() => removeCity(city)}
                        className="hover:bg-primary/20 rounded-full p-1 transition-all group-hover:scale-110 flex items-center justify-center"
                        aria-label={`Remove ${city}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredManufacturers.map((company) => (
                <ManufacturerCard
                  key={company.slug}
                  company={{
                    id: company.slug,
                    name: company.name || '',
                    location: `${company.city || ''}, ${company.country_name || ''}`.trim().replace(/^,\s*/, ''),
                    description: company.short_description || '',
                    tags: company.industries || [],
                    link: addLanguageToPath(`/manufacturers/${company.slug}`, currentLanguage),
                    ranking: company.ranking,
                  }}
                />
              ))}

              {filteredManufacturers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-500 md:col-span-2 xl:col-span-3">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Filter className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {manufacturersT.t("no_results")}
                  </h3>
                  <button
                    onClick={clearAll}
                    className="text-primary hover:underline font-medium"
                  >
                    {manufacturersT.t("clear_all")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
