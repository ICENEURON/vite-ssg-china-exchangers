export function ProgressTracker({ currentStep }: { currentStep: number }) {
    const steps = ["Context", "Specifications", "Verification", "Submit"]

    return (
        <div className="w-full py-4 mb-4">
            <div className="flex items-center justify-between lg:justify-start lg:gap-8">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = currentStep > stepNumber;
                    const isCurrent = currentStep === stepNumber;

                    return (
                        <div key={label} className="flex items-center">
                            <div className={`
                                flex items-center gap-2 transition-all duration-300
                                ${isCurrent ? 'opacity-100' : isCompleted ? 'opacity-70' : 'opacity-40 grayscale'}
                            `}>
                                <div className={`
                                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                    ${isCompleted || isCurrent ? 'bg-primary text-primary-foreground' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}
                                `}>
                                    {stepNumber}
                                </div>
                                <span className={`text-sm font-semibold hidden md:block ${isCurrent ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {label}
                                </span>
                            </div>

                            {/* Separator between items */}
                            {index < steps.length - 1 && (
                                <div className="mx-3 lg:mx-6 w-8 lg:w-16 h-px bg-slate-200 dark:bg-slate-800" />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
