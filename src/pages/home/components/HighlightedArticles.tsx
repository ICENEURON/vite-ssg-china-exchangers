import { ArrowRight, Newspaper } from "lucide-react";
import { useTranslation } from "react-i18next";
import { posts } from ".velite";
import type { Post } from ".velite";
import highlightedArticles from "../../../data/highlighted-articles.json";
import { addLanguageToPath, useCurrentLanguage } from "../../../utils/language-routing";

type LocalizedText = Record<string, string>;

type HighlightedArticle = {
    priority: number;
    companyId?: string;
    companySlug: string;
    companyName: LocalizedText;
    contentType: string;
    articleSlug: string;
    articleTitle: LocalizedText;
    shortDescription: LocalizedText;
    paths?: Record<string, string>;
};

function getLocalizedValue(value: LocalizedText, language: string) {
    return value[language] || value.en || Object.values(value)[0] || "";
}

function isHeatExDirectArticle(item: HighlightedArticle) {
    const ownSlug = "heatex-direct";
    const companyNames = Object.values(item.companyName || {}).map((name) => name.toLowerCase());
    const paths = Object.values(item.paths || {});

    return (
        item.companySlug === ownSlug ||
        item.companyId === ownSlug ||
        companyNames.includes("heatex direct") ||
        paths.some((path) => path.includes(`news/${ownSlug}/`))
    );
}

export function HighlightedArticles() {
    const { t } = useTranslation("translation");
    const currentLanguage = useCurrentLanguage();
    const language = currentLanguage;
    const industryNewsPath = addLanguageToPath("/industry-news", currentLanguage);
    const typeLabels = t("pages.home.highlightedArticles.typeLabels", { returnObjects: true }) as Record<string, string>;
    const items = [...(highlightedArticles.items as HighlightedArticle[])]
        .filter((item) => !isHeatExDirectArticle(item))
        .sort((a, b) => a.priority - b.priority);
    const postsByKey = new Map(
        (posts as Post[]).map((post) => [
            `${post.contentType || "posts"}:${post.slug}:${post.lang || "en"}`,
            post,
        ])
    );

    return (
        <section className="flex justify-center bg-slate-50 px-2 py-14">
            <div className="container flex max-w-6xl flex-col gap-8 px-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                            <Newspaper className="size-4" />
                            {t("pages.home.highlightedArticles.eyebrow")}
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            {t("pages.home.highlightedArticles.title")}
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-muted md:text-base">
                            {t("pages.home.highlightedArticles.description")}
                        </p>
                    </div>
                    <a
                        href={industryNewsPath}
                        className="inline-flex h-10 w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-sm border border-primary/20 px-4 text-sm font-semibold text-primary transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary-hover"
                    >
                        {t("pages.home.highlightedArticles.cta")}
                        <ArrowRight className="size-4 shrink-0" />
                    </a>
                </div>

                <div className="divide-y divide-slate-200 border-y border-slate-200">
                    {items.map((item) => {
                        const post =
                            postsByKey.get(`${item.contentType}:${item.articleSlug}:${language}`) ||
                            postsByKey.get(`${item.contentType}:${item.articleSlug}:en`);
                        const articlePath = post?.permalink || addLanguageToPath(`/industry-news/${item.contentType}/${item.articleSlug}`, currentLanguage);
                        const companyPath = addLanguageToPath(`/manufacturers/${item.companySlug}`, currentLanguage);
                        const cover = post?.cover || "/static/websites/home-hero.png";
                        const articleTitle = getLocalizedValue(item.articleTitle, language);
                        const companyName = getLocalizedValue(item.companyName, language);
                        const shortDescription = getLocalizedValue(item.shortDescription, language);

                        return (
                            <article key={`${item.contentType}-${item.articleSlug}`} className="grid gap-3 py-4 transition-colors duration-200 hover:bg-white md:grid-cols-[12rem_minmax(0,1fr)] md:items-start md:gap-4 md:py-5 md:px-3">
                                <a href={articlePath} className="group/image hidden aspect-[4/3] overflow-hidden rounded-sm bg-slate-100 md:block">
                                    <img
                                        src={cover}
                                        alt={articleTitle}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                                    />
                                </a>
                                <div>
                                    <div className="mb-2 text-sm font-semibold text-primary">
                                        {typeLabels[item.contentType] || item.contentType}
                                    </div>
                                    <h3 className="text-lg font-bold leading-7 text-foreground">
                                        <a href={articlePath} className="underline-offset-4 transition-colors duration-200 hover:text-primary hover:underline">
                                            {articleTitle}
                                        </a>
                                    </h3>
                                    <a href={companyPath} className="mt-2 block text-sm font-semibold text-slate-600 underline-offset-4 transition-colors duration-200 hover:text-primary hover:underline">
                                        {companyName}
                                    </a>
                                    <p className="mt-3 text-sm leading-6 text-muted">{shortDescription}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
