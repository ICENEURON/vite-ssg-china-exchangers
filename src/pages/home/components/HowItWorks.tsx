import { useTranslation } from "react-i18next";
import { ClipboardList, MailCheck, Scale, Search } from "lucide-react";

export function HowItWorks() {
    const { t } = useTranslation("translation");

    const steps = t("pages.home.howItWorks.steps", { returnObjects: true }) as Array<{
        title: string;
        body: string;
    }>;

    const icons = [Search, ClipboardList, MailCheck, Scale];

    return (
        <section className="flex justify-center bg-white px-2 py-14">
            <div className="container flex max-w-6xl flex-col gap-8 px-4">
                <div>
                    <div className="max-w-3xl">
                        <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                            <ClipboardList className="size-4" />
                            {t("pages.home.howItWorks.eyebrow")}
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            {t("pages.home.howItWorks.title")}
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-muted md:text-base">
                            {t("pages.home.howItWorks.description")}
                        </p>
                    </div>
                </div>

                <div className="grid w-full grid-cols-1 divide-y divide-slate-200 border-y border-slate-200 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
                    {steps.map((step, index) => {
                        const Icon = icons[index] || ClipboardList;
                        return (
                            <div key={step.title} className="py-5 text-left lg:px-5">
                                <h3 className="flex items-center gap-3 text-base font-bold text-foreground">
                                    <Icon className="size-5 shrink-0 text-primary" />
                                    <span>{step.title}</span>
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-muted">
                                    {step.body}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
