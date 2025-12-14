import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";

export function AboutCTA() {
    return (
        <section className="py-24 px-4 bg-slate-900 text-white text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto max-w-3xl space-y-10 relative z-10">
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Ready to source with confidence?
                    </h2>
                    <p className="text-xl text-slate-300">
                        Stop guessing. Start building.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <Button size="lg" className="h-16 px-10 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 transition-all hover:scale-105" asChild>
                        <Link to="/manufacturers">
                            Browse Verified Manufacturers <ArrowRight className="ml-2 w-6 h-6" />
                        </Link>
                    </Button>

                    <div className="flex items-center gap-3 text-slate-400 mt-8 pt-8 border-t border-slate-800 w-full max-w-sm justify-center">
                        <Mail className="w-5 h-5" />
                        <span className="text-sm font-medium">Questions? Email us: <a href="mailto:contact@heatexdirect.com" className="text-white hover:text-primary transition-colors">contact@heatexdirect.com</a></span>
                    </div>
                </div>
            </div>
        </section>
    );
}
