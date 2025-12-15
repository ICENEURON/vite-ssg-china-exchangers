
import { ShieldAlert, UserCheck, Clock, CheckCircle2, FileText, Building2 } from "lucide-react"

export function VerificationSection() {
    const steps = [
        {
            icon: ShieldAlert,
            title: "Submit Request",
            description: "You send us your latest information and supporting documents via email."
        },
        {
            icon: UserCheck,
            title: "Analyst Audit",
            description: "Our team manually verifies your claims against official government databases.",
            active: true
        },
        {
            icon: Clock,
            title: "Live Update",
            description: "Once confirmed, your profile is updated within 3-5 business days."
        }
    ]

    return (
        <section className="py-24 bg-background border-y">
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row gap-12 items-center">

                    <div className="flex-1 space-y-8">
                        <div>
                            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-blue-100/50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 mb-4">
                                Quality Assurance
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">We Verify Every Company Detail</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We confirm that all provided company information is authentic and accurate before it goes live. This ensures buyers can trust who they are dealing with.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {steps.map((step, i) => (
                                <div key={i} className={`flex gap-4 p-4 rounded-xl border transition-all ${step.active ? 'bg-muted border-primary/50 shadow-sm' : 'bg-transparent border-transparent'}`}>
                                    <div className={`mt-1 shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${step.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                        <step.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{step.title}</h3>
                                        <p className="text-muted-foreground">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        <div className="relative aspect-[4/5] bg-card rounded-2xl p-8 shadow-xl border overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-muted/30" />
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

                            <div className="relative z-10 flex flex-col h-full bg-background/80 backdrop-blur-sm rounded-xl border p-6 shadow-sm">

                                {/* Header */}
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">Factory Profile Audit</div>
                                        <div className="text-xs text-muted-foreground">ID: #REQ-2024-8892</div>
                                    </div>
                                    <div className="ml-auto px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded uppercase">
                                        In Progress
                                    </div>
                                </div>

                                {/* Checklist */}
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                        <div>
                                            <div className="text-sm font-bold">Business License</div>
                                            <div className="text-xs text-muted-foreground">Verified against Gov DB</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                        <div>
                                            <div className="text-sm font-bold">Company Identity</div>
                                            <div className="text-xs text-muted-foreground">Name & Address Match</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 opacity-60">
                                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                                        <div>
                                            <div className="text-sm font-bold">Export Capability</div>
                                            <div className="text-xs text-muted-foreground">Pending Review</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer / Stamp Area */}
                                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white dark:border-zinc-800" />
                                        <div className="text-xs">
                                            <div className="font-bold">Analyst: Sarah J.</div>
                                            <div className="text-muted-foreground">Reviewing now...</div>
                                        </div>
                                    </div>
                                    <FileText className="w-12 h-12 text-muted/20" />
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
