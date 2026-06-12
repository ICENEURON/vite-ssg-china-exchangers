
import type { Post } from ".velite";
import { NewsCard } from "./NewsCard";

interface NewsListProps {
    posts: Post[];
    articleSearch?: string;
}

export function NewsList({ posts, articleSearch = "" }: NewsListProps) {
    return (
        <div className="flex flex-col gap-2">
            {posts.map((post) => (
                <NewsCard
                    key={post.permalink}
                    post={post}
                    articleSearch={articleSearch}
                />
            ))}
        </div>
    );
}
