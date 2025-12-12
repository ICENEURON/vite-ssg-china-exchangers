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
                                <div key={post.slug} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <h2 className="font-semibold mb-4">
                                        <Link to={post.permalink} className="hover:underline">{post.title}</Link>
                                    </h2>
                                    <div className="text-muted-foreground text-sm mb-4">
                                        {new Date(post.date).toLocaleDateString()}
                                    </div>
                                    <div className="text-muted-foreground text-sm mb-4">
                                        {post.excerpt && (
                                            <p className="text-muted-foreground">{post.excerpt}</p>
                                        )}
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
