import { useTranslation } from "react-i18next";
import { Search, EyeOff, LayoutList, FileText } from "lucide-react";

export function ValuePropGrid() {
    const { t } = useTranslation("translation");

    const cards = t("pages.home.valueProp.cards", { returnObjects: true }) as Array<{
        title: string;
        body: string;
    }>;

    const icons = [Search, EyeOff, LayoutList, FileText];

    return (
        <section className="pt-16">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">
                        {t("pages.home.valueProp.title")}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 relative">
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-200 dark:via-blue-900 to-transparent"></div>
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-900 to-transparent"></div>

                    {cards.map((card, index) => {
                        const Icon = icons[index] || Search;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white p-8 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 z-10 overflow-hidden"
                            >
                                <div className="relative flex flex-col items-start gap-4">
                                    {/* Numbering */}
                                    <div className="text-6xl font-black text-gray-300 absolute -top-4 -right-4 transition-colors group-hover:text-accent/40 select-none pointer-events-none">
                                        0{index + 1}
                                    </div>

                                    {/* Icon */}
                                    <div className="h-14 w-14 rounded-lg bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                        <Icon className="h-7 w-7" />
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2 mt-2">
                                        <h4 className="font-bold group-hover:text-accent transition-colors">
                                            {card.title}
                                        </h4>
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
