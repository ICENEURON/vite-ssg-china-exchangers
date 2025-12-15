import { posts } from '.velite'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Head } from 'vite-react-ssg'
import { useCurrentLanguage, addLanguageToPath } from '../../utils/language-routing'
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export default function BlogPost() {
    const { t } = useTranslation("translation");
    const location = useLocation();
    const siteUrl = import.meta.env.VITE_SITE_URL;
    const currentUrl = new URL(location.pathname, siteUrl).href;

    const { slug } = useParams()
    const currentLanguage = useCurrentLanguage();

    // Filter posts by language and sort by date (newest first)
    const sortedPosts = posts
        .filter(post => post.lang === currentLanguage)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const currentIndex = sortedPosts.findIndex(p => p.slug === slug);
    const post = sortedPosts[currentIndex];

    // Previous Post (Older)
    const prevPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
    // Next Post (Newer)
    const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;

    // Back link should respect current language
    const backLink = addLanguageToPath('/industry-news', currentLanguage);

    if (!post) return (
        <div className="container py-16 mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">{t("pages.news.blog.not_found")}</h1>
            <Button asChild>
                <Link to={backLink}>{t("pages.news.blog.back_to_list")}</Link>
            </Button>
        </div>
    )

    return (
        <div className="container max-w-5xl py-16 mx-auto px-4">
            <Head>
                <title>{post.metaTitle || post.title}</title>
                <link rel="canonical" href={currentUrl} />
                <meta name="title" content={post.metaTitle || post.title} />
                <meta name="description" content={post.metaDescription || post.excerpt || post.title} />
                {post.keywords && <meta name="keywords" content={post.keywords.join(', ')} />}
            </Head>
            <div className="mb-8">
                <Button variant="nonbackground" asChild className="pl-0 hover:text-primary">
                    <Link to={backLink} className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        {t("pages.news.blog.back_to_list")}
                    </Link>
                </Button>
            </div>

            <article className="prose lg:prose-xl max-w-none">
                <div className="not-prose border-b border-border pb-6 mb-6">
                    <div className="flex flex-col items-start text-sm text-muted">
                        <time dateTime={post.date}>
                            {new Date(post.date).toISOString().split('T')[0]}
                        </time>
                        <h2 className="font-extrabold tracking-tight mb-2">{post.title}</h2>
                        <div className="flex flex-wrap">
                            {post.author && (
                                <>
                                    <span>{t("pages.news.blog.author")}: {post.author}</span>
                                    <span className="mx-2">|</span>
                                </>
                            )}
                            {post.reviewer && (
                                <>
                                    <span>{t("pages.news.blog.reviewer")}: {post.reviewer}</span>
                                    <span className="mx-2">|</span>
                                </>
                            )}
                            {post.readTime && (
                                <>
                                    <span>{t("pages.news.blog.read_time")}: {post.readTime}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {post.cover && (
                    <div className="mb-0">
                        <img
                            src={post.cover}
                            alt={post.title}
                            className="w-full max-h-[350px] object-cover"
                        />
                    </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: post.content }} />

                <hr className="my-8 border-border" />

                <div className="flex justify-between items-center not-prose">
                    {nextPost ? (
                        <Button variant="default" asChild className="h-auto py-4 px-6 max-w-[45%]">
                            <Link to={nextPost.permalink} className="flex flex-row items-center gap-1">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <ArrowLeft className="w-3 h-3" />
                                </span>
                                <span className="text-sm font-semibold truncate w-full text-left max-w-[150px]">{nextPost.title}</span>
                            </Link>
                        </Button>
                    ) : <div />}

                    {prevPost && (
                        <Button variant="default" asChild className="h-auto py-4 px-6 max-w-[45%]">
                            <Link to={prevPost.permalink} className="flex flex-row items-center gap-1">
                                <span className="text-sm font-semibold truncate w-full text-right max-w-[150px]">{prevPost.title}</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <ArrowRight className="w-3 h-3" />
                                </span>
                            </Link>
                        </Button>
                    )}
                </div>
            </article>
        </div>
    )
}
