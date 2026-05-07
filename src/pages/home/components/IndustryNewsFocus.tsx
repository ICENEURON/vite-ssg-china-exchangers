import { useTranslation } from "react-i18next";
import { BookOpenCheck, ClipboardCheck, MapPinned, Newspaper, ShieldCheck } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { addLanguageToPath, useCurrentLanguage } from "../../../utils/language-routing";

export function IndustryNewsFocus() {
    const { t } = useTranslation("translation");
    const currentLanguage = useCurrentLanguage();
    const pillars = t("pages.home.industryNews.pillars", { returnObjects: true }) as Array<{
        title: string;
        body: string;
    }>;
    const enableBlog = import.meta.env.VITE_ENABLE_BLOG === "true";
    const icons = [BookOpenCheck, ShieldCheck, ClipboardCheck, MapPinned];
    const industryNewsPath = addLanguageToPath("/industry-news", currentLanguage);

    return (
        <section className="py-14 px-2 flex justify-center bg-gray-900 text-white">
            <div className="container px-4 max-w-6xl flex flex-col gap-8">
                <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start">
                    <div className="flex flex-col gap-4">
                        <p className="inline-flex w-fit items-center gap-2 rounded-sm border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-gray-100">
                            <Newspaper className="h-4 w-4 text-orange-300" />
                            {t("pages.home.industryNews.eyebrow")}
                        </p>
                        <h2 className="text-white text-3xl md:text-4xl font-bold">
                            {t("pages.home.industryNews.title")}
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            {t("pages.home.industryNews.description")}
                        </p>
                        {enableBlog && (
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button size="lg" variant="secondary" asChild>
                                    <a href={industryNewsPath}>{t("pages.home.industryNews.cta")}</a>
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pillars.map((pillar, index) => {
                            const Icon = icons[index] || BookOpenCheck;

                            return (
                                <article key={pillar.title} className="rounded-lg border border-white/10 bg-white/5 p-5">
                                    <Icon className="h-6 w-6 text-orange-300 mb-4" />
                                    <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
                                    <p className="text-sm text-gray-300 leading-relaxed">{pillar.body}</p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}