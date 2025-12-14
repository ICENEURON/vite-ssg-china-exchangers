export function TransparencySection() {
    return (
        <section className="py-24 px-4 bg-white dark:bg-transparent border-t border-slate-100 dark:border-slate-800">
            <div className="container mx-auto max-w-4xl text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-8">
                    Our Business Model
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-xl md:text-2xl font-medium text-slate-900 dark:text-white leading-relaxed mb-6">
                        We are <span className="text-primary">100% free for buyers.</span>
                    </p>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        We earn revenue from manufacturers who pass our audit. However, money cannot buy a "Verified" status. <br className="hidden md:block" />
                        <span className="font-semibold text-slate-900 dark:text-slate-200">If a factory fails our audit, they cannot pay to stay.</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
