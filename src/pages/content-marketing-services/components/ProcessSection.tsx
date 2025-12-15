
import { Mail, FileEdit, BadgeCheck } from "lucide-react"

export function ProcessSection() {
    const steps = [
        {
            id: "01",
            title: "Draft & Prepare",
            description: "Write your technical article. Ensure you have high-res photos. Save as .DOCX.",
            icon: FileEdit,
        },
        {
            id: "02",
            title: "Email Submission",
            description: "Send to editor@china-heatexchangers.com with the subject '[Submission] - Company - Topic'.",
            icon: Mail,
        },
        {
            id: "03",
            title: "Review & Publish",
            description: "Our analysts verify technical accuracy within 7 days. Once approved, it goes live.",
            icon: BadgeCheck,
        }
    ]

    return (
        <section className="py-24 border-t border-b bg-muted/10">
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-background text-muted-foreground mb-4">
                        Simple Workflow
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-muted via-primary/50 to-muted" />

                    <div className="grid gap-12 md:grid-cols-3">
                        {steps.map((step, i) => (
                            <div key={i} className="relative flex flex-col items-center text-center group">
                                {/* Icon Wrapper */}
                                <div className="relative z-10 w-24 h-24 rounded-2xl bg-background border-2 border-muted group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-sm">
                                    <step.icon className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />

                                    {/* Step Number Badge */}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm shadow-md">
                                        {step.id}
                                    </div>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <h3 className="text-xl font-bold">{step.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
