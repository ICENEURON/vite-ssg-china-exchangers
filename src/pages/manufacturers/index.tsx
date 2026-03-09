
import { useState, useMemo, useRef, useEffect } from 'react'
import { Head } from 'vite-react-ssg'
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, X, Check, Filter } from 'lucide-react';
import { ManufacturerCard } from "./components/ManufacturerCard"
import { HeroSection } from "./components/HeroSection"
import { useCurrentLanguage, addLanguageToPath } from "../../utils/language-routing"

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

  const [selectedIndustrySlugs, setSelectedIndustrySlugs] = useState<string[]>([]);
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

  const removeIndustry = (slug: string) => {
    setSelectedIndustrySlugs(prev => prev.filter(s => s !== slug));
  };

  const clearAll = () => {
    setSelectedIndustrySlugs([]);
    setIsDropdownOpen(false);
  };

  const filteredManufacturers = useMemo(() => {
    if (selectedIndustrySlugs.length === 0) return manufacturers;

    const selectedIndustryNames = industries
      .filter(i => selectedIndustrySlugs.includes(i.slug))
      .map(i => i.name);

    return manufacturers.filter(m =>
      m.industries?.some(industryName => selectedIndustryNames.includes(industryName))
    );
  }, [selectedIndustrySlugs, manufacturers, industries]);

  const selectedIndustries = useMemo(() =>
    industries.filter(i => selectedIndustrySlugs.includes(i.slug)),
    [industries, selectedIndustrySlugs]
  );

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

        <section className="py-16">
          <div className="container mx-auto px-8 max-w-6xl">

            {/* Filter Section */}
            <div className="mb-10">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 px-5 py-2.5 bg-card/40 backdrop-blur-md border border-border/60 rounded-xl text-sm font-semibold hover:border-primary/50 hover:bg-card transition-all shadow-sm active:scale-[0.98]"
                  >
                    <Filter className="w-4 h-4 text-primary" />
                    <span className="text-foreground/90">{manufacturersT.t("filter_by")}</span>
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
                          <span className="font-bold">{manufacturersT.t("filter_all")}</span>
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
                    className="text-sm font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 px-3 py-1 gap-2 active:scale-95"
                  >
                    <X className="w-4 h-4" />
                    {manufacturersT.t("clear_all")}
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
            </div>

            <div className="grid gap-6">
              {filteredManufacturers.map((company) => (
                <ManufacturerCard
                  key={company.slug}
                  company={{
                    id: company.slug,
                    name: company.name || '',
                    location: `${company.city || ''}, ${company.country_name || ''}`.trim().replace(/^,\s*/, ''),
                    verified: true,
                    description: company.short_description || '',
                    tags: company.industries || [],
                    link: addLanguageToPath(`/manufacturers/${company.slug}`, currentLanguage)
                  }}
                />
              ))}

              {filteredManufacturers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-500">
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
