
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SeoHead } from '../../components/seo/SeoHead'
import { HeroSection } from './components/HeroSection'
import { PlatformValueSection } from './components/PlatformValueSection'
import { GuidelinesSection } from './components/GuidelinesSection'
import { ProcessSection } from './components/ProcessSection'
import { CTASection } from './components/CTASection'

export default function ContentMarketingServicesPage() {
    const { t } = useTranslation("translation");
    const location = useLocation();
    const siteUrl = import.meta.env.VITE_SITE_URL || "https://heatexdirect.com";
    const siteName = import.meta.env.VITE_SITE_TITLE || "HeatEx Direct";
    const currentUrl = new URL(location.pathname, siteUrl).href;

    return (
        <>
            <SeoHead
                title={t("pages.cms.title")}
                description={t("pages.cms.meta.description")}
                keywords={t("pages.cms.meta.keywords")}
                canonicalUrl={currentUrl}
                ogTitle={t("pages.cms.og.title")}
                ogDescription={t("pages.cms.og.description")}
                siteName={siteName}
            />

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
