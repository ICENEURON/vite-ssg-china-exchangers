import { ClipboardCheck, MailCheck, RefreshCw } from "lucide-react"
import { useTranslation } from "react-i18next"

export function VerificationSection() {
    const { t } = useTranslation();
    const steps = t("pages.profile.process.steps", { returnObjects: true }) as Array<{
        title: string;
        description: string;
    }>;
    const icons = [MailCheck, ClipboardCheck, RefreshCw];

    return (
        <section className="bg-slate-50 px-2 py-14 flex flex-col items-center">
            <div className="container mx-auto max-w-6xl flex flex-col gap-8 p-4">
                <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t('pages.profile.process.eyebrow')}</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{t('pages.profile.process.title')}</h2>
                    <p className="mt-4 text-lg leading-8 text-slate-600">
                        {t('pages.profile.process.description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {steps.map((step, i) => (
                        <div key={step.title} className="rounded-lg border border-slate-200 bg-white p-6">
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    {(() => {
                                        const Icon = icons[i] || ClipboardCheck;
                                        return <Icon className="size-5" />;
                                    })()}
                                </div>
                                <span className="text-sm font-bold text-slate-400">0{i + 1}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-950">{step.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
