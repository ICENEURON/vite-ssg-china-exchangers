import { Head } from 'vite-react-ssg'
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { posts } from '.velite'
import { useCurrentLanguage } from '../../utils/language-routing'
import { NewsHero } from './components/NewsHero'
import { NewsList } from './components/NewsList'
import { useState, useEffect } from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../components/ui/pagination"
import { Input } from "../../components/ui/input"

export default function BlogsPage() {
    const { t } = useTranslation("translation");
    const location = useLocation();
    const siteUrl = import.meta.env.VITE_SITE_URL;
    const siteName = import.meta.env.VITE_SITE_TITLE;
    const currentUrl = new URL(location.pathname, siteUrl).href;

    const currentLanguage = useCurrentLanguage();

    // Filter posts by language and sort by date (newest first)
    const filteredPosts = posts
        .filter(post => post.lang === currentLanguage)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // First post is featured
    const featuredPost = filteredPosts[0];
    // Rest are list items
    const listPosts = filteredPosts.slice(1);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(listPosts.length / itemsPerPage);
    const paginatedPosts = listPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    return (
        <>
            <Head>
                <title>{t("pages.news.title")}</title>
                <link rel="canonical" href={currentUrl} />
                <meta name="title" content={t("pages.news.title")} />
                <meta name="description" content={t("pages.news.meta.description")} />
                <meta name="keywords" content={t("pages.news.meta.keywords")} />
                <meta property="og:title" content={t("pages.news.og.title")} />
                <meta property="og:description" content={t("pages.news.og.description")} />
                <meta property="og:image" content={t("pages.news.og.image")} />
                <meta property="og:url" content={t("pages.news.og.url", { url: currentUrl })} />
                <meta property="og:type" content={t("pages.news.og.type")} />
                <meta property="og:site_name" content={t("pages.news.og.site_name", { site_name: siteName })} />
            </Head>

            {/* Hero Section + News List Layout */}
            <section className="py-16 px-4 min-h-screen">
                <div className="container mx-auto max-w-5xl space-y-8">
                    <div className="grid gap-2 text-center md:text-left">
                        <h1 className="tracking-tight text-foreground">{t("pages.news.page.title")}</h1>
                        <p className="text-muted">{t("pages.news.page.subtitle")}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-3 space-y-8">
                            <NewsHero post={featuredPost} />
                            {listPosts.length > 0 && (
                                <div>
                                    <div className="mt-12 mb-4 flex flex-row justify-between items-center">
                                        <h2 className="text-foreground flex items-center gap-2">
                                            <span className="w-1 h-8 bg-primary inline-block"></span>
                                            {t("pages.news.page.latest")}
                                        </h2>

                                        {totalPages > 1 && (
                                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                                {/* Center: Pagination */}
                                                <Pagination className="w-auto mx-0 order-1 md:order-2">
                                                    <PaginationContent>
                                                        <PaginationItem>
                                                            <PaginationPrevious
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (currentPage > 1) setCurrentPage(p => p - 1);
                                                                }}
                                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                                            />
                                                        </PaginationItem>
                                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                                            return (
                                                                <PaginationItem key={page}>
                                                                    <PaginationLink
                                                                        href="#"
                                                                        isActive={currentPage === page}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            setCurrentPage(page);
                                                                        }}
                                                                    >
                                                                        {page}
                                                                    </PaginationLink>
                                                                </PaginationItem>
                                                            )
                                                        })}
                                                        <PaginationItem>
                                                            <PaginationNext
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (currentPage < totalPages) setCurrentPage(p => p + 1);
                                                                }}
                                                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                                            />
                                                        </PaginationItem>
                                                    </PaginationContent>
                                                </Pagination>
                                            </div>
                                        )}
                                    </div>

                                    <NewsList posts={paginatedPosts} />

                                    {totalPages > 1 && (
                                        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                                            {/* Left: Results Count */}
                                            <div className="text-sm text-muted whitespace-nowrap order-2 md:order-1">
                                                {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, listPosts.length)} {t("pages.news.pagination.of")} {listPosts.length} {t("pages.news.pagination.results")}
                                            </div>

                                            {/* Center: Pagination */}
                                            <Pagination className="w-auto mx-0 order-1 md:order-2">
                                                <PaginationContent>
                                                    <PaginationItem>
                                                        <PaginationPrevious
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                if (currentPage > 1) setCurrentPage(p => p - 1);
                                                            }}
                                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                                        />
                                                    </PaginationItem>
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                                        return (
                                                            <PaginationItem key={page}>
                                                                <PaginationLink
                                                                    href="#"
                                                                    isActive={currentPage === page}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setCurrentPage(page);
                                                                    }}
                                                                >
                                                                    {page}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        )
                                                    })}
                                                    <PaginationItem>
                                                        <PaginationNext
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                if (currentPage < totalPages) setCurrentPage(p => p + 1);
                                                            }}
                                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                                        />
                                                    </PaginationItem>
                                                </PaginationContent>
                                            </Pagination>

                                            {/* Right: Jump to Page */}
                                            <div className="hidden md:flex flex-row items-center gap-2 order-3 whitespace-nowrap">
                                                <span className="text-sm text-muted whitespace-nowrap">{t("pages.news.pagination.go_to")}</span>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={totalPages}
                                                    className="w-16 h-8"
                                                    placeholder={currentPage.toString()}
                                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                        if (e.key === 'Enter') {
                                                            const val = parseInt(e.currentTarget.value);
                                                            if (!isNaN(val) && val >= 1 && val <= totalPages) {
                                                                setCurrentPage(val);
                                                                e.currentTarget.value = '';
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
