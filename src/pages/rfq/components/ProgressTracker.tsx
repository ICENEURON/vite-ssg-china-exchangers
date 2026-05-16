import { useTranslation } from "react-i18next"

export function ProgressTracker({ currentStep }: { currentStep: number }) {
    const { t } = useTranslation("translation", { keyPrefix: "pages.rfq.steps" });
    const steps = [t("context"), t("specifications"), t("verification"), t("submit")]

    return (
        <div className="w-full py-4 mb-4">
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:flex-wrap md:items-center md:justify-center">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = currentStep > stepNumber;
                    const isCurrent = currentStep === stepNumber;

                    return (
                        <div key={label} className="flex flex-col items-center md:flex-row md:items-center">
                            <div className={`
                                flex items-center justify-center gap-2 text-center transition-all duration-300
                                ${isCurrent ? 'opacity-100' : isCompleted ? 'opacity-70' : 'opacity-40 grayscale'}
                            `}>
                                <div className={`
                                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                                    ${isCompleted || isCurrent ? 'bg-primary text-primary-foreground' : 'bg-slate-200 text-slate-500'}
                                `}>
                                    {stepNumber}
                                </div>
                                <span className={`text-sm font-semibold ${isCurrent ? 'text-primary' : 'text-slate-600'}`}>
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
