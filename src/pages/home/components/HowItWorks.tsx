import { useTranslation } from "react-i18next";
import { ArrowRight, ClipboardList, MailCheck, Scale, Search } from "lucide-react";

export function HowItWorks() {
    const { t } = useTranslation("translation");

    const steps = t("pages.home.howItWorks.steps", { returnObjects: true }) as Array<{
        title: string;
        body: string;
    }>;

    const icons = [Search, ClipboardList, MailCheck, Scale];

    return (
        <section className="py-14 px-2 flex justify-center bg-background">
            <div className="container px-4 max-w-6xl flex flex-col items-center justify-center gap-8">
                <div className="text-center max-w-3xl">
                    <p className="text-sm font-semibold text-primary mb-3">
                        {t("pages.home.howItWorks.eyebrow")}
                    </p>
                    <h2 className="text-foreground text-center mb-4">
                        {t("pages.home.howItWorks.title")}
                    </h2>
                    <p className="text-muted leading-relaxed">
                        {t("pages.home.howItWorks.description")}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full justify-items-center">
                    {steps.map((step, index) => {
                        const Icon = icons[index] || ClipboardList;
                        return (
                            <div key={index} className="flex flex-col items-center justify-start text-center p-4 gap-4 w-full">
                                <div className="w-16 h-16 bg-white border-2 border-primary rounded-full flex items-center justify-center shadow-sm relative">
                                    <Icon className="h-7 w-7 text-primary" />
                                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
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
