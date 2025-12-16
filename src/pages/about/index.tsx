import { Head } from 'vite-react-ssg'
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AboutHero } from './components/AboutHero'
import { WhoWeAre } from './components/WhoWeAre'
import { ProblemSection } from './components/ProblemSection'
import { VerificationGrid } from './components/VerificationGrid'
import { AboutCTA } from './components/AboutCTA'

export default function AboutPage() {
  const { t } = useTranslation("translation");
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const siteName = import.meta.env.VITE_SITE_TITLE;
  const currentUrl = new URL(location.pathname, siteUrl).href;

  return (
    <>
      <Head>
        <title>{t("pages.about.title")}</title>
        <link rel="canonical" href={currentUrl} />
        <meta name="title" content={t("pages.about.title")} />
        <meta name="description" content={t("pages.about.meta.description")} />
        <meta name="keywords" content={t("pages.about.meta.keywords")} />
        <meta property="og:title" content={t("pages.about.og.title")} />
        <meta property="og:description" content={t("pages.about.og.description")} />
        <meta property="og:image" content={t("pages.about.og.image")} />
        <meta property="og:url" content={t("pages.about.og.url", { url: currentUrl })} />
        <meta property="og:type" content={t("pages.about.og.type")} />
        <meta property="og:site_name" content={t("pages.about.og.site_name", { site_name: siteName })} />
      </Head>

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
