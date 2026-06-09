
import { useState, useMemo } from 'react'
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SeoHead } from '../../components/seo/SeoHead'
import { ChevronDown, X, Check, Filter } from 'lucide-react';
import { FilterDropdown } from "../../components/ui/filter-dropdown"
import { ManufacturerCard } from "./components/ManufacturerCard"
import { HeroSection } from "./components/HeroSection"
import { useCurrentLanguage, addLanguageToPath } from "../../utils/language-routing"
import manufacturerScores from "../../data/manufacturer_scores.json"
import {
  getManufacturerScoreRecords,
  getManufacturerSortOrder,
  type ManufacturerScoreSource,
} from "../../utils/manufacturer-ranking"

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

type ManufacturerDropdown = "industry";

export default function ManufacturersPage() {
  const { t } = useTranslation();
  const manufacturersT = useTranslation("translation", { keyPrefix: "pages.manufacturers" });
  const location = useLocation();
  const currentLanguage = useCurrentLanguage();
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://heatexdirect.com";
  const siteName = import.meta.env.VITE_SITE_TITLE || "HeatEx Direct";
  const currentUrl = new URL(location.pathname, siteUrl).href;

  const industries = t("industries", { returnObjects: true }) as Industry[];
  const manufacturers = manufacturersT.t("list", { returnObjects: true }) as Manufacturer[];

  const [selectedIndustrySlugs, setSelectedIndustrySlugs] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<ManufacturerDropdown | null>(null);
  const isIndustryDropdownOpen = openDropdown === "industry";
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

  const clearAll = () => {
    setSelectedIndustrySlugs([]);
    closeDropdowns();
  };

  const signalsBySlug = useMemo(() => new Map(
    getManufacturerScoreRecords(manufacturerScores as ManufacturerScoreSource).map(signal => [signal.manufacturer_slug, signal])
  ), []);

  const rankedManufacturers = useMemo(() => manufacturers.map((manufacturer) => {
    const order = getManufacturerSortOrder(manufacturer.slug, signalsBySlug);

    return {
      ...manufacturer,
      ranking: {
        order,
      },
    };
  }), [manufacturers, signalsBySlug]);

  const filteredManufacturers = useMemo(() => {
    const selectedIndustryNames = selectedIndustrySlugs.length > 0
      ? industries
        .filter(i => selectedIndustrySlugs.includes(i.slug))
        .map(i => i.name)
      : [];

    const filtered = rankedManufacturers.filter(manufacturer => {
      const matchesIndustry = selectedIndustryNames.length === 0 || manufacturer.industries?.some(industryName => selectedIndustryNames.includes(industryName));

      return matchesIndustry;
    });

    return [...filtered].sort((a, b) => a.ranking.order - b.ranking.order || (a.name || "").localeCompare(b.name || ""));
  }, [selectedIndustrySlugs, rankedManufacturers, industries]);

  const selectedIndustries = useMemo(() =>
    industries.filter(i => selectedIndustrySlugs.includes(i.slug)),
    [industries, selectedIndustrySlugs]
  );

  const hasActiveFilters = selectedIndustrySlugs.length > 0;

  return (
    <>
      <SeoHead
        title={manufacturersT.t("title")}
        description={manufacturersT.t("meta.description")}
        keywords={manufacturersT.t("meta.keywords")}
        canonicalUrl={currentUrl}
        ogTitle={manufacturersT.t("og.title")}
        ogDescription={manufacturersT.t("og.description")}
        siteName={siteName}
      />

      <main className="min-h-screen bg-background">

        <HeroSection />

        <section className="py-10">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">

            <div className="mb-6">
              <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                <FilterDropdown
                  open={isIndustryDropdownOpen}
                  onOpenChange={(open) => handleDropdownOpenChange("industry", open)}
                  contentClassName="w-72 rounded-sm bg-white"
                  trigger={({ open, triggerProps }) => (
                    <button
                      {...triggerProps}
                      className="flex items-center gap-2 rounded-sm border border-border/60 bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-background active:scale-[0.98]"
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
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-sm transition-all group ${selectedIndustrySlugs.length === 0 ? 'bg-primary/[0.06] text-primary' : 'text-foreground hover:bg-zinc-950/[0.04]'
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
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-sm transition-all group ${isSelected
                                  ? 'bg-primary/[0.06] text-primary font-semibold'
                                  : 'text-foreground hover:bg-zinc-950/[0.04]'
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

                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="flex items-center justify-center gap-2 rounded-sm px-3 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-500/10 hover:text-red-400 active:scale-95"
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
                      className="inline-flex items-center justify-center gap-1 px-3 py-1 bg-primary/5 text-primary border border-primary/20 rounded-sm text-xs font-bold shadow-sm hover:shadow-md transition-all group"
                    >
                      <span className="leading-none">{industry.name}</span>
                      <button
                        onClick={() => removeIndustry(industry.slug)}
                        className="hover:bg-primary/20 rounded-sm p-1 transition-all group-hover:scale-110 flex items-center justify-center"
                        aria-label={`Remove ${industry.name}`}
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
                  }}
                />
              ))}

              {filteredManufacturers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-500 md:col-span-2 xl:col-span-3">
                  <div className="w-16 h-16 bg-muted rounded-sm flex items-center justify-center mb-4">
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
