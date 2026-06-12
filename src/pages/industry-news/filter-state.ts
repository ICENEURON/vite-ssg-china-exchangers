export type ContentTypeFilter = "all" | "news" | "posts";
export type CompanyFilter = "all" | string;

export interface IndustryNewsFilters {
    contentTypeFilter: ContentTypeFilter;
    companyFilter: CompanyFilter;
    searchQuery: string;
    page: number;
}

export interface IndustryNewsPostLike {
    title: string;
    contentType?: string;
    company?: string;
    permalink: string;
}

export const DEFAULT_INDUSTRY_NEWS_FILTERS: IndustryNewsFilters = {
    contentTypeFilter: "all",
    companyFilter: "all",
    searchQuery: "",
    page: 1,
};

const VALID_CONTENT_TYPES = new Set<ContentTypeFilter>(["all", "news", "posts"]);

function toSearchParams(search: string | URLSearchParams) {
    if (typeof search === "string") {
        return new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    }

    return search;
}

function parseContentType(value: string | null): ContentTypeFilter {
    return value && VALID_CONTENT_TYPES.has(value as ContentTypeFilter)
        ? value as ContentTypeFilter
        : DEFAULT_INDUSTRY_NEWS_FILTERS.contentTypeFilter;
}

function parsePage(value: string | null) {
    const page = Number.parseInt(value || "", 10);
    return Number.isFinite(page) && page > 0 ? page : DEFAULT_INDUSTRY_NEWS_FILTERS.page;
}

export function parseIndustryNewsFilters(search: string | URLSearchParams): IndustryNewsFilters {
    const params = toSearchParams(search);
    const company = (params.get("company") || "").trim();
    const searchQuery = (params.get("q") || "").trim();

    return {
        contentTypeFilter: parseContentType(params.get("type")),
        companyFilter: company && company !== "all" ? company : DEFAULT_INDUSTRY_NEWS_FILTERS.companyFilter,
        searchQuery,
        page: parsePage(params.get("page")),
    };
}

export function createIndustryNewsSearchParams(filters: IndustryNewsFilters) {
    const params = new URLSearchParams();
    const normalized = parseIndustryNewsFilters(createRawSearchParams(filters));

    if (normalized.contentTypeFilter !== "all") {
        params.set("type", normalized.contentTypeFilter);
    }

    if (normalized.companyFilter !== "all") {
        params.set("company", normalized.companyFilter);
    }

    if (normalized.searchQuery) {
        params.set("q", normalized.searchQuery);
    }

    if (normalized.page > 1) {
        params.set("page", String(normalized.page));
    }

    return params;
}

export function buildIndustryNewsSearch(filters: IndustryNewsFilters) {
    const search = createIndustryNewsSearchParams(filters).toString();
    return search ? `?${search}` : "";
}

export function filterIndustryNewsPosts<TPost extends IndustryNewsPostLike>(
    posts: TPost[],
    filters: IndustryNewsFilters,
) {
    const keywords = filters.searchQuery
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

    return posts.filter((post) => {
        if (filters.contentTypeFilter !== "all" && post.contentType !== filters.contentTypeFilter) return false;
        if (filters.companyFilter !== "all" && post.company !== filters.companyFilter) return false;

        if (keywords.length > 0) {
            const normalizedTitle = post.title.toLowerCase();
            if (!keywords.every((keyword) => normalizedTitle.includes(keyword))) return false;
        }

        return true;
    });
}

export function getAdjacentIndustryNewsPosts<TPost extends IndustryNewsPostLike>(
    posts: TPost[],
    currentPermalink: string,
    filters: IndustryNewsFilters,
) {
    const filteredPosts = filterIndustryNewsPosts(posts, filters);
    const currentIndex = filteredPosts.findIndex((post) => post.permalink === currentPermalink);

    return {
        previousPost: currentIndex > 0 ? filteredPosts[currentIndex - 1] : null,
        nextPost: currentIndex >= 0 && currentIndex < filteredPosts.length - 1 ? filteredPosts[currentIndex + 1] : null,
        currentIndex,
        totalPosts: filteredPosts.length,
    };
}

export function getIndustryNewsPageForPost<TPost extends IndustryNewsPostLike>(
    posts: TPost[],
    permalink: string,
    itemsPerPage: number,
) {
    const index = posts.findIndex((post) => post.permalink === permalink);
    return index >= 0 ? Math.floor(index / itemsPerPage) + 1 : 1;
}

function createRawSearchParams(filters: IndustryNewsFilters) {
    const params = new URLSearchParams();
    params.set("type", filters.contentTypeFilter);
    params.set("company", filters.companyFilter);
    params.set("q", filters.searchQuery);
    params.set("page", String(filters.page));
    return params;
}
