import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SeoHead } from "../../components/seo/SeoHead";
import { HeroSection } from "./components/HeroSection";
import { ValuePropGrid } from "./components/ValuePropGrid";
import { CategoryShowcase } from "./components/CategoryShowcase";
import { CategoryStats } from "./components/CategoryStats";
import { HowItWorks } from "./components/HowItWorks";
import { IndustryNewsFocus } from "./components/IndustryNewsFocus";
import { FeaturedManufacturers } from "./components/FeaturedManufacturers";
import { HighlightedArticles } from "./components/HighlightedArticles";

export default function HomePage() {
  const { t } = useTranslation("translation");
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://heatexdirect.com";
  const siteName = import.meta.env.VITE_SITE_TITLE || "HeatEx Direct";
  const currentUrl = new URL(location.pathname, siteUrl).href;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": new URL("#organization", siteUrl).href,
      name: siteName || "HeatEx Direct",
      url: siteUrl,
      logo: new URL("/static/websites/heatex-direct.png", siteUrl).href,
      description: t("pages.home.schema.organizationDescription"),
      areaServed: "Worldwide",
      knowsAbout: [
        "China heat exchanger manufacturers",
        "International industrial sourcing research",
        "Industrial heat exchangers",
        "Plate heat exchangers",
        "Shell and tube heat exchangers",
        "Supplier verification",
        "Industrial quote request intake",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": new URL("#website", siteUrl).href,
      name: siteName || "HeatEx Direct",
      url: siteUrl,
      description: t("pages.home.schema.websiteDescription"),
      inLanguage: ["en", "zh"],
    },
  ];

  return (
    <>
      <SeoHead
        title={t("pages.home.title")}
        description={t("pages.home.meta.description")}
        keywords={t("pages.home.meta.keywords")}
        canonicalUrl={currentUrl}
        ogTitle={t("pages.home.og.title")}
        ogDescription={t("pages.home.og.description")}
        siteName={siteName}
        structuredData={structuredData}
      />

      <div className="min-h-screen">
        <HeroSection />
        <FeaturedManufacturers />
        <CategoryShowcase />
        <IndustryNewsFocus />
        <HighlightedArticles />
        <CategoryStats />
        <ValuePropGrid />
        <HowItWorks />
      </div>
    </>
  );
}
