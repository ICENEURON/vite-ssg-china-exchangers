
import { Badge } from "../../../components/ui/badge";
import type { Post } from ".velite";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface NewsHeroProps {
    post: Post;
}

export function NewsHero({ post }: NewsHeroProps) {
    const { t } = useTranslation("translation");
    const contentType = post.contentType || "posts";
    const contentTypeLabel = t(`pages.news.content_types.${contentType}`, {
        defaultValue: contentType,
    });

    return (
        <div className="relative w-full overflow-hidden rounded-sm text-white shadow-xl group">
            {/* Background Image */}
            <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ${post.cover ? "" : "news-hero-fallback"}`}
                style={{
                    backgroundImage: post.cover ? `url(${post.cover})` : undefined,
                    filter: 'brightness(0.6)'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t via-slate-950/60 to-transparent" />

            <div className="relative z-10 flex flex-col justify-end p-8 md:p-12 lg:h-[400px]">
                <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground font-medium">
                            {new Date(post.date).toISOString().split('T')[0]}
                        </span>
                        <Badge variant="secondary" className="bg-blue-200/80 text-accent border-blue-400/50 hover:bg-blue-200">
                            {contentTypeLabel}
                        </Badge>
                    </div>

                    <Link to={post.permalink} className="hover:text-accent hover:underline decoration-accent underline-offset-2">
                        <h1 className="font-bold tracking-tight text-white leading-tight">
                            {post.title}
                        </h1>
                    </Link>

                    {post.excerpt && (
                        <p className="mt-4 text-lg text-muted-foreground md:w-3/4 leading-relaxed line-clamp-3">
                            {post.excerpt}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
