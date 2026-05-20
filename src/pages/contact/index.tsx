import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SeoHead } from '../../components/seo/SeoHead'
import { ContactHero } from './components/ContactHero'
import { ContactReasons } from './components/ContactReasons'
import { ContactCTA } from './components/ContactCTA'

export default function ContactPage() {
  const { t } = useTranslation("translation");
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://heatexdirect.com";
  const siteName = import.meta.env.VITE_SITE_TITLE || "HeatEx Direct";
  const currentUrl = new URL(location.pathname, siteUrl).href;

  return (
    <>
      <SeoHead
        title={t("pages.contact.title")}
        description={t("pages.contact.meta.description")}
        keywords={t("pages.contact.meta.keywords")}
        canonicalUrl={currentUrl}
        ogTitle={t("pages.contact.og.title")}
        ogDescription={t("pages.contact.og.description")}
        siteName={siteName}
      />

      <main className="min-h-screen">
        <ContactHero />
        <ContactReasons />
        <ContactCTA />
      </main>
    </>
  )
}
