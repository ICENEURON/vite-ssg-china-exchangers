import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SeoHead } from '../../components/seo/SeoHead'
import { posts } from '.velite'
import { useCurrentLanguage } from '../../utils/language-routing'
import { NewsHero } from './components/NewsHero'
import { NewsList } from './components/NewsList'
import { useMemo, useEffect, useCallback } from 'react'
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
import {
    buildIndustryNewsSearch,
    filterIndustryNewsPosts,
    parseIndustryNewsFilters,
    type CompanyFilter,
    type ContentTypeFilter,
    type IndustryNewsFilters,
} from './filter-state'

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

function FilterLink({
    active,
    href,
    label,
    className,
}: {
    active: boolean;
    href: string;
    label: string;
    className?: string;
}) {
    return (
        <Link
            to={href}
            aria-current={active ? "true" : undefined}
            className={cn(
                "flex w-full items-start justify-between gap-3 rounded-sm border border-border/60 bg-white px-3 py-2.5 text-left text-sm font-semibold text-foreground shadow-sm transition-all duration-300",
                active
                    ? "border-primary/35 bg-primary/[0.06] text-primary"
                    : "hover:border-primary/30 hover:bg-blue-50/60",
                className
            )}
        >
            <span className="min-w-0 flex-1 whitespace-normal break-words leading-5">{label}</span>
        </Link>
    );
}

