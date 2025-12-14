
import { Badge } from "../../../components/ui/badge";
import type { Post } from ".velite";
import { Link } from "react-router-dom";

interface NewsHeroProps {
    post: Post;
}

export function NewsHero({ post }: NewsHeroProps) {
    return (
        <div className="relative w-full overflow-hidden rounded-xl bg-slate-950 text-white shadow-xl group">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                    backgroundImage: post.cover ? `url(${post.cover})` : `radial-gradient(circle at 10% 20%, rgba(20, 20, 35, 0.9) 0%, rgba(15, 23, 42, 0) 90%), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    filter: 'brightness(0.6)'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            <div className="relative z-10 flex flex-col justify-end p-8 md:p-12 lg:h-[400px]">
                <div className="space-y-4 max-w-3xl">
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                            News
                        </Badge>
                        <span className="text-sm text-slate-300 font-medium">
                            {new Date(post.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                    </div>

                    <Link to={post.permalink} className="hover:underline decoration-emerald-400 underline-offset-4">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-serif">
                            {post.title}
                        </h1>
                    </Link>

                    {post.excerpt && (
                        <p className="text-lg text-slate-300 md:w-3/4 leading-relaxed line-clamp-2">
                            {post.excerpt}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
