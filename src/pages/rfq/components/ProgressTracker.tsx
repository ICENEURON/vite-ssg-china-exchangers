import { useTranslation } from "react-i18next"

export function ProgressTracker({ currentStep }: { currentStep: number }) {
    const { t } = useTranslation("translation", { keyPrefix: "pages.rfq.steps" });
    const steps = [t("context"), t("specifications"), t("verification"), t("submit")]

    return (
        <div className="w-full py-4 px-8 mb-4">
            <div className="grid grid-cols-2 justify-items-start gap-3 md:flex md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-4">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = currentStep > stepNumber;
                    const isCurrent = currentStep === stepNumber;

                    return (
                        <div key={label} className="flex min-w-0 items-center justify-start md:flex-row md:items-center">
                            <div className={`
                                flex min-w-0 items-center justify-start gap-2 text-left transition-all duration-300
                                ${isCurrent ? 'opacity-100' : isCompleted ? 'opacity-70' : 'opacity-40 grayscale'}
                            `}>
                                <div className={`
                                    w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold shrink-0
                                    ${isCompleted || isCurrent ? 'bg-primary text-primary-foreground' : 'bg-slate-200 text-slate-500'}
                                `}>
                                    {stepNumber}
                                </div>
                                <span className={`min-w-0 text-sm font-semibold leading-tight ${isCurrent ? 'text-primary' : 'text-slate-600'}`}>
                                    {label}
                                </span>
                            </div>

                            {/* Separator between items */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block mx-3 lg:mx-6 w-8 lg:w-16 h-px bg-slate-200" />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