export default function BlogsPage() {
    const { t } = useTranslation("translation");
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const siteUrl = import.meta.env.VITE_SITE_URL || "https://heatexdirect.com";
    const siteName = import.meta.env.VITE_SITE_TITLE || "HeatEx Direct";
    const currentUrl = new URL(location.pathname, siteUrl).href;

    const currentLanguage = useCurrentLanguage();
    const filters = useMemo(() => parseIndustryNewsFilters(searchParams), [searchParams]);
    const { contentTypeFilter, companyFilter, searchQuery } = filters;
    const pageSubtitle = t("pages.news.page.subtitle");

    const updateFilters = useCallback((
        nextFilters: Partial<IndustryNewsFilters>,
        options: { replace?: boolean; resetPage?: boolean } = {},
    ) => {
        const shouldResetPage = options.resetPage ?? (
            nextFilters.contentTypeFilter !== undefined ||
            nextFilters.companyFilter !== undefined ||
            nextFilters.searchQuery !== undefined
        );
        const mergedFilters: IndustryNewsFilters = {
            ...filters,
            ...nextFilters,
            page: shouldResetPage && nextFilters.page === undefined ? 1 : nextFilters.page ?? filters.page,
        };
        const nextSearch = buildIndustryNewsSearch(mergedFilters);

        setSearchParams(nextSearch.startsWith("?") ? nextSearch.slice(1) : nextSearch, {
            replace: options.replace ?? false,
        });
    }, [filters, setSearchParams]);

    const getFilterHref = useCallback((
        nextFilters: Partial<IndustryNewsFilters>,
        options: { resetPage?: boolean } = {},
    ) => {
        const shouldResetPage = options.resetPage ?? (
            nextFilters.contentTypeFilter !== undefined ||
            nextFilters.companyFilter !== undefined ||
            nextFilters.searchQuery !== undefined
        );
        const mergedFilters: IndustryNewsFilters = {
            ...filters,
            ...nextFilters,
            page: shouldResetPage && nextFilters.page === undefined ? 1 : nextFilters.page ?? filters.page,
        };

        return `${location.pathname}${buildIndustryNewsSearch(mergedFilters)}`;
    }, [filters, location.pathname]);

    // Filter posts by language and sort by date (newest first)
    const languagePosts = useMemo(() => posts
        .filter(post => post.lang === currentLanguage)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [currentLanguage]);


    const contentTypeOptions = useMemo(() => {
        const getCount = (contentType: ContentTypeFilter) => filterIndustryNewsPosts(languagePosts, {
            ...filters,
            contentTypeFilter: contentType,
            page: 1,
        }).length;

        return [
            { value: 'all' as const, label: t('pages.news.filters.all'), count: getCount('all') },
            { value: 'news' as const, label: t('pages.news.content_types.news'), count: getCount('news') },
            { value: 'posts' as const, label: t('pages.news.content_types.posts'), count: getCount('posts') },
        ];
    }, [filters, languagePosts, t]);

    const companyOptions = useMemo(() => {
        const companies = Array.from(new Set(languagePosts.map((post) => post.company).filter(Boolean) as string[]));
        const getCount = (company: CompanyFilter) => filterIndustryNewsPosts(languagePosts, {
            ...filters,
            companyFilter: company,
            page: 1,
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
    }, [currentLanguage, filters, languagePosts, t]);

    const filteredPosts = useMemo(() => filterIndustryNewsPosts(languagePosts, filters), [filters, languagePosts]);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const currentPage = Math.min(filters.page, Math.max(totalPages, 1));
    const paginatedPosts = filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const featuredPost = paginatedPosts[0];
    const listPosts = paginatedPosts.slice(1);
    const articleSearch = buildIndustryNewsSearch({ ...filters, page: currentPage });
    const getPageHref = (page: number) => `${location.pathname}${buildIndustryNewsSearch({ ...filters, page })}`;

    useEffect(() => {
        const maxPage = Math.max(totalPages, 1);

        if (filters.page > maxPage) {
            updateFilters({ page: maxPage }, { replace: true, resetPage: false });
        }
    }, [filters.page, totalPages, updateFilters]);

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    return (
        <>
            <SeoHead
                title={t("pages.news.title")}
                description={t("pages.news.meta.description")}
                keywords={t("pages.news.meta.keywords")}
                canonicalUrl={currentUrl}
                ogTitle={t("pages.news.og.title")}
                ogDescription={t("pages.news.og.description")}
                siteName={siteName}
            />

            {/* Hero Section + News List Layout */}
            <section className="py-10 px-2 min-h-screen">
                <div className="container py-12 mx-auto max-w-6xl space-y-8">
                    <div className="grid gap-2 text-center md:text-left">
                        <h1 className="tracking-tight text-foreground">{t("pages.news.page.title")}</h1>
                        {pageSubtitle && <p className="text-muted">{pageSubtitle}</p>}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8 items-start">
                        <aside className="space-y-6">
                            <div>
                                <div className="space-y-2">
                                    {contentTypeOptions.map((option) => (
                                        <FilterLink
                                            key={option.value}
                                            active={contentTypeFilter === option.value}
                                            href={getFilterHref({ contentTypeFilter: option.value })}
                                            label={option.label}
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
                                        <FilterLink
                                            key={option.value}
                                            active={companyFilter === option.value}
                                            href={getFilterHref({ companyFilter: option.value })}
                                            label={option.label}
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
                                    onChange={(event) => updateFilters({ searchQuery: event.target.value }, { replace: true })}
                                    placeholder={t('pages.news.search.title_placeholder')}
                                    aria-label={t('pages.news.search.label')}
                                    className="h-11 rounded-sm border-border/60 bg-white pl-10 text-sm shadow-sm focus-visible:border-primary focus-visible:ring-primary/20"
                                />
                            </div>

                            {featuredPost ? (
                                <NewsHero post={featuredPost} articleSearch={articleSearch} />
                            ) : (
                                <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-border text-center text-muted">
                                    <Newspaper className="size-8 text-primary" />
                                    <p>{t('pages.news.filters.no_results')}</p>
                                </div>
                            )}
                            {paginatedPosts.length > 0 && (
                                <div>
                                    {listPosts.length > 0 && (
                                        <NewsList posts={listPosts} articleSearch={articleSearch} />
                                    )}

                                    {filteredPosts.length > 0 && (
                                        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border pt-6">
                                            {/* Center: Pagination */}
                                            {totalPages > 1 && (
                                                <Pagination className="w-auto mx-0 order-1 md:order-2">
                                                    <PaginationContent>
                                                        <PaginationItem>
                                                            <PaginationPrevious
                                                                href={currentPage > 1 ? getPageHref(currentPage - 1) : "#"}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (currentPage > 1) updateFilters({ page: currentPage - 1 }, { resetPage: false });
                                                                }}
                                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                                            />
                                                        </PaginationItem>
                                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                                            return (
                                                                <PaginationItem key={page}>
                                                                    <PaginationLink
                                                                        href={getPageHref(page)}
                                                                        isActive={currentPage === page}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            updateFilters({ page }, { resetPage: false });
                                                                        }}
                                                                    >
                                                                        {page}
                                                                    </PaginationLink>
                                                                </PaginationItem>
                                                            )
                                                        })}
                                                        <PaginationItem>
                                                            <PaginationNext
                                                                href={currentPage < totalPages ? getPageHref(currentPage + 1) : "#"}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (currentPage < totalPages) updateFilters({ page: currentPage + 1 }, { resetPage: false });
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
