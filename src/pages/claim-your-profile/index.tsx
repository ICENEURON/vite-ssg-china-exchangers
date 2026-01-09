
import { Head } from 'vite-react-ssg'
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HeroSection } from './components/HeroSection'
import { BenefitsSection } from './components/BenefitsSection'
import { VerificationSection } from './components/VerificationSection'
import { StepByStepSection } from './components/StepByStepSection'

export default function ClaimProfilePage() {
  const { t } = useTranslation("translation");
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const siteName = import.meta.env.VITE_SITE_TITLE;
  const currentUrl = new URL(location.pathname, siteUrl).href;

  return (
    <>
      <Head>
        <title>{t("pages.profile.title")}</title>
        <link rel="canonical" href={currentUrl} />
        <meta name="title" content={t("pages.profile.title")} />
        <meta name="description" content={t("pages.profile.meta.description")} />
        <meta name="keywords" content={t("pages.profile.meta.keywords")} />
        <meta property="og:title" content={t("pages.profile.og.title")} />
        <meta property="og:description" content={t("pages.profile.og.description")} />
        <meta property="og:image" content={t("pages.profile.og.image")} />
        <meta property="og:url" content={t("pages.profile.og.url", { url: currentUrl })} />
        <meta property="og:type" content={t("pages.profile.og.type")} />
        <meta property="og:site_name" content={t("pages.profile.og.site_name", { site_name: siteName })} />
      </Head>

      <main className="min-h-screen">
        <HeroSection />
        <BenefitsSection />
        <VerificationSection />
        <StepByStepSection />
      </main>
    </>
  )
}
