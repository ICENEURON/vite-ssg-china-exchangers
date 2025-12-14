import { Head } from "vite-react-ssg";
import { useTranslation } from "react-i18next";
import { HeroSection } from "./components/HeroSection";
import { ValuePropGrid } from "./components/ValuePropGrid";
import { CategoryShowcase } from "./components/CategoryShowcase";
import { HowItWorks } from "./components/HowItWorks";

export default function HomePage() {
  const { t } = useTranslation("translation");

  return (
    <>
      <Head>
        <title>{t("pages.home.title")}</title>
        <meta name="description" content={t("pages.home.meta.description")} />
        <meta name="keywords" content={t("pages.home.meta.keywords")} />
        <meta property="og:title" content={t("pages.home.og.title")} />
        <meta
          property="og:description"
          content={t("pages.home.og.description")}
        />
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
