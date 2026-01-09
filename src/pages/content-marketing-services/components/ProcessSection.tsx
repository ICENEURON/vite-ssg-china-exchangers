
import { Mail, FileEdit, BadgeCheck } from "lucide-react"
import { useTranslation } from "react-i18next"

export function ProcessSection() {
    const { t } = useTranslation("translation", { keyPrefix: "pages.cms.process" });

    const icons = [FileEdit, Mail, BadgeCheck];
    const steps = (t('steps', { returnObjects: true }) as { title: string; description: string }[]).map((step, index) => ({
        id: `0${index + 1}`,
        ...step,
        icon: icons[index] || FileEdit
    }));

    return (
        <section className="py-12 px-4">
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="tracking-tight">{t('title')}</h1>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-muted via-primary/50 to-muted" />

                    <div className="grid gap-12 md:grid-cols-3">
                        {steps.map((step, i) => (
                            <div key={i} className="relative flex flex-col items-center text-center group">
                                {/* Icon Wrapper */}
                                <div className="relative z-10 w-24 h-24 rounded-2xl bg-background border-2 border-muted group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-sm">
                                    <step.icon className="w-10 h-10 text-muted group-hover:text-primary transition-colors" />

                                    {/* Step Number Badge */}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-destructive text-background flex items-center justify-center font-bold text-sm shadow-md">
                                        {step.id}
                                    </div>
                                </div>

                                <div className="mt-4 space-y-3">
                                    <h4 className="font-bold text-accent/90">{step.title}</h4>
                                    <span className="text-muted text-sm font-semibold leading-relaxed max-w-xs mx-auto">
                                        {step.description}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
