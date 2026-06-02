import { CheckCircle2, Search, FileCheck, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export function VerificationGrid() {
    const { t } = useTranslation("translation");

    const steps = [
        {
            icon: <FileCheck className="size-6 text-primary" />,
            title: t("pages.about.verification.steps.scope.title"),
            description: t("pages.about.verification.steps.scope.description")
        },
        {
            icon: <Search className="size-6 text-primary" />,
            title: t("pages.about.verification.steps.database.title"),
            description: t("pages.about.verification.steps.database.description")
        },
        {
            icon: <CheckCircle2 className="size-6 text-primary" />,
            title: t("pages.about.verification.steps.shipping.title"),
            description: t("pages.about.verification.steps.shipping.description")
        },
        {
            icon: <MapPin className="size-6 text-primary" />,
            title: t("pages.about.verification.steps.location.title"),
            description: t("pages.about.verification.steps.location.description")
        }
    ];

    return (
        <section className="flex justify-center bg-white px-2 py-14">
            <div className="container flex max-w-6xl flex-col items-center gap-8 px-4">
                <div className="max-w-3xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                        {t("pages.about.verification.title")}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-muted md:text-base">
                        {t("pages.about.verification.description")}
                    </p>
                </div>

                <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <article
                            key={index}
                            className="flex flex-col border border-slate-200 bg-white p-4 text-left transition-colors duration-200 hover:border-primary/30 hover:bg-slate-50 md:p-5"
                        >
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary/5">
                                    {step.icon}
                                </div>
                                <h4 className="text-sm font-bold leading-6 text-foreground md:text-base">
                                    {step.title}
                                </h4>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-muted">
                                {step.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
