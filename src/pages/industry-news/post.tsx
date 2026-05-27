import { posts } from '.velite'
import { useParams, Link } from 'react-router-dom'
import { FileQuestion, Clock, User, BookOpen, ArrowLeft } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { SeoHead } from '../../components/seo/SeoHead'
import { useCurrentLanguage, addLanguageToPath } from '../../utils/language-routing'
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import manufacturersData from '../../data/manufacturers.json';
// 获取公司名称
const manufacturerNameBySlug = new Map(
    (manufacturersData || []).map((manufacturer) => [manufacturer.slug, manufacturer.name])
);
function getCompanyName(slug: string, lang: string) {
    const name = manufacturerNameBySlug.get(slug);
    if (!name) return slug;
    return lang === 'zh' ? name.zh : name.en;
}

function wrapScrollableTables(content: string) {
    return content
        .replace(/<table(\s|>)/g, '<div class="my-6 max-w-full overflow-x-auto"><table$1')
        .replace(/<\/table>/g, '</table></div>');
}

export default function BlogPost() {
    const { t } = useTranslation("translation");
    const location = useLocation();
    const siteUrl = import.meta.env.VITE_SITE_URL || "https://heatexdirect.com";
    const siteName = import.meta.env.VITE_SITE_TITLE || "HeatEx Direct";
    const currentUrl = new URL(location.pathname, siteUrl).href;

    const { contentType, slug } = useParams()
    const currentLanguage = useCurrentLanguage();

    // Filter posts by language and sort by date (newest first)
    const sortedPosts = posts
        .filter(post => post.lang === currentLanguage)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const currentIndex = sortedPosts.findIndex(p => {
        if (p.slug !== slug) return false;

        if (contentType && p.contentType !== contentType) return false;

        return true;
    });
    const post = sortedPosts[currentIndex];
    const postContent = post ? wrapScrollableTables(post.content) : "";
    const postOgImage = post?.cover ? new URL(post.cover, siteUrl).href : undefined;

    const relatedPosts = post
        ? sortedPosts.filter((rPost) => rPost.permalink !== post.permalink).slice(0, 5)
        : [];

    const backLink = addLanguageToPath('/industry-news', currentLanguage);

    if (!post) return (
        <section className="py-10 px-2 flex justify-center min-h-[60vh]">
            <div className="container px-4 max-w-6xl flex flex-col items-center justify-center gap-4 text-center">
                <div className="text-muted p-4">
                    <FileQuestion className="w-20 h-20 opacity-20 mx-auto" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground p-2">{t("pages.news.blog.not_found_title")}</h1>
                <p className="text-xl text-muted max-w-md mx-auto leading-relaxed p-2">
                    {t("pages.news.blog.not_found_desc")}
                </p>
                <div className="p-4">
                    <Button asChild size="lg" className="font-semibold px-8 h-12 rounded-full shadow-lg hover:shadow-xl transition-all">
                        <Link to={backLink}>
                            {t("pages.news.blog.back_to_list")}
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )

    return (
        <section className="py-10 px-2 flex justify-center bg-background">
            <SeoHead
                title={post.metaTitle || post.title}
                description={post.metaDescription || post.excerpt || post.title}
                keywords={post.keywords?.join(', ')}
                canonicalUrl={currentUrl}
                ogImage={postOgImage}
                ogType="article"
                siteName={siteName}
            />

            <div className="container pt-16 px-4 max-w-6xl flex flex-col gap-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Main Content */}
                    <div className="min-w-0 lg:col-span-3 flex flex-col gap-6">
                        <article className="prose prose-slate max-w-none min-w-0 flex flex-col gap-6 !text-base !leading-relaxed">
                            <div className="not-prose flex flex-col gap-4 border-b border-border pb-6">
                                <div className="flex flex-col items-start gap-2 text-sm text-muted">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <time dateTime={post.date}>
                                            {new Date(post.date).toISOString().split('T')[0]}
                                        </time>
                                    </div>
                                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 p-0 m-0 leading-tight">
                                        {post.title}
                                    </h1>
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        {post.author && (
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                <span>{t("pages.news.blog.author")}: {post.author}</span>
                                            </div>
                                        )}
                                        {post.readTime && (
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="w-4 h-4" />
                                                <span>{t("pages.news.blog.read_time")}: {post.readTime}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {post.cover && (
                                <div className="not-prose w-full rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src={post.cover}
                                        alt={post.title}
                                        className="w-full h-auto max-h-[500px] object-cover"
                                    />
                                </div>
                            )}

                            <div
                                className="mt-4 min-w-0 max-w-full overflow-x-clip text-slate-700 !text-base !leading-relaxed prose prose-slate [&_table]:min-w-max [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap"
                                dangerouslySetInnerHTML={{ __html: postContent }}
                            />
                        </article>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1 flex flex-col gap-4 h-fit sticky top-48">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-4">
                                <h3 className="relative font-bold text-[12px] text-slate-800 pb-2 border-b border-slate-100">
                                    <span className="absolute left-0 bottom-[-1px] w-8 h-[2px] bg-primary"></span>
                                    {t("pages.news.blog.related_posts", "Other Articles")}
                                </h3>
                                <div className="flex flex-col">
                                    {relatedPosts.length > 0 ? (
                                        relatedPosts.map((rPost) => (
                                            <Link
                                                key={rPost.permalink}
                                                to={rPost.permalink}
                                                className="group flex flex-col gap-1 py-2 border-b border-slate-100 last:border-0 transition-all"
                                            >
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {new Date(rPost.date).toISOString().split('T')[0]}
                                                </span>
                                                <p className="text-[12px] font-semibold text-slate-800 leading-normal group-hover:text-primary transition-colors">
                                                    {rPost.title}
                                                </p>
                                                {rPost.company && (
                                                    <span className="text-[11px] text-slate-500 font-normal mt-[-2px] ml-1">
                                                        {getCompanyName(rPost.company, currentLanguage)}
                                                    </span>
                                                )}
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-600 italic">{t("pages.news.blog.no_related")}</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </aside>
                </div>
            </div>

            <div className="fixed bottom-6 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2 sm:right-6 sm:max-w-none">
                <Link
                    to={backLink}
                    className="group flex max-w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:text-blue-600 hover:shadow-float"
                >
                    <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" />
                    <span className="truncate">{t("pages.news.blog.back_to_catalog", "返回新闻")}</span>
                </Link>
            </div>
        </section>
    )
}
