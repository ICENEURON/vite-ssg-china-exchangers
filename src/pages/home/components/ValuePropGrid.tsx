import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
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
                    <h2 className="font-bold text-foreground">
                        {t("pages.home.valueProp.title")}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map((card, index) => {
                        const Icon = icons[index] || Search;
                        return (
                            <Card key={index} className="border-border shadow-sm hover:shadow-lg transition-shadow duration-200">
                                <CardHeader className="flex flex-row items-center gap-3">
                                    <Icon className="h-6 w-6 text-accent" />
                                    <CardTitle className="text-2xl font-bold text-accent mb-0">
                                        {card.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-foreground leading-relaxed">
                                        {card.body}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
