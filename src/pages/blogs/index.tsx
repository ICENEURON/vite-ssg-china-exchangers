import { Head } from 'vite-react-ssg'
import { posts } from '.velite'
import { Link } from 'react-router-dom'
import { useCurrentLanguage } from '../../utils/language-routing'

export default function BlogsPage() {
    const currentLanguage = useCurrentLanguage();

    // Filter posts by language
    const filteredPosts = posts.filter(post => post.lang === currentLanguage);

    return (
        <>
            <Head>
                <title>Blogs - Aussie Penny Stocks</title>
                <meta name="description" content="Latest updates and articles." />
            </Head>

            {/* Hero Section */}
            <section className="py-12 px-4">
                <div className="grid text-center gap-6 mx-auto max-w-5xl">
                    <h1 className="gradient-text mb-4 text-4xl md:text-5xl font-bold">Blogs</h1>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="grid gap-6">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map(post => (
                                <div key={post.slug} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col lg:flex-row h-full bg-card">
                                    {post.cover && (
                                        <div className="w-full h-48 lg:w-72 lg:h-auto overflow-hidden border-b lg:border-b-0 lg:border-r shrink-0">
                                            <img
                                                src={post.cover}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="font-semibold mb-3 text-xl leading-tight">
                                            <Link to={post.permalink} className="hover:underline hover:text-primary transition-colors">
                                                {post.title}
                                            </Link>
                                        </h3>
                                        <div className="text-muted-foreground text-xs mb-3">
                                            {new Date(post.date).toLocaleDateString('en-CA')}
                                        </div>
                                        <div className="text-muted-foreground text-sm line-clamp-3">
                                            {post.excerpt && (
                                                <p>{post.excerpt}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground">
                                No posts found for this language.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
