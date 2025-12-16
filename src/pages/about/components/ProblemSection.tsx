import { AlertTriangle, Clock, CheckCircle2, XCircle } from "lucide-react";

export function ProblemSection() {
    return (
        <section className="py-24 px-4 bg-[linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] relative">
            <div className="container mx-auto max-w-6xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider text-sm">
                            <AlertTriangle className="w-5 h-5" />
                            The Real Problem
                        </div>
                        <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
                            It's not just about the markup. It's about the <span className="text-red-500">Risk</span>.
                        </h3>
                        <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed">
                            <p>
                                Saving a few percentage points means nothing if the factory delivers the wrong spec, delays your project by 4 weeks, or fails a pressure test.
                            </p>
                            <p>
                                <strong className="text-slate-900 dark:text-white">Time is money.</strong> Buying up-front certainty is always cheaper than fixing a mistake later. We filter out the noise so you can source with confidence.
                            </p>
                        </div>
                    </div>

                    {/* Visual/graphic side */}
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />

                        <div className="grid gap-4 relative z-10">
                            {/* Comparison Header */}
                            <div className="grid grid-cols-2 gap-4 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                                <div>Standard Sourcing</div>
                                <div>HeatEx Direct</div>
                            </div>

                            {/* Row 1: Source */}
                            <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm items-center">
                                <div className="text-slate-500 flex items-center gap-2 text-sm">
                                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                                    <span>Unknown Middleman</span>
                                </div>
                                <div className="text-slate-900 dark:text-white flex items-center gap-2 font-medium text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>Verified Manufacturer</span>
                                </div>
                            </div>

                            {/* Row 2: Time */}
                            <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm items-center">
                                <div className="text-slate-500 flex items-center gap-2 text-sm">
                                    <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                                    <span>4+ Weeks Vetting</span>
                                </div>
                                <div className="text-slate-900 dark:text-white flex items-center gap-2 font-medium text-sm">
                                    <span className="text-2xl">⚡</span>
                                    <span>Instant Shortlist</span>
                                </div>
                            </div>

                            {/* Row 3: Outcome */}
                            <div className="grid grid-cols-2 gap-4 bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-100 dark:border-red-900/30 items-center">
                                <div className="text-red-600 dark:text-red-400 font-bold text-sm">
                                    Uncertain Quality
                                </div>
                                <div className="text-green-600 dark:text-green-400 font-bold text-sm bg-green-50 dark:bg-green-900/20 -m-4 p-4 rounded-xl border-l-[1px] border-green-100 dark:border-green-900/50 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Guaranteed Output
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-sm text-slate-500 italic">
                            Certainty pays for itself.
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
