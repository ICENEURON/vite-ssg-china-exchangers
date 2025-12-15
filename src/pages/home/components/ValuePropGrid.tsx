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
        <section className="pt-16 bg-slate-50 dark:bg-slate-950/50">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">
                        {t("pages.home.valueProp.title")}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    {/* Central Connector Line (Decorative) */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-200 dark:via-blue-900 to-transparent hidden md:block"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-900 to-transparent hidden md:block"></div>

                    {cards.map((card, index) => {
                        const Icon = icons[index] || Search;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800 z-10 overflow-hidden"
                            >
                                {/* Technical Corner Markers */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Background Tech Pattern */}
                                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] group-hover:opacity-[0.06] transition-opacity"></div>

                                <div className="relative flex flex-col items-start gap-4">
                                    {/* Numbering */}
                                    <div className="text-6xl font-black text-slate-100 dark:text-slate-800 absolute -top-4 -right-4 transition-colors group-hover:text-blue-50 dark:group-hover:text-blue-900/20 select-none pointer-events-none">
                                        0{index + 1}
                                    </div>

                                    {/* Icon */}
                                    <div className="h-14 w-14 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                        <Icon className="h-7 w-7" />
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2 mt-2">
                                        <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                                            {card.title}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
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
