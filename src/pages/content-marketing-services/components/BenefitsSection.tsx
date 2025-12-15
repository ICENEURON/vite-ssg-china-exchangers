
import { TrendingUp, ShieldCheck, Target } from "lucide-react"

const benefits = [
    {
        title: "High-Intent SEO Traffic",
        description: "We optimize for commercial keywords. Your articles gain visibility on Google, driving organic traffic directly to your Supplier Profile.",
        icon: TrendingUp,
    },
    {
        title: "Build Trust, Not Just Sales",
        description: "Overseas engineers prefer suppliers who solve problems. Technical articles (e.g., \"Plate vs. Shell & Tube Guide\") position you as a solution provider, not just a commodity seller.",
        icon: ShieldCheck,
    },
    {
        title: "Direct Lead Generation",
        description: "Every article includes a \"Request Quote\" sidebar linked to your verified profile.",
        icon: Target,
    },
]

export function BenefitsSection() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Publish With Us?</h2>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                <benefit.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
