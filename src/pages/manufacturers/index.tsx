
import { Head } from 'vite-react-ssg'
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ManufacturerCard } from "./components/ManufacturerCard"
import { HeroSection } from "./components/HeroSection"

interface Manufacturer {
  id: string;
  name: string;
  location: string;
  verified: boolean;
  description: string;
  tags: string[];
  link: string;
}

export default function ManufacturersPage() {
  const { t } = useTranslation("translation", { keyPrefix: "pages.manufacturers" });
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const siteName = import.meta.env.VITE_SITE_TITLE;
  const currentUrl = new URL(location.pathname, siteUrl).href;

  const manufacturers = t("list", { returnObjects: true }) as Manufacturer[];

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <link rel="canonical" href={currentUrl} />
        <meta name="title" content={t("title")} />
        <meta name="description" content={t("meta.description")} />
        <meta name="keywords" content={t("meta.keywords")} />
        <meta property="og:title" content={t("og.title")} />
        <meta property="og:description" content={t("og.description")} />
        <meta property="og:image" content={t("og.image")} />
        <meta property="og:url" content={t("og.url", { url: currentUrl })} />
        <meta property="og:type" content={t("og.type")} />
        <meta property="og:site_name" content={t("og.site_name", { site_name: siteName })} />
      </Head>

      <main className="min-h-screen bg-background">

        <HeroSection />

        {/* Directory List */}
        <section className="py-16">
          <div className="container mx-auto px-8 max-w-6xl">
            <div className="grid gap-6">
              {manufacturers.map((company) => (
                <ManufacturerCard key={company.id} company={company} />
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
