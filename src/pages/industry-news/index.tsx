import { Head } from 'vite-react-ssg'
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { posts } from '.velite'
import { useCurrentLanguage } from '../../utils/language-routing'
import { NewsHero } from './components/NewsHero'
import { NewsList } from './components/NewsList'
import { useMemo, useState, useEffect } from 'react'
import { Factory, Files, Newspaper } from 'lucide-react'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../components/ui/pagination"
import { Input } from "../../components/ui/input"
import { cn } from '../../utils/cn'
import manufacturersData from '../../data/manufacturers.json'

type ContentTypeFilter = 'all' | 'news' | 'posts';
type CompanyFilter = 'all' | string;

interface ManufacturerOption {
    slug: string;
    name: {
        en: string;
        zh: string;
    };
}

const manufacturerNameBySlug = new Map(
    (manufacturersData as ManufacturerOption[]).map((manufacturer) => [manufacturer.slug, manufacturer.name])
);

function formatCompanyLabel(company: string, language: string) {
    const manufacturerName = manufacturerNameBySlug.get(company);

    if (manufacturerName) {
        return language === 'zh' ? manufacturerName.zh : manufacturerName.en;
    }

    return company
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function FilterButton({
    active,
    label,
    count,
    onClick,
}: {
    active: boolean;
    label: string;
    count: number;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onClick}
            className={cn(
                "flex w-full items-center justify-between gap-3 rounded-sm border px-3 py-2 text-left text-sm transition-colors",
                active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-accent/50"
            )}
        >
            <span className="min-w-0 flex-1 truncate">{label}</span>
            <span className={cn("text-xs", active ? "text-primary-foreground/80" : "text-muted")}>{count}</span>
        </button>
    );
}

export default function BlogsPage() {
    const { t } = useTranslation("translation");
    const location = useLocation();
    const siteUrl = import.meta.env.VITE_SITE_URL;
    const siteName = import.meta.env.VITE_SITE_TITLE;
    const currentUrl = new URL(location.pathname, siteUrl).href;

    const currentLanguage = useCurrentLanguage();
    const [contentTypeFilter, setContentTypeFilter] = useState<ContentTypeFilter>('all');
    const [companyFilter, setCompanyFilter] = useState<CompanyFilter>('all');

    // Filter posts by language and sort by date (newest first)
    const languagePosts = useMemo(() => posts
        .filter(post => post.lang === currentLanguage)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [currentLanguage]);

    const contentTypeOptions = useMemo(() => {
        const getCount = (contentType: ContentTypeFilter) => languagePosts.filter((post) => {
            if (contentType !== 'all' && post.contentType !== contentType) return false;
            if (companyFilter !== 'all' && post.company !== companyFilter) return false;
            return true;
        }).length;

        return [
            { value: 'all' as const, label: t('pages.news.filters.all'), count: getCount('all') },
            { value: 'news' as const, label: t('pages.news.content_types.news'), count: getCount('news') },
            { value: 'posts' as const, label: t('pages.news.content_types.posts'), count: getCount('posts') },
        ];
    }, [companyFilter, languagePosts, t]);

    const companyOptions = useMemo(() => {
        const companies = Array.from(new Set(languagePosts.map((post) => post.company).filter(Boolean) as string[]));
        const getCount = (company: CompanyFilter) => languagePosts.filter((post) => {
            if (contentTypeFilter !== 'all' && post.contentType !== contentTypeFilter) return false;
            if (company !== 'all' && post.company !== company) return false;
            return true;
        }).length;

        return [
            { value: 'all' as const, label: t('pages.news.filters.all_companies'), count: getCount('all') },
            ...companies
                .map((company) => ({
                    value: company,
                    label: formatCompanyLabel(company, currentLanguage),
                    count: getCount(company),
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        ];
    }, [contentTypeFilter, currentLanguage, languagePosts, t]);

    const filteredPosts = useMemo(() => languagePosts.filter((post) => {
        if (contentTypeFilter !== 'all' && post.contentType !== contentTypeFilter) return false;
        if (companyFilter !== 'all' && post.company !== companyFilter) return false;
        return true;
    }), [companyFilter, contentTypeFilter, languagePosts]);

    // First post is featured
    const featuredPost = filteredPosts[0];
    // Rest are list items
    const listPosts = filteredPosts.slice(1);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(listPosts.length / itemsPerPage);
    const paginatedPosts = listPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [contentTypeFilter, companyFilter]);

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
            <section className="py-10 px-2 min-h-screen">
                <div className="container py-12 mx-auto max-w-6xl space-y-8">
                    <div className="grid gap-2 text-center md:text-left">
                        <h1 className="tracking-tight text-foreground">{t("pages.news.page.title")}</h1>
                        <p className="text-muted">{t("pages.news.page.subtitle")}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8 items-start">
                        <aside className="space-y-6 lg:sticky lg:top-24">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Files className="size-4 text-primary" />
                                    {t('pages.news.filters.content_type')}
                                </div>
                                <div className="space-y-2">
                                    {contentTypeOptions.map((option) => (
                                        <FilterButton
                                            key={option.value}
                                            active={contentTypeFilter === option.value}
                                            label={option.label}
                                            count={option.count}
                                            onClick={() => setContentTypeFilter(option.value)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Factory className="size-4 text-primary" />
                                    {t('pages.news.filters.company')}
                                </div>
                                <div className="space-y-2">
                                    {companyOptions.map((option) => (
                                        <FilterButton
                                            key={option.value}
                                            active={companyFilter === option.value}
                                            label={option.label}
                                            count={option.count}
                                            onClick={() => setCompanyFilter(option.value)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </aside>

                        <div className="space-y-8 min-w-0">
                            {featuredPost ? (
                                <NewsHero post={featuredPost} />
                            ) : (
                                <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-border text-center text-muted">
                                    <Newspaper className="size-8 text-primary" />
                                    <p>{t('pages.news.filters.no_results')}</p>
                                </div>
                            )}
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
