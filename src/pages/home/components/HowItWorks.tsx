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
        <section className="py-10 px-2 flex justify-center">
            <div className="container px-4 max-w-6xl flex flex-col items-center justify-center gap-4">
                <h3 className="text-foreground text-center p-2 mb-4">
                    {t("pages.home.howItWorks.title")}
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full justify-items-center">
                    {steps.map((step, index) => {
                        const Icon = icons[index] || ClipboardList;
                        return (
                            <div key={index} className="flex flex-col items-center justify-center text-center p-4 gap-4">
                                <div className="w-16 h-16 bg-white border-2 border-accent rounded-full flex items-center justify-center shadow-sm relative">
                                    <Icon className="h-7 w-7 text-accent" />
                                    <div className="absolute -top-2 -right-2 bg-destructive text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                        {index + 1}
                                    </div>
                                </div>

                                <h4 className="text-lg font-bold text-foreground p-2">
                                    {step.title}
                                </h4>
                                <p className="text-sm text-muted leading-relaxed p-2">
                                    {step.body}
                                </p>

                                {/* Arrow for Mobile */}
                                {index < steps.length - 1 && (
                                    <ArrowRight className="block lg:hidden h-6 w-6 text-muted rotate-90" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
