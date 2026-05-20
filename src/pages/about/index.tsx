import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SeoHead } from '../../components/seo/SeoHead'
import { AboutHero } from './components/AboutHero'
import { WhoWeAre } from './components/WhoWeAre'
import { ProblemSection } from './components/ProblemSection'
import { VerificationGrid } from './components/VerificationGrid'
import { AboutCTA } from './components/AboutCTA'

export default function AboutPage() {
  const { t } = useTranslation("translation");
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://heatexdirect.com";
  const siteName = import.meta.env.VITE_SITE_TITLE || "HeatEx Direct";
  const currentUrl = new URL(location.pathname, siteUrl).href;

  return (
    <>
      <SeoHead
        title={t("pages.about.title")}
        description={t("pages.about.meta.description")}
        keywords={t("pages.about.meta.keywords")}
        canonicalUrl={currentUrl}
        ogTitle={t("pages.about.og.title")}
        ogDescription={t("pages.about.og.description")}
        siteName={siteName}
      />

      <main className="min-h-screen">
        <AboutHero />
        <WhoWeAre />
        <ProblemSection />
        <VerificationGrid />
        <AboutCTA />
      </main>
    </>
  )
}
