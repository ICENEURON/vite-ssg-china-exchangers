
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SeoHead } from '../../components/seo/SeoHead'
import { HeroSection } from './components/HeroSection'
import { BenefitsSection } from './components/BenefitsSection'
import { VerificationSection } from './components/VerificationSection'
import { StepByStepSection } from './components/StepByStepSection'

export default function ClaimProfilePage() {
  const { t } = useTranslation("translation");
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://heatexdirect.com";
  const siteName = import.meta.env.VITE_SITE_TITLE || "HeatEx Direct";
  const currentUrl = new URL(location.pathname, siteUrl).href;

  return (
    <>
      <SeoHead
        title={t("pages.profile.title")}
        description={t("pages.profile.meta.description")}
        keywords={t("pages.profile.meta.keywords")}
        canonicalUrl={currentUrl}
        ogTitle={t("pages.profile.og.title")}
        ogDescription={t("pages.profile.og.description")}
        siteName={siteName}
      />

      <main className="min-h-screen">
        <HeroSection />
        <BenefitsSection />
        <VerificationSection />
        <StepByStepSection />
      </main>
    </>
  )
}
