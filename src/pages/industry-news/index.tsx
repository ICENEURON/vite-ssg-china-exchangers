import { Head } from 'vite-react-ssg'
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { posts } from '.velite'
import { useCurrentLanguage } from '../../utils/language-routing'
import { NewsHero } from './components/NewsHero'
import { NewsList } from './components/NewsList'
import { useMemo, useState, useEffect, useCallback } from 'react'
import { Factory, Newspaper, Search } from 'lucide-react'
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
    onClick,
    className,
}: {
    active: boolean;
    label: string;
    // 移除count
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onClick}
            className={cn(
                "flex w-full items-start justify-between gap-3 rounded-lg border border-border/60 bg-white px-3 py-2.5 text-left text-sm font-semibold text-foreground shadow-sm transition-all duration-300",
                active
                    ? "border-primary/35 bg-primary/[0.06] text-primary"
                    : "hover:border-primary/30 hover:bg-blue-50/60",
                className
            )}
        >
            <span className="min-w-0 flex-1 whitespace-normal break-words leading-5">{label}</span>
            {/* 移除数字显示 */}
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
    const [searchQuery, setSearchQuery] = useState('');
    const pageSubtitle = t("pages.news.page.subtitle");

    // Filter posts by language and sort by date (newest first)
    const languagePosts = useMemo(() => posts
        .filter(post => post.lang === currentLanguage)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [currentLanguage]);

    const searchKeywords = useMemo(() => searchQuery
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean), [searchQuery]);

    const titleMatchesSearch = useCallback((title: string) => {
        if (searchKeywords.length === 0) return true;

        const normalizedTitle = title.toLowerCase();
        return searchKeywords.every((keyword) => normalizedTitle.includes(keyword));
    }, [searchKeywords]);

    const contentTypeOptions = useMemo(() => {
        const getCount = (contentType: ContentTypeFilter) => languagePosts.filter((post) => {
            if (contentType !== 'all' && post.contentType !== contentType) return false;
            if (companyFilter !== 'all' && post.company !== companyFilter) return false;
            if (!titleMatchesSearch(post.title)) return false;
            return true;
        }).length;

        return [
            { value: 'all' as const, label: t('pages.news.filters.all'), count: getCount('all') },
            { value: 'news' as const, label: t('pages.news.content_types.news'), count: getCount('news') },
            { value: 'posts' as const, label: t('pages.news.content_types.posts'), count: getCount('posts') },
        ];
    }, [companyFilter, languagePosts, titleMatchesSearch, t]);

    const companyOptions = useMemo(() => {
        const companies = Array.from(new Set(languagePosts.map((post) => post.company).filter(Boolean) as string[]));
        const getCount = (company: CompanyFilter) => languagePosts.filter((post) => {
            if (contentTypeFilter !== 'all' && post.contentType !== contentTypeFilter) return false;
            if (company !== 'all' && post.company !== company) return false;
            if (!titleMatchesSearch(post.title)) return false;
            return true;
        }).length;

        const heatexDirectCompany = 'heatex-direct';
        const companyItems = companies
            .filter((company) => company !== heatexDirectCompany)
            .map((company) => ({
                value: company,
                label: formatCompanyLabel(company, currentLanguage),
                count: getCount(company),
            }))
            .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

        const heatexDirectOption = companies.includes(heatexDirectCompany)
            ? [{
                value: heatexDirectCompany,
                label: formatCompanyLabel(heatexDirectCompany, currentLanguage),
                count: getCount(heatexDirectCompany),
            }]
            : [];

        return [
            { value: 'all' as const, label: t('pages.news.filters.all'), count: getCount('all') },
            ...heatexDirectOption,
            ...companyItems,
        ];
    }, [contentTypeFilter, currentLanguage, languagePosts, titleMatchesSearch, t]);

    const filteredPosts = useMemo(() => languagePosts.filter((post) => {
        if (contentTypeFilter !== 'all' && post.contentType !== contentTypeFilter) return false;
        if (companyFilter !== 'all' && post.company !== companyFilter) return false;
        if (!titleMatchesSearch(post.title)) return false;
        return true;
    }), [companyFilter, contentTypeFilter, languagePosts, titleMatchesSearch]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const paginatedPosts = filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const featuredPost = paginatedPosts[0];
    const listPosts = paginatedPosts.slice(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [contentTypeFilter, companyFilter, searchQuery]);

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
                        {pageSubtitle && <p className="text-muted">{pageSubtitle}</p>}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8 items-start">
                        <aside className="space-y-6 lg:sticky lg:top-24">
                            <div>
                                <div className="space-y-2">
                                    {contentTypeOptions.map((option) => (
                                        <FilterButton
                                            key={option.value}
                                            active={contentTypeFilter === option.value}
                                            label={option.label}
                                            onClick={() => setContentTypeFilter(option.value)}
                                            className="min-w-0"
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
                                            onClick={() => setCompanyFilter(option.value)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </aside>

                        <div className="space-y-8 min-w-0">
                            <div className="relative hidden lg:block">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
                                <Input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder={t('pages.news.search.title_placeholder')}
                                    aria-label={t('pages.news.search.label')}
                                    className="h-11 rounded-lg border-border/60 bg-white pl-10 text-sm shadow-sm focus-visible:border-primary focus-visible:ring-primary/20"
                                />
                            </div>

                            {featuredPost ? (
                                <NewsHero post={featuredPost} />
                            ) : (
                                <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-border text-center text-muted">
                                    <Newspaper className="size-8 text-primary" />
                                    <p>{t('pages.news.filters.no_results')}</p>
                                </div>
                            )}
                            {paginatedPosts.length > 0 && (
                                <div>
                                    {listPosts.length > 0 && (
                                        <NewsList posts={listPosts} />
                                    )}

                                    {filteredPosts.length > 0 && (
                                        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border pt-6">

                                            {/* 移除结果数，仅保留分页 */}

                                            {/* Center: Pagination */}
                                            {totalPages > 1 && (
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
                                            )}
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
