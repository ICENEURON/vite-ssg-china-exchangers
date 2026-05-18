import { useTranslation } from "react-i18next";
import { FileText, Megaphone, Newspaper } from "lucide-react";

export function IndustryNewsFocus() {
    const { t } = useTranslation("translation");
    const pillars = t("pages.home.industryNews.pillars", { returnObjects: true }) as Array<{
        title: string;
        body: string;
    }>;
    const visiblePillars = pillars.slice(0, 2);
    const pillarIcons = [Megaphone, FileText];

    return (
        <section className="flex justify-center bg-slate-950 px-2 py-12 text-white">
            <div className="container flex max-w-6xl flex-col gap-7 px-4">
                <div className="max-w-3xl">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-orange-200">
                        <Newspaper className="size-4 text-orange-300" />
                        {t("pages.home.industryNews.eyebrow")}
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
                        {t("pages.home.industryNews.title")}
                    </h2>
                </div>

                <div className="grid grid-cols-1 divide-y divide-white/10 border-y border-white/10 md:grid-cols-2 md:divide-x md:divide-y-0">
                    {visiblePillars.map((pillar, index) => {
                        const Icon = pillarIcons[index] || Newspaper;

                        return (
                            <article key={pillar.title} className="grid gap-3 py-5 text-left md:px-5">
                                <h3 className="flex items-center gap-3 text-base font-bold leading-6 text-white md:text-lg">
                                    <Icon className="size-5 shrink-0 text-orange-300" />
                                    <span>{pillar.title}</span>
                                </h3>
                                <p className="text-sm leading-6 text-slate-300">{pillar.body}</p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}