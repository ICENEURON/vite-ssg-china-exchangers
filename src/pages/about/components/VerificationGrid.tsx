import { CheckCircle2, Search, FileCheck, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { useTranslation } from "react-i18next";

export function VerificationGrid() {
    const { t } = useTranslation("translation");

    const steps = [
        {
            icon: <FileCheck className="w-8 h-8 text-primary" />,
            title: t("pages.about.verification.steps.scope.title"),
            description: t("pages.about.verification.steps.scope.description"),
            value: t("pages.about.verification.steps.scope.value")
        },
        {
            icon: <Search className="w-8 h-8 text-primary" />,
            title: t("pages.about.verification.steps.database.title"),
            description: t("pages.about.verification.steps.database.description"),
            value: t("pages.about.verification.steps.database.value")
        },
        {
            icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
            title: t("pages.about.verification.steps.shipping.title"),
            description: t("pages.about.verification.steps.shipping.description"),
            value: t("pages.about.verification.steps.shipping.value")
        },
        {
            icon: <MapPin className="w-8 h-8 text-primary" />,
            title: t("pages.about.verification.steps.location.title"),
            description: t("pages.about.verification.steps.location.description"),
            value: t("pages.about.verification.steps.location.value")
        }
    ];

    return (
        <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-6">
                        {t("pages.about.verification.title")}
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400">
                        {t("pages.about.verification.description")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
                    {steps.map((step, index) => (
                        <Card key={index} className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 group relative overflow-hidden">
                            {/* Hover Accent */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        {step.icon}
                                    </div>
                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
                                        {step.title}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base mb-4">
                                    {step.description}
                                </p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    {step.value}
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
