import { ShieldAlert, UserCheck, Clock } from "lucide-react"
import { useTranslation } from "react-i18next"

export function VerificationSection() {
    const { t } = useTranslation();

    const steps = [
        {
            icon: ShieldAlert,
            title: t('pages.profile.verification.steps.submit.title'),
            description: t('pages.profile.verification.steps.submit.description')
        },
        {
            icon: UserCheck,
            title: t('pages.profile.verification.steps.audit.title'),
            description: t('pages.profile.verification.steps.audit.description'),
            active: true
        },
        {
            icon: Clock,
            title: t('pages.profile.verification.steps.update.title'),
            description: t('pages.profile.verification.steps.update.description')
        }
    ]

    return (
        <section className="py-10 px-2 flex flex-col items-center">
            <div className="container mx-auto max-w-6xl flex flex-col items-center p-4">
                <div className="text-center max-w-2xl mx-auto mb-10 px-2">
                    <h1 className="font-bold text-accent mb-4">{t('pages.profile.verification.title')}</h1>
                    <h5 className="text-muted leading-relaxed">
                        {t('pages.profile.verification.description')}
                    </h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full place-items-start">
                    {steps.map((step, i) => (
                        <div key={i} className="flex flex-col items-center text-center gap-4 p-4 w-full">
                            <h3 className="font-bold shrink-0 text-accent text-3xl">{i + 1}.</h3>
                            <div className="flex flex-col items-center gap-2">
                                <h3 className="font-bold">{step.title}</h3>
                                <h5 className="text-muted leading-relaxed max-w-xs">
                                    {step.description}
                                </h5>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
