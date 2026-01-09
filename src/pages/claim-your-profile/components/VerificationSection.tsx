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
        <section className="py-16 px-4">
            <div className="container px-4 mx-auto max-w-5xl">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="font-bold text-accent mb-4">{t('pages.profile.verification.title')}</h1>
                    <h5 className="text-muted leading-relaxed">
                        {t('pages.profile.verification.description')}
                    </h5>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {steps.map((step, i) => (
                        <div key={i} className="flex gap-3 text-left">
                            <h3 className="font-bold shrink-0 text-accent">{i + 1}.</h3>
                            <div>
                                <h3 className="font-bold">{step.title}</h3>
                                <h5 className="text-muted leading-relaxed">
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
