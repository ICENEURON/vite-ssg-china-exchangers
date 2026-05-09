import { useTranslation } from "react-i18next";
import { Newspaper } from "lucide-react";

export function IndustryNewsFocus() {
    const { t } = useTranslation("translation");
    const pillars = t("pages.home.industryNews.pillars", { returnObjects: true }) as Array<{
        title: string;
        body: string;
    }>;
    const visiblePillars = pillars.slice(0, 2);

    return (
        <section className="py-14 px-2 flex justify-center bg-gray-900 text-white">
            <div className="container px-4 max-w-6xl flex flex-col gap-8">
                <div className="grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr] gap-8 items-start">
                    <div className="flex flex-col gap-4">
                        <p className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-orange-200">
                            <Newspaper className="h-4 w-4 text-orange-300" />
                            {t("pages.home.industryNews.eyebrow")}
                        </p>
                        <h2 className="text-white text-3xl md:text-4xl font-bold">
                            {t("pages.home.industryNews.title")}
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            {t("pages.home.industryNews.description")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 divide-y divide-white/15 border-y border-white/15">
                        {visiblePillars.map((pillar) => (
                            <article key={pillar.title} className="py-5 md:px-5">
                                <h3 className="mb-2 text-lg font-bold text-white">{pillar.title}</h3>
                                <p className="text-sm text-gray-300 leading-relaxed">{pillar.body}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}