import { useTranslation } from "react-i18next";
import { ArrowRight, ClipboardList, EyeOff, Radio, Scale } from "lucide-react";

export function HowItWorks() {
    const { t } = useTranslation("translation");

    const steps = t("pages.home.howItWorks.steps", { returnObjects: true }) as Array<{
        title: string;
        body: string;
    }>;

    const icons = [ClipboardList, EyeOff, Radio, Scale];

    return (
        <section className="py-16">
            <div className="container mx-auto px-4 max-w-6xl">
                <h2 className="text-foreground text-center mb-16">
                    {t("pages.home.howItWorks.title")}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
                    {steps.map((step, index) => {
                        const Icon = icons[index] || ClipboardList;
                        return (
                            <div key={index} className="flex flex-col items-center text-center relative">
                                <div className="w-16 h-16 bg-white border-2 border-accent rounded-full flex items-center justify-center mb-6 z-10 shadow-sm relative">
                                    <Icon className="h-7 w-7 text-accent" />
                                    <div className="absolute -top-2 -right-2 bg-destructive text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                        {index + 1}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-foreground mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed px-2">
                                    {step.body}
                                </p>

                                {/* Arrow for Mobile */}
                                {index < steps.length - 1 && (
                                    <ArrowRight className="md:hidden h-6 w-6 text-muted-foreground mt-6 rotate-90" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
