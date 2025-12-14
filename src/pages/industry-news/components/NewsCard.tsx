
import { Badge } from "../../../components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { Post } from '.velite';
import { Link } from 'react-router-dom';

interface NewsCardProps {
    post: Post;
}

export function NewsCard({ post }: NewsCardProps) {
    return (
        <Link
            to={post.permalink}
            className="group flex flex-col sm:flex-row gap-6 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-300"
        >
            {/* Thumbnail Section */}
            <div className="w-full sm:w-48 aspect-video sm:aspect-[4/3] shrink-0 rounded-xl overflow-hidden relative shadow-sm">
                <img
                    src={post.cover}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Subtle sheen on hover */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-center flex-1 min-w-0 py-1">
                <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-[10px] h-5 px-2 font-medium bg-primary/10 text-primary border-primary/20">
                        NEWS
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium">
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-50 leading-tight mb-2 group-hover:text-primary transition-colors font-serif">
                    {post.title}
                </h3>

                {post.excerpt && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {post.excerpt}
                    </p>
                )}

                <div className="mt-auto flex items-center text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors">
                    Read Article
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}
