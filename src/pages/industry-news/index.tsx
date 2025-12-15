import { Head } from 'vite-react-ssg'
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { posts } from '.velite'
import { useCurrentLanguage } from '../../utils/language-routing'
import { NewsHero } from './components/NewsHero'
import { NewsList } from './components/NewsList'

export default function BlogsPage() {
    const { t } = useTranslation("translation");
    const location = useLocation();
    const siteUrl = import.meta.env.VITE_SITE_URL;
    const siteName = import.meta.env.VITE_SITE_TITLE;
    const currentUrl = new URL(location.pathname, siteUrl).href;

    const currentLanguage = useCurrentLanguage();

    // Filter posts by language and sort by date (newest first)
    const filteredPosts = posts
        .filter(post => post.lang === currentLanguage)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // First post is featured
    const featuredPost = filteredPosts[0];
    // Rest are list items
    const listPosts = filteredPosts.slice(1);

    return (
        <>
            <Head>
                <title>{t("pages.news.title")}</title>
                <link rel="canonical" href={currentUrl} />
                <meta name="title" content={t("pages.news.title")} />
                <meta name="description" content={t("pages.news.meta.description")} />
                <meta name="keywords" content={t("pages.news.meta.keywords")} />
                <meta property="og:title" content={t("pages.news.og.title")} />
                <meta property="og:description" content={t("pages.news.og.description")} />
                <meta property="og:image" content={t("pages.news.og.image")} />
                <meta property="og:url" content={t("pages.news.og.url", { url: currentUrl })} />
                <meta property="og:type" content={t("pages.news.og.type")} />
                <meta property="og:site_name" content={t("pages.news.og.site_name", { site_name: siteName })} />
            </Head>

            {/* Hero Section + News List Layout */}
            <section className="py-16 px-4 min-h-screen">
                <div className="container mx-auto max-w-5xl space-y-8">
                    <div className="grid gap-2 text-center md:text-left">
                        <h1 className="tracking-tight text-foreground">{t("pages.news.page.title")}</h1>
                        <p className="text-muted">{t("pages.news.page.subtitle")}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-3 space-y-8">
                            <NewsHero post={featuredPost} />
                            {listPosts.length > 0 && (
                                <div>
                                    <h2 className="mt-12 mb-2 text-foreground flex items-center gap-2">
                                        <span className="w-1 h-8 bg-primary inline-block"></span>
                                        {t("pages.news.page.latest")}
                                    </h2>
                                    <NewsList posts={listPosts} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
