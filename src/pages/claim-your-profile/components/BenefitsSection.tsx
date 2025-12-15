
import { BadgeCheck, Zap, BarChart3, Search, ArrowUpRight } from "lucide-react"

export function BenefitsSection() {
    return (
        <section id="benefits" className="py-24 bg-muted/20">
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Ownership Drives Growth</h2>
                        <p className="text-lg text-muted-foreground">
                            Engineers filter suppliers by <strong>current capabilities</strong>. If your profile shows outdated specs, you are invisible to next-gen projects. Active management is your competitive edge.
                        </p>
                    </div>

                    <div className="hidden md:block">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border shadow-sm text-sm font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Verified Profiles receive 2.4x more inquiries
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">

                    {/* Card 1: Preferential Ranking (Tall) */}
                    <div className="group relative overflow-hidden rounded-[2rem] bg-zinc-900 text-white p-8 md:row-span-1 flex flex-col justify-between hover:ring-2 ring-primary/50 transition-all shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Search className="w-40 h-40 -mr-12 -mt-12" />
                        </div>

                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                                <ArrowUpRight className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Priority Ranking</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Our search algorithm prioritizes <strong>Verified</strong> profiles. Claiming your listing instantly boosts your visibility for high-volume keywords like "Shell & Tube" or "PHE Maintenance".
                            </p>
                        </div>

                        <div className="mt-6 flex items-center gap-3 text-sm font-bold text-green-400">
                            <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-green-400 w-[85%]" />
                            </div>
                            +85% Traffic
                        </div>
                    </div>

                    {/* Card 2: The Verified Badge (Wide - Spans 2 cols) */}
                    <div className="group relative overflow-hidden rounded-[2rem] bg-card border p-8 md:col-span-2 flex flex-col md:flex-row items-center gap-8 hover:border-primary/50 transition-colors">
                        <div className="flex-1 text-center md:text-left z-10">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 mb-6">
                                <BadgeCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">The "Analyst Verified" Signal</h3>
                            <p className="text-muted-foreground text-lg mb-6">
                                Trust is the currency of B2B. A verified badge tells procurement managers that your certificates (ASME, ISO, PED) are valid and your factory is active. It eliminates the "Middleman Risk".
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold border border-blue-100 dark:border-blue-900">100% Verified</span>
                                <span className="px-3 py-1 bg-muted text-muted-foreground rounded-lg text-xs font-bold border">Factory Audit</span>
                            </div>
                        </div>

                        <div className="shrink-0 relative">
                            {/* Abstract Badge Visual */}
                            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-lg group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                                <div className="w-full h-full bg-background rounded-full flex flex-col items-center justify-center border-4 border-transparent p-4 relative">
                                    <BadgeCheck className="w-16 h-16 text-blue-600 mb-2 fill-blue-600/10" />
                                    <div className="font-bold text-foreground text-center leading-tight">OFFICIAL<br />SUPPLIER</div>

                                    <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-zinc-200 dark:border-zinc-700 animate-[spin_10s_linear_infinite]" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
