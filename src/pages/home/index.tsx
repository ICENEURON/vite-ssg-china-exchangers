import { Head } from "vite-react-ssg";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HeroSection } from "./components/HeroSection";
import { ValuePropGrid } from "./components/ValuePropGrid";
import { CompanyIntro } from "./components/CompanyIntro";
import { CategoryShowcase } from "./components/CategoryShowcase";
import { HowItWorks } from "./components/HowItWorks";
import { IndustryNewsFocus } from "./components/IndustryNewsFocus";

export default function HomePage() {
  const { t } = useTranslation("translation");
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const siteName = import.meta.env.VITE_SITE_TITLE;
  const currentUrl = new URL(location.pathname, siteUrl).href;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteName || "HeatEx Direct",
      url: siteUrl,
      description: t("pages.home.schema.organizationDescription"),
      foundingLocation: {
        "@type": "Place",
        name: "Melbourne, Australia",
      },
      areaServed: "Worldwide",
      knowsAbout: [
        "China heat exchanger manufacturers",
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
      name: siteName || "HeatEx Direct",
      url: siteUrl,
      description: t("pages.home.schema.websiteDescription"),
      inLanguage: ["en", "zh"],
    },
  ];

  return (
    <>
      <Head>
        <title>{t("pages.home.title")}</title>
        <link rel="canonical" href={currentUrl} />
        <meta name="title" content={t("pages.home.title")} />
        <meta name="description" content={t("pages.home.meta.description")} />
        <meta name="keywords" content={t("pages.home.meta.keywords")} />
        <meta property="og:title" content={t("pages.home.og.title")} />
        <meta property="og:description" content={t("pages.home.og.description")} />
        <meta property="og:image" content={t("pages.home.og.image")} />
        <meta property="og:url" content={t("pages.home.og.url", { url: currentUrl })} />
        <meta property="og:type" content={t("pages.home.og.type")} />
        <meta property="og:site_name" content={t("pages.home.og.site_name", { site_name: siteName })} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <div className="min-h-screen">
        <HeroSection />
        <ValuePropGrid />
        <CompanyIntro />
        <CategoryShowcase />
        <HowItWorks />
        <IndustryNewsFocus />
      </div>
    </>
  );
}
