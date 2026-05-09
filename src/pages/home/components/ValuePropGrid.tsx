import { useTranslation } from "react-i18next";
import { BadgeCheck } from "lucide-react";

export function ValuePropGrid() {
    const { t } = useTranslation("translation");

    const evidence = (t("pages.home.valueProp.evidence", { returnObjects: true }) as Array<{
        label: string;
        body: string;
    }>).slice(0, 6);

    return (
        <section className="flex justify-center bg-slate-50 px-2 py-14">
            <div className="container flex max-w-6xl flex-col gap-8 px-4">
                <div>
                    <div className="max-w-3xl">
                        <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                            <BadgeCheck className="size-4" />
                            {t("pages.home.valueProp.eyebrow")}
                        </p>
                        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            {t("pages.home.valueProp.title")}
                        </h2>
                        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted md:text-base">
                            {t("pages.home.valueProp.description")}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:grid-cols-3">
                    {evidence.map((item) => (
                        <div key={item.label} className="border-t border-slate-200 py-5 text-left">
                            <h3 className="text-base font-semibold text-foreground">
                                {item.label}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-muted">
                                {item.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
