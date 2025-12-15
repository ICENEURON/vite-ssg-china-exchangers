
import { Head } from 'vite-react-ssg'
import { Button } from "../../../components/ui/button"
import { BadgeCheck, Factory, FlaskConical, Gauge, Zap, ArrowRight, Star, MapPin, CheckCircle2, ShieldCheck, Flame } from "lucide-react"

export default function ShpheProfilePage() {
    return (
        <>
            <Head>
                <title>Shanghai Heat Transfer Equipment Co., Ltd. (SHPHE) - Verified Manufacturer</title>
                <meta name="description" content="Analyst Verified Profile: SHPHE is a Tech Leader in Wide-Gap and Fully Welded Plate Heat Exchangers. Validated Thermal Lab & Smart Factory." />
            </Head>

            <main className="min-h-screen bg-background text-foreground">

                {/* HERO SECTION */}
                <section className="relative overflow-hidden py-20 bg-zinc-950 text-white">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="container relative mx-auto px-4 max-w-6xl">
                        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-amber-500 font-bold tracking-wider text-sm uppercase">
                                    <Star className="w-4 h-4 fill-amber-500" /> Analyst Rating: 5.0 (Tech Leader)
                                </div>
                                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                                    Shanghai Heat Transfer <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Equipment Co., Ltd.</span>
                                    <span className="ml-4 text-2xl text-zinc-500 font-normal">(SHPHE)</span>
                                </h1>
                                <div className="flex items-center gap-6 text-zinc-400">
                                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Jinshan District, Shanghai</span>
                                    <span className="flex items-center gap-2"><Factory className="w-4 h-4" /> Est. 2005</span>
                                    <span className="flex items-center gap-2 text-green-400"><BadgeCheck className="w-4 h-4" /> Verified Manufacturer</span>
                                </div>
                            </div>

                            {/* RFQ Box */}
                            <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 p-6 rounded-2xl w-full md:w-auto min-w-[300px]">
                                <div className="text-sm font-bold text-zinc-400 mb-4 uppercase">Direct Contact</div>
                                <Button size="lg" className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700" asChild>
                                    <a href="#rfq">Build RFQ for SHPHE <ArrowRight className="ml-2 w-4 h-4" /></a>
                                </Button>
                                <p className="text-xs text-center text-zinc-500 mt-3">Usually responds within 24 hours</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ANALYST VERIFICATION (Bento Grid) */}
                <section className="py-16 bg-muted/20">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="flex items-center gap-3 mb-8">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                            <h2 className="text-2xl font-bold">Analyst Verification Report</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                            {/* Unique Asset: Lab */}
                            <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-8 rounded-3xl relative overflow-hidden group">
                                <FlaskConical className="absolute right-4 bottom-4 w-32 h-32 opacity-20 group-hover:scale-110 transition-transform" />
                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold opacity-80 mb-1">Unique Asset</h3>
                                    <div className="text-3xl font-extrabold mb-4">Thermal Laboratory</div>
                                    <p className="text-indigo-100 max-w-sm">
                                        Owns an in-house performance testing lab. Unlike copiers, they verify plate efficiency with real data.
                                    </p>
                                </div>
                            </div>

                            {/* Status: Smart Factory */}
                            <div className="bg-white dark:bg-zinc-900 border p-6 rounded-3xl flex flex-col justify-between hover:border-primary/50 transition-colors">
                                <Factory className="w-10 h-10 text-emerald-500 mb-4" />
                                <div>
                                    <div className="text-sm text-muted-foreground font-bold uppercase mb-1">Facility</div>
                                    <div className="text-xl font-bold mb-2">Smart Factory</div>
                                    <p className="text-sm text-muted-foreground">Automated welding robots & digital tracking.</p>
                                </div>
                            </div>

                            {/* Identity: Verified */}
                            <div className="bg-white dark:bg-zinc-900 border p-6 rounded-3xl flex flex-col justify-between hover:border-primary/50 transition-colors">
                                <BadgeCheck className="w-10 h-10 text-blue-500 mb-4" />
                                <div>
                                    <div className="text-sm text-muted-foreground font-bold uppercase mb-1">Identity</div>
                                    <div className="text-xl font-bold mb-2">Verified</div>
                                    <p className="text-sm text-muted-foreground">High-Tech Enterprise registered in Shanghai.</p>
                                </div>
                            </div>

                            {/* Product Focus (Full Width) */}
                            <div className="md:col-span-4 bg-zinc-950 text-zinc-300 p-6 rounded-3xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <Flame className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-zinc-500 uppercase">Product Focus</div>
                                        <div className="text-xl font-bold text-white">Difficult Fluids Specialist</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 text-sm">Welded Units</span>
                                    <span className="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 text-sm">Wide-Gap</span>
                                    <span className="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 text-sm">Complex Media</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* EXECUTIVE SUMMARY */}
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <h2 className="text-3xl font-bold mb-6">Executive Summary</h2>
                        <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-muted-foreground">
                            <p>
                                <strong>Shanghai Heat Transfer Equipment Co., Ltd. (SHPHE)</strong> is a premier solution provider for the process industry.
                                Founded in 2005, they have moved beyond simple manufacturing to become a <strong>System Integrator</strong>.
                                Their strength lies in handling "difficult" fluids. While many suppliers fail when dealing with clogging fibers or aggressive acids,
                                SHPHE excels by offering specialized <strong>Wide Gap</strong> (Free Flow) and <strong>HT-Bloc</strong> (Fully Welded) technologies.
                            </p>
                            <div className="my-8 grid md:grid-cols-2 gap-6 not-prose">
                                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900">
                                    <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                                        <FlaskConical className="w-5 h-5" /> Reliability
                                    </h4>
                                    <p className="text-sm">Their in-house Thermal Lab means they don't guess—they test. You get guaranteed performance data.</p>
                                </div>
                                <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-900">
                                    <h4 className="font-bold text-orange-700 dark:text-orange-300 mb-2 flex items-center gap-2">
                                        <Zap className="w-5 h-5" /> Advanced Tech
                                    </h4>
                                    <p className="text-sm">One of the few Chinese manufacturers producing PCHE (Printed Circuit Heat Exchangers) and Plate Air Preheaters.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TECHNICAL CAPABILITIES (Styled Table) */}
                <section className="py-16 bg-muted/20">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h2 className="text-3xl font-bold mb-8 text-center">Technical Capabilities</h2>
                        <div className="bg-card rounded-2xl shadow-sm border overflow-hidden">
                            <div className="grid grid-cols-1 divide-y">
                                {[
                                    { label: "Key Technology", value: "HT-Bloc (Fully Welded, Compabloc-style)" },
                                    { label: "Max Pressure", value: "30 Bar (Gasketed) / 60+ Bar (Welded)" },
                                    { label: "Temperature", value: "Up to 350°C (HT-Bloc) / 900°C (Air Preheater)" },
                                    { label: "Plate Materials", value: "SS304/316L, Titanium, Hastelloy, SMO254, Nickel 201" },
                                    { label: "Applications", value: "Oil Refining, Pharmaceutical, Wastewater, Sugar & Ethanol" }
                                ].map((row, i) => (
                                    <div key={i} className="grid md:grid-cols-3 p-6 hover:bg-muted/50 transition-colors">
                                        <div className="font-bold text-muted-foreground md:col-span-1">{row.label}</div>
                                        <div className="font-semibold md:col-span-2 text-foreground">{row.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRODUCT PORTFOLIO */}
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <h2 className="text-3xl font-bold mb-12 text-center">Core Solutions</h2>
                        <div className="grid md:grid-cols-3 gap-8">

                            {/* HT-Bloc */}
                            <div className="group border rounded-2xl p-8 hover:shadow-xl hover:border-primary/50 transition-all">
                                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                    <Gauge className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">HT-Bloc Welded</h3>
                                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                                    A rectangular, fully welded unit with no gaskets. Combines Shell & Tube pressure with Plate efficiency.
                                </p>
                                <div className="text-xs font-bold text-primary uppercase tracking-wider">Cross-flow Cleanable</div>
                            </div>

                            {/* Wide Gap */}
                            <div className="group border rounded-2xl p-8 hover:shadow-xl hover:border-primary/50 transition-all">
                                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                    <Factory className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Wide Gap (Free Flow)</h3>
                                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                                    Deep channels (up to 12mm) allow particles and fibers to pass without clogging. Ideal for Pulp & Paper.
                                </p>
                                <div className="text-xs font-bold text-primary uppercase tracking-wider">Anti-Clogging</div>
                            </div>

                            {/* Air Preheater */}
                            <div className="group border rounded-2xl p-8 hover:shadow-xl hover:border-primary/50 transition-all">
                                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                                    <Flame className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Plate Air Preheater</h3>
                                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                                    Heavy-duty welded plates designed to recover heat from industrial exhaust gas. Modular block design.
                                </p>
                                <div className="text-xs font-bold text-primary uppercase tracking-wider">High Temp 900°C</div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section id="rfq" className="py-24 bg-zinc-950 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
                    <div className="container relative mx-auto px-4 text-center max-w-3xl">
                        <h2 className="text-4xl font-extrabold mb-6">Ready to Request a Quote?</h2>
                        <p className="text-xl text-zinc-400 mb-10">
                            Need a solution for high pressure or dirty fluids? Connect with SHPHE's technical team for a custom proposal.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full bg-blue-600 hover:bg-blue-700" asChild>
                                <a href="mailto:rfq@china-heatexchangers.com?subject=RFQ for SHPHE">
                                    Build RFQ for SHPHE
                                </a>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-zinc-700 text-white hover:bg-zinc-800" asChild>
                                <a href="mailto:support@china-heatexchangers.com">
                                    Contact Support
                                </a>
                            </Button>
                        </div>
                    </div>
                </section>

            </main>
        </>
    )
}
