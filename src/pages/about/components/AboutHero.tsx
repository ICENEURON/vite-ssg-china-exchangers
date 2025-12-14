
export function AboutHero() {
    return (
        <section className="relative py-24 px-4 flex flex-col items-center text-center bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative max-w-5xl mx-auto space-y-8 z-10">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    Wait Less. Source Better.
                </div>

                <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                    We are HeatEx Direct. <br className="hidden md:block" />
                    <span className="text-primary">The Shortest Path to Verified Manufacturers.</span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
                    The world doesn't need another directory of 10,000 random suppliers. It needs a shortlist of the 10 best.
                    <br className="hidden md:block" />
                    We bridge the <span className="font-semibold text-slate-900 dark:text-white">"Trust Gap"</span> so you don't have to.
                </p>
            </div>
        </section>
    );
}
