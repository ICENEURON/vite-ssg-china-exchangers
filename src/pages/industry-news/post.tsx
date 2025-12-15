import { posts } from '.velite'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
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

    // Find post that matches slug and current language
    const post = posts.find(p => p.slug === slug && p.lang === currentLanguage)

    // Back link should respect current language
    const backLink = addLanguageToPath('/industry-news', currentLanguage);

    if (!post) return (
        <div className="container py-20 mx-auto text-center">
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

            <article className="prose dark:prose-invert lg:prose-xl max-w-none">
                <div className="not-prose">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">{post.title}</h1>
                    <time className="text-muted block text-sm">
                        {new Date(post.date).toLocaleDateString('en-CA')}
                    </time>
                </div>
                {post.cover && (
                    <div>
                        <img
                            src={post.cover}
                            alt={post.title}
                            className="w-full max-h-[400px] object-cover"
                        />
                    </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
        </div>
    )
}
