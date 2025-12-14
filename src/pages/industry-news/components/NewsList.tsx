
import type { Post } from ".velite";
import { NewsCard } from "./NewsCard";

interface NewsListProps {
    posts: Post[];
}

export function NewsList({ posts }: NewsListProps) {
    return (
        <div className="flex flex-col gap-6">
            {posts.map((post) => (
                <NewsCard
                    key={post.slug}
                    post={post}
                />
            ))}
        </div>
    );
}
