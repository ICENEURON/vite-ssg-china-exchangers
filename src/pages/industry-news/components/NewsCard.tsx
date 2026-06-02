
import { ArrowRight } from "lucide-react";
import type { Post } from '.velite';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

interface NewsCardProps {
    post: Post;
}

export function NewsCard({ post }: NewsCardProps) {
    const { t } = useTranslation("translation");
    const contentType = post.contentType || "posts";
    const contentTypeLabel = t(`pages.news.content_types.${contentType}`, {
        defaultValue: contentType,
    });

    return (
        <Link
            to={post.permalink}
            className="group flex flex-col sm:flex-row gap-6 p-4 rounded-sm hover:bg-slate-50 transition-all duration-300"
        >
            {/* Thumbnail Section: 仅sm及以上显�?*/}
            <div className="hidden sm:block w-40 aspect-[4/3] shrink-0 rounded-sm overflow-hidden relative shadow-sm">
                <img
                    src={post.cover}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-center flex-1 min-w-0 py-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm text-muted font-medium">
                        {new Date(post.date).toISOString().split('T')[0]}
                    </span>
                    <span className="rounded-sm bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {contentTypeLabel}
                    </span>
                </div>

                <h4 className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors font-serif">
                    {post.title}
                </h4>

                {post.excerpt && (
                    <p className="text-sm text-muted line-clamp-2 mb-4 leading-relaxed">
                        {post.excerpt}
                    </p>
                )}

                <div className="mt-auto flex items-center text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors">
                    {t("pages.news.card.read")}
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}
