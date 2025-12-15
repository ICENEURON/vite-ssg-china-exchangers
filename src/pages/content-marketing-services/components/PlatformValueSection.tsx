
import { TrendingUp, Users, Search, Share2, Globe2 } from "lucide-react"

export function PlatformValueSection() {
    return (
        <section className="py-24 bg-muted/20">
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="mb-16 md:text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Platform Impact</h2>
                    <p className="text-lg text-muted-foreground">
                        Don't just list your products. Demonstrate your technical leadership to thousands of daily active engineers and procurement specialists.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">

                    {/* Card 1: SEO Dominance (Large - Spans 2 cols) */}
                    <div className="group relative overflow-hidden rounded-3xl bg-card border p-8 md:col-span-2 flex flex-col justify-between hover:border-primary/50 transition-colors">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Search className="w-48 h-48 -mr-12 -mt-12 rotate-12" />
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 mb-6">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">High-Intent SEO Dominance</h3>
                            <p className="text-muted-foreground max-w-md">
                                Our platform ranks for thousands of commercial keywords. Your technical articles piggyback on our domain authority, appearing on the first page of Google for queries like "Plate Heat Exchanger Maintenance" or "Ti vs SS316".
                            </p>
                        </div>

                        {/* Simulated Graph Line */}
                        <div className="w-full h-16 mt-6 flex items-end gap-1">
                            {[40, 65, 55, 80, 70, 90, 85, 100].map((h, i) => (
                                <div key={i} className="flex-1 bg-primary/20 rounded-t-sm group-hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>

                    {/* Card 2: Direct Audience */}
                    <div className="group relative overflow-hidden rounded-3xl bg-card border p-8 flex flex-col justify-between hover:border-primary/50 transition-colors">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users className="w-40 h-40 -mr-16 -mt-16" />
                        </div>
                        <div>
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 mb-6">
                                <Globe2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Global Audience</h3>
                            <div className="space-y-3 mt-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">HVAC Engineers</span>
                                    <span className="font-mono font-bold">45%</span>
                                </div>
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-foreground w-[45%]" />
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Petrochemical</span>
                                    <span className="font-mono font-bold">30%</span>
                                </div>
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-foreground/70 w-[30%]" />
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Marine</span>
                                    <span className="font-mono font-bold">25%</span>
                                </div>
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-foreground/40 w-[25%]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Trust & Shareability */}
                    <div className="group relative overflow-hidden rounded-3xl bg-card border p-8 flex flex-col justify-between hover:border-primary/50 transition-colors">
                        <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Share2 className="w-40 h-40 -mr-10 -mb-10" />
                        </div>
                        <div>
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 mb-6">
                                <Share2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Build Digital Asset</h3>
                            <p className="text-muted-foreground text-sm">
                                Articles act as permanent digital assets. They are sharable on LinkedIn, referenced in your proposals, and serve as third-party validation of your expertise.
                            </p>
                        </div>
                    </div>

                    {/* Card 4: Verified Badge Impact (Large - Spans 2 cols) */}
                    <div className="group relative overflow-hidden rounded-3xl bg-zinc-950 text-white p-8 md:col-span-2 flex flex-col sm:flex-row gap-8 items-center hover:ring-2 ring-primary/50 transition-all">
                        {/* Abstract Visual */}
                        <div className="shrink-0 relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 w-64">
                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600" />
                                <div>
                                    <div className="w-24 h-2 bg-white/20 rounded-full mb-1" />
                                    <div className="w-16 h-2 bg-white/10 rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="w-full h-2 bg-white/10 rounded-full" />
                                <div className="w-full h-2 bg-white/10 rounded-full" />
                                <div className="w-3/4 h-2 bg-white/10 rounded-full" />
                            </div>
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] bg-primary text-primary-foreground font-bold">
                                VERIFIED
                            </div>
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-2xl font-bold mb-2">Verified Supplier Status</h3>
                            <p className="text-zinc-400 mb-6">
                                Publishing technical content automatically grants your profile the "Contributor" badge, boosting your visibility in directory search results.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                <span className="px-3 py-1 rounded-full bg-white/10 text-xs border border-white/10">Increased Visibility</span>
                                <span className="px-3 py-1 rounded-full bg-white/10 text-xs border border-white/10">Trust Signal</span>
                                <span className="px-3 py-1 rounded-full bg-white/10 text-xs border border-white/10">Expert Status</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
