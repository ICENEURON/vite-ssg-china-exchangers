
import { Head } from 'vite-react-ssg'
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HeroSection } from './components/HeroSection'
import { PlatformValueSection } from './components/PlatformValueSection'
import { GuidelinesSection } from './components/GuidelinesSection'
import { ProcessSection } from './components/ProcessSection'
import { CTASection } from './components/CTASection'

export default function ContentMarketingServicesPage() {
    const { t } = useTranslation("translation");
    const location = useLocation();
    const siteUrl = import.meta.env.VITE_SITE_URL;
    const siteName = import.meta.env.VITE_SITE_TITLE;
    const currentUrl = new URL(location.pathname, siteUrl).href;

    return (
        <>
            <Head>
                <title>{t("pages.cms.title")}</title>
                <link rel="canonical" href={currentUrl} />
                <meta name="title" content={t("pages.cms.title")} />
                <meta name="description" content={t("pages.cms.meta.description")} />
                <meta name="keywords" content={t("pages.cms.meta.keywords")} />
                <meta property="og:title" content={t("pages.cms.og.title")} />
                <meta property="og:description" content={t("pages.cms.og.description")} />
                <meta property="og:image" content={t("pages.cms.og.image")} />
                <meta property="og:url" content={t("pages.cms.og.url", { url: currentUrl })} />
                <meta property="og:type" content={t("pages.cms.og.type")} />
                <meta property="og:site_name" content={t("pages.cms.og.site_name", { site_name: siteName })} />
            </Head>

            <main className="min-h-screen">
                <HeroSection />
                <PlatformValueSection />
                <GuidelinesSection />
                <ProcessSection />
                <CTASection />
            </main>
        </>
    )
}
