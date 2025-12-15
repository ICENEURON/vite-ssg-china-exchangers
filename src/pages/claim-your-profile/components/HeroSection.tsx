
import { Button } from "../../../components/ui/button"
import { ShieldCheck, Mail, FileText, CheckCircle2 } from "lucide-react"

export function HeroSection() {
    return (
        <section className="relative overflow-hidden py-24 lg:py-32 bg-background perspective-[2000px]">
            {/* Dynamic Background */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-[100px] opacity-20 pointer-events-none">
                <div className="aspect-square w-[800px] rounded-full bg-blue-600/40 mix-blend-multiply dark:mix-blend-screen animate-pulse" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container relative px-4 mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Content Left */}
                    <div className="text-left space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-bold border border-amber-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            Database Status: ACTIVE
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                            Your Factory is <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 animate-gradient-x">Already Listed.</span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                            Thousands of buyers search our directory every month. Don't let an unclaimed profile represent your engineering capability. Verify your data to unlock the "Official Supplier" badge.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4 border-t border-dashed w-fit">
                            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Manual Verification</span>
                                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> License Check</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all bg-blue-600 hover:bg-blue-700 group" asChild>
                                <a href="mailto:support@china-heatexchangers.com?subject=[Claim Profile] Verification Request">
                                    <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                    Request Verification via Email
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Visual Right: High-Fidelity Certificate */}
                    <div className="relative group perspective-[2000px] z-10">

                        {/* Visual Backdrop (Glow) */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-amber-500/10 blur-3xl transform rotate-6 scale-90" />

                        {/* The "Document" */}
                        <div className="relative mx-auto w-full max-w-md aspect-[3/4.2] bg-[#fdfbf7] dark:bg-[#1a1a1a] rounded-[4px] shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 transform rotate-y-[8deg] rotate-x-[4deg] hover:rotate-y-0 hover:rotate-x-0 transition-all duration-700 ease-out preserve-3d">

                            {/* Paper Texture Overlay */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-multiply pointer-events-none" />

                            {/* Border Guilloche Pattern (Simulated) */}
                            <div className="absolute inset-3 border-[3px] border-double border-zinc-300 dark:border-zinc-700 opacity-50" />
                            <div className="absolute inset-4 border border-zinc-200 dark:border-zinc-800 opacity-30" />

                            {/* Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none rotate-[-30deg]">
                                <ShieldCheck className="w-72 h-72" />
                            </div>

                            {/* Content Layer */}
                            <div className="relative h-full flex flex-col">

                                {/* Header */}
                                <div className="text-center mb-10 space-y-2">
                                    <div className="flex justify-center mb-4">
                                        <ShieldCheck className="w-12 h-12 text-zinc-800 dark:text-zinc-200" />
                                    </div>
                                    <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 tracking-wide">CERTIFICATE OF<br />REGISTRATION</h2>
                                    <div className="h-px w-24 bg-zinc-300 dark:bg-zinc-700 mx-auto mt-2" />
                                </div>

                                {/* Body */}
                                <div className="flex-1 space-y-8 px-4 text-center">
                                    <p className="text-sm font-serif italic text-zinc-500">This certifies that the organization</p>

                                    <div className="space-y-1">
                                        <div className="h-8 w-full bg-zinc-100 dark:bg-zinc-800/50 border-b border-zinc-300 dark:border-zinc-700" />
                                        <p className="text-[10px] uppercase tracking-wider text-zinc-400">Company Name</p>
                                    </div>

                                    <p className="text-sm font-serif italic text-zinc-500">has been formally identified in the</p>

                                    <div className="font-serif font-bold text-zinc-800 dark:text-zinc-200 text-lg border-b border-zinc-300 dark:border-zinc-700 pb-1">
                                        Global Manufacturer Database
                                    </div>
                                </div>

                                {/* Footer Seals */}
                                <div className="mt-auto flex items-end justify-between px-2 pt-8">
                                    <div className="text-center space-y-1">
                                        <div className="w-24 border-b border-zinc-400 dark:border-zinc-600 mb-1" />
                                        <div className="text-[10px] uppercase text-zinc-400 font-bold">Analyst Signature</div>
                                    </div>

                                    {/* Gold Seal Effect */}
                                    <div className="relative w-20 h-20">
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 rounded-full shadow-lg flex items-center justify-center p-1">
                                            <div className="w-full h-full border-[1px] border-yellow-200 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-500 to-yellow-700">
                                                <ShieldCheck className="w-10 h-10 text-yellow-100 drop-shadow-md" />
                                            </div>
                                        </div>
                                        {/* Shine Animation */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent rounded-full opacity-0 hover:opacity-100 animate-[shimmer_2s_infinite]" />
                                    </div>
                                </div>
                            </div>

                            {/* Prominent Stamp */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-12 pointer-events-none">
                                <div className="border-[6px] border-red-600/20 text-red-600/20 font-black text-4xl px-8 py-4 rounded-lg uppercase tracking-widest mix-blend-multiply dark:mix-blend-color-dodge">
                                    Pending
                                </div>
                            </div>

                        </div>

                        {/* Floating "Status" Tags (Refined) */}
                        <div className="absolute -bottom-8 -left-8 bg-background/80 backdrop-blur-md border px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 transform translate-x-4 animate-in slide-in-from-bottom-4 duration-1000 delay-500">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase">Next Step</div>
                                <div className="text-xs font-bold text-foreground">Submit Documentation</div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    )
}
