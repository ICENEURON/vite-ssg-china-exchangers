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
        <section className="py-10 px-2 flex justify-center bg-slate-50">
            <div className="container px-4 max-w-6xl flex flex-col items-center justify-center gap-4">
                <div className="text-center p-4 w-full flex flex-col items-center justify-center gap-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 p-2">
                        {t("pages.about.verification.title")}
                    </h2>
                    <p className="text-xl text-slate-600 p-2">
                        {t("pages.about.verification.description")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full justify-items-center">
                    {steps.map((step, index) => (
                        <Card key={index} className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white group relative overflow-hidden flex flex-col items-center justify-center text-center p-4 w-full gap-4">
                            {/* Hover Accent */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <CardHeader className="flex flex-col items-center justify-center gap-4 p-2 w-full">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="p-4 bg-slate-100 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        {step.icon}
                                    </div>
                                    <CardTitle className="text-xl font-bold text-slate-900">
                                        {step.title}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center p-2 w-full gap-4">
                                <p className="text-slate-600 leading-relaxed text-base">
                                    {step.description}
                                </p>
                                <span className="inline-flex flex-col items-center justify-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
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
