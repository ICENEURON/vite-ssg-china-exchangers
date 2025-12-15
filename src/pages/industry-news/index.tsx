import { Head } from 'vite-react-ssg'
import { posts } from '.velite'
import { useCurrentLanguage } from '../../utils/language-routing'
import { NewsHero } from './components/NewsHero'
import { NewsList } from './components/NewsList'

export default function BlogsPage() {
    const currentLanguage = useCurrentLanguage();

    // Filter posts by language and sort by date (newest first)
    const filteredPosts = posts
        .filter(post => post.lang === currentLanguage)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // First post is featured
    const featuredPost = filteredPosts[0];
    // Rest are list items
    const listPosts = filteredPosts.slice(1);

    return (
        <>
            <Head>
                <title>Industry Insights - China Exchangers</title>
                <meta name="description" content="Latest market trends, logistics updates, and technical guides for the heat exchanger industry." />
            </Head>

            {/* Hero Section + News List Layout */}
            <section className="py-12 px-4 min-h-screen">
                <div className="container mx-auto max-w-5xl space-y-10">

                    <div className="grid gap-2 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Industry Insights</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400">Latest market trends, logistics updates, and technical guides for the heat exchanger industry.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-3 space-y-8">
                            <NewsHero post={featuredPost} />

                            {listPosts.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-50 flex items-center gap-2">
                                        <span className="w-1 h-8 bg-primary rounded-full inline-block"></span>
                                        Latest Updates
                                    </h2>
                                    <NewsList posts={listPosts} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
