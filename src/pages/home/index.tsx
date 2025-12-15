import { Head } from "vite-react-ssg";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HeroSection } from "./components/HeroSection";
import { ValuePropGrid } from "./components/ValuePropGrid";
import { CategoryShowcase } from "./components/CategoryShowcase";
import { HowItWorks } from "./components/HowItWorks";

export default function HomePage() {
  const { t } = useTranslation("translation");
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const siteName = import.meta.env.VITE_SITE_TITLE;
  const currentUrl = new URL(location.pathname, siteUrl).href;

  return (
    <>
      <Head>
        <title>{t("pages.home.title")}</title>
        <link rel="canonical" href={t("pages.home.link.canonical", { url: currentUrl })} />
        <meta name="title" content={t("pages.home.title")} />
        <meta name="description" content={t("pages.home.meta.description")} />
        <meta name="keywords" content={t("pages.home.meta.keywords")} />
        <meta property="og:title" content={t("pages.home.og.title")} />
        <meta property="og:description" content={t("pages.home.og.description")} />
        <meta property="og:image" content={t("pages.home.og.image")} />
        <meta property="og:url" content={t("pages.home.og.url", { url: currentUrl })} />
        <meta property="og:type" content={t("pages.home.og.type")} />
        <meta property="og:site_name" content={t("pages.home.og.site_name", { site_name: siteName })} />
      </Head>

      <div className="min-h-screen">
        <HeroSection />
        <ValuePropGrid />
        <CategoryShowcase />
        <HowItWorks />
      </div>
    </>
  );
}
