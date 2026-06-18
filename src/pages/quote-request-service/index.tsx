import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SeoHead } from "../../components/seo/SeoHead";
import { EmailTypeContactRangeSection } from "./components/EmailTypeContactRangeSection";
import { HeroSection } from "./components/HeroSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { WhatThisServiceDoesSection } from "./components/WhatThisServiceDoesSection";

export default function HeatExchangerRfqLandingPage() {
  const { t } = useTranslation("translation");
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://heatexdirect.com";
  const siteName = import.meta.env.VITE_SITE_TITLE || "HeatEx Direct";
  const currentUrl = new URL(location.pathname, siteUrl).href;
  const structuredData: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": new URL("#quote-request-service", currentUrl).href,
      name: t("pages.quoteRequestService.schema.name"),
      description: t("pages.quoteRequestService.schema.description"),
      provider: {
        "@type": "Organization",
        name: siteName,
        url: siteUrl,
      },
      areaServed: "Worldwide",
      serviceType: t("pages.quoteRequestService.schema.serviceType"),
    },
  ];

  return (
    <>
      <SeoHead
        title={t("pages.quoteRequestService.title")}
        description={t("pages.quoteRequestService.meta.description")}
        keywords={t("pages.quoteRequestService.meta.keywords")}
        canonicalUrl={currentUrl}
        ogTitle={t("pages.quoteRequestService.og.title")}
        ogDescription={t("pages.quoteRequestService.og.description")}
        siteName={siteName}
        structuredData={structuredData}
      />

      <main data-page="quote-request-service" className="min-h-screen overflow-x-hidden bg-white text-[#101820]">
        <HeroSection />
        <WhatThisServiceDoesSection />
        <HowItWorksSection />
        <EmailTypeContactRangeSection />
      </main>
    </>
  );
}
