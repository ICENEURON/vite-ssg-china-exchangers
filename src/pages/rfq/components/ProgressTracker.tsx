
import { Check } from "lucide-react"

interface ProgressTrackerProps {
    currentStep: number
}

const steps = [
    { id: 1, label: "Product Specs" },
    { id: 2, label: "Context & Files" },
    { id: 3, label: "Privacy & Send" },
]

export function ProgressTracker({ currentStep }: ProgressTrackerProps) {
    return (
        <div className="w-full py-4 mb-8">
            <div className="flex items-center justify-center relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -z-10" />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 h-0.5 bg-primary -z-10 transition-all duration-500 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} // Simplified for visual center
                />

                <div className="flex justify-between w-full max-w-lg px-4">
                    {steps.map((step) => {
                        const isCompleted = currentStep > step.id;
                        const isCurrent = currentStep === step.id;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                        ${isCompleted || isCurrent ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-muted text-muted-foreground'}
                    `}
                                >
                                    {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                                </div>
                                <span className={`text-xs font-medium uppercase tracking-wider ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {step.label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
