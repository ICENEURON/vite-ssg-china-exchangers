
import { Button } from "../../../components/ui/button"
import { ArrowRight, Globe } from "lucide-react"

export function HeroSection() {
    return (
        <section className="relative overflow-hidden py-24 lg:py-40 bg-background">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 blur-3xl opacity-20 pointer-events-none">
                <div className="aspect-square w-[800px] rounded-full bg-primary/40 mix-blend-multiply dark:mix-blend-screen" />
            </div>
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 blur-3xl opacity-20 pointer-events-none">
                <div className="aspect-square w-[600px] rounded-full bg-blue-500/40 mix-blend-multiply dark:mix-blend-screen" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container relative px-4 mx-auto max-w-5xl text-center">
                {/* Badge */}
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-secondary/50 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Globe className="mr-2 h-3.5 w-3.5 text-primary" />
                    <span className="text-secondary-foreground">Global Procurement Network</span>
                </div>

                <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    Showcase Your <br />
                    <span className="text-primary italic">Engineering Authority</span>
                </h1>

                <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    Reach global buyers not just with products, but with expertise. Publish technical insights and build lasting trust with procurement managers in HVAC, Marine, and Chemical industries.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-7 duration-1000">
                    <Button size="lg" className="h-14 px-8 text-lg rounded-full group" asChild>
                        <a href="mailto:editor@china-heatexchangers.com">
                            Start Publishing
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </Button>
                    <Button size="lg" variant="ghost" className="h-14 px-8 text-lg rounded-full" asChild>
                        <a href="#guidelines">
                            View Guidelines
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    )
}
