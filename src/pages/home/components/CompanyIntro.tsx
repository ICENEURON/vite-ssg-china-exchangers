import { Building2, CheckCircle2, MailCheck, SearchCheck, UsersRound } from "lucide-react";
import { useTranslation } from "react-i18next";

type TrustPoint = {
    title: string;
    body: string;
};

export function CompanyIntro() {
    const { t } = useTranslation("translation");
    const trustPoints = t("pages.home.companyIntro.trustPoints", { returnObjects: true }) as TrustPoint[];
    const facts = t("pages.home.companyIntro.facts", { returnObjects: true }) as string[];
    const trustIcons = [SearchCheck, UsersRound, MailCheck];

    return (
        <section className="px-2 py-12 bg-slate-50/70 flex justify-center md:py-14">
            <div className="container max-w-6xl px-4">
                <div className="grid grid-cols-1 gap-4 border-y border-slate-200 py-8 sm:grid-cols-[0.72fr_1.28fr] sm:gap-5 md:py-10 lg:gap-8">
                    <div className="bg-slate-950 p-5 text-white md:p-6">
                        <p className="inline-flex items-center gap-2 text-sm font-semibold text-orange-300">
                            <Building2 className="h-4 w-4" />
                            {t("pages.home.companyIntro.eyebrow")}
                        </p>
                        <h2 className="mt-4 !text-xl font-bold !leading-tight text-white lg:!text-2xl">
                            {t("pages.home.companyIntro.title")}
                        </h2>
                        <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-200">
                            {t("pages.home.companyIntro.lead")}
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-2">
                            {facts.map((fact) => (
                                <div key={fact} className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                                    <CheckCircle2 className="h-4 w-4 text-orange-300" />
                                    {fact}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
                        <p className="max-w-3xl text-base leading-relaxed text-slate-700">
                            {t("pages.home.companyIntro.body")}
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-3">
                            {trustPoints.map((point, index) => {
                                const Icon = trustIcons[index] || SearchCheck;

                                return (
                                    <div key={point.title} className="grid grid-cols-[2.25rem_1fr] gap-3 border-t border-slate-200 pt-3 first:border-t-0 first:pt-0">
                                        <div className="flex h-9 w-9 items-center justify-center bg-primary/10 text-primary">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold leading-snug text-slate-950">{point.title}</p>
                                            <p className="mt-1 text-sm leading-relaxed text-muted">{point.body}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
