import { FileStack, Globe2, History, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BrandText } from "../../../components/ui/brand-text";

export function ProblemSection() {
    const { t } = useTranslation("translation");
    const descriptions = t("pages.about.advantages.descriptions", { returnObjects: true }) as string[];
    const featureItems = t("pages.about.advantages.items", { returnObjects: true }) as Array<{
        title: string;
        desc: string;
    }>;
    const featureIcons = [History, ShieldCheck, Globe2, FileStack];

    return (
        <section className="flex justify-center bg-slate-50 px-2 py-14">
            <div className="container max-w-6xl px-4">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:items-start">
                    <div className="max-w-xl lg:sticky lg:top-24">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            {t("pages.about.advantages.title")}
                        </h2>
                        <div className="mt-5 space-y-3 text-sm leading-7 text-muted md:text-base">
                            {descriptions.map((description) => (
                                <p key={description}>
                                    <BrandText text={description} />
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="grid overflow-hidden border border-slate-200 bg-white md:grid-cols-2">
                        {featureItems.map((item, index) => {
                            const Icon = featureIcons[index] || History;
                            const borderClassName = [
                                index > 0 ? "border-t" : "",
                                index === 1 ? "md:border-t-0 md:border-l" : "",
                                index === 2 ? "md:border-l-0" : "",
                                index === 3 ? "md:border-l" : "",
                            ].join(" ");

                            return (
                                <article
                                    key={item.title}
                                    className={`group min-h-48 border-slate-200 p-5 text-left transition-colors duration-200 hover:bg-slate-50 ${borderClassName}`}
                                >
                                    <div className="flex items-center gap-3 text-foreground">
                                        <Icon className="size-5 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-0.5" />
                                        <h4 className="text-base font-bold leading-6 md:text-lg">
                                            {item.title}
                                        </h4>
                                    </div>
                                    <p className="mt-4 text-sm leading-7 text-muted">
                                        {item.desc}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
