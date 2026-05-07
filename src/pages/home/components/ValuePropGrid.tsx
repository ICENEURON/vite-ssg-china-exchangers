import { useTranslation } from "react-i18next";
import { FileText, LayoutList, Search, ShieldCheck } from "lucide-react";

export function ValuePropGrid() {
    const { t } = useTranslation("translation");

    const cards = t("pages.home.valueProp.cards", { returnObjects: true }) as Array<{
        title: string;
        body: string;
    }>;

    const icons = [ShieldCheck, Search, LayoutList, FileText];

    return (
        <section className="py-14 px-2 flex justify-center bg-background">
            <div className="container px-4 max-w-6xl flex flex-col items-center justify-center gap-8">
                <div className="text-center p-4 max-w-3xl">
                    <p className="text-sm font-semibold text-primary mb-3">
                        {t("pages.home.valueProp.eyebrow")}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        {t("pages.home.valueProp.title")}
                    </h2>
                    <p className="text-muted leading-relaxed mt-4">
                        {t("pages.home.valueProp.description")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full relative">
                    {cards.map((card, index) => {
                        const Icon = icons[index] || Search;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white p-6 rounded-lg border border-border/30 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col items-start justify-start text-left w-full min-h-56"
                            >
                                <div className="flex flex-col items-start justify-start gap-4 z-10">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <Icon className="h-6 w-6" />
                                    </div>

                                    <div className="flex flex-col items-start justify-start gap-2">
                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                            {card.title}
                                        </h3>
                                        <p className="text-muted leading-relaxed text-sm">
                                            {card.body}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
