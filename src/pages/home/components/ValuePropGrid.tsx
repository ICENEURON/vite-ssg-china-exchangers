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
        <section className="py-10 px-2 flex justify-center">
            <div className="container px-4 max-w-6xl flex flex-col items-center justify-center gap-4">
                <div className="text-center p-4">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">
                        {t("pages.home.valueProp.title")}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full justify-items-center relative">
                    {cards.map((card, index) => {
                        const Icon = icons[index] || Search;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col items-center justify-center text-center w-full"
                            >
                                {/* Numbering */}
                                <div className="text-6xl font-black text-gray-300/40 absolute top-4 right-4 transition-colors group-hover:text-accent/30 select-none pointer-events-none">
                                    0{index + 1}
                                </div>

                                <div className="flex flex-col items-center justify-center gap-4 z-10">
                                    {/* Icon */}
                                    <div className="h-14 w-14 rounded-lg bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                        <Icon className="h-7 w-7" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col items-center justify-center gap-2 p-2">
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
