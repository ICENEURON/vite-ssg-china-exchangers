import { Head } from 'vite-react-ssg'
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ContactHero } from './components/ContactHero'
import { ContactReasons } from './components/ContactReasons'
import { ContactCTA } from './components/ContactCTA'

export default function ContactPage() {
  const { t } = useTranslation("translation");
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const siteName = import.meta.env.VITE_SITE_TITLE;
  const currentUrl = new URL(location.pathname, siteUrl).href;

  return (
    <>
      <Head>
        <title>{t("pages.contact.title")}</title>
        <link rel="canonical" href={currentUrl} />
        <meta name="title" content={t("pages.contact.title")} />
        <meta name="description" content={t("pages.contact.meta.description")} />
        <meta name="keywords" content={t("pages.contact.meta.keywords")} />
        <meta property="og:title" content={t("pages.contact.og.title")} />
        <meta property="og:description" content={t("pages.contact.og.description")} />
        <meta property="og:image" content={t("pages.contact.og.image")} />
        <meta property="og:url" content={t("pages.contact.og.url", { url: currentUrl })} />
        <meta property="og:type" content={t("pages.contact.og.type")} />
        <meta property="og:site_name" content={t("pages.contact.og.site_name", { site_name: siteName })} />
      </Head>

      <main className="min-h-screen">
        <ContactHero />
        <ContactReasons />
        <ContactCTA />
      </main>
    </>
  )
}
