
import { ShieldCheck, Eye, EyeOff, User } from "lucide-react"

interface LivePreviewProps {
    specs: any
    productType: string
    isAnonymous: boolean
    onAnonymousChange: (v: boolean) => void
}

export function LivePreview({ specs, productType, isAnonymous, onAnonymousChange }: LivePreviewProps) {

    const getProductName = (type: string) => {
        if (type === 'phe') return "Plate Heat Exchanger"
        if (type === 'shell') return "Shell & Tube Unit"
        return "Replacement Spares"
    }

    return (
        <div className="sticky top-24">
            {/* The Live Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl border overflow-hidden transition-all duration-300">
                {/* Header Strip */}
                <div className="h-2 bg-blue-600 w-full" />

                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Live Preview: Factory View
                        </div>
                        <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                            #PENDING
                        </div>
                    </div>

                    {/* Buyer Info Block */}
                    <div className="flex items-start gap-4 mb-6 pb-6 border-b border-dashed">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${isAnonymous ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-blue-100 dark:bg-blue-900'}`}>
                            {isAnonymous ? <ShieldCheck className="w-6 h-6 text-zinc-400" /> : <User className="w-6 h-6 text-blue-600" />}
                        </div>
                        <div>
                            <div className="font-bold text-lg leading-tight transition-all duration-300">
                                {isAnonymous ? "Verified Buyer (US)" : "Your Name Displayed"}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                {isAnonymous ? (
                                    <>
                                        <EyeOff className="w-3 h-3" /> Contact Hidden
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-3 h-3 text-blue-500" /> <span className="text-blue-500 font-medium">Contact Visible</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Request Summary */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Product Requirement</div>
                            <div className="font-bold text-foreground">{getProductName(productType)}</div>
                        </div>

                        {(specs.hotFluid || specs.hotFlow || specs.hotIn) && (
                            <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-2 border border-muted">
                                <div className="font-medium text-xs text-muted-foreground uppercase">Tech Specs Snippet</div>
                                {specs.hotFluid && <div className="flex justify-between"><span>Fluid:</span> <span className="font-mono">{specs.hotFluid}</span></div>}
                                {specs.hotFlow && <div className="flex justify-between"><span>Flow:</span> <span className="font-mono">{specs.hotFlow}</span></div>}
                                {specs.hotIn && <div className="flex justify-between"><span>Hot In:</span> <span className="font-mono">{specs.hotIn}°</span></div>}
                            </div>
                        )}
                    </div>

                </div>

                {/* Privacy Control Footer */}
                <div className="bg-muted/30 p-4 border-t flex items-center justify-between">
                    <div className="text-xs font-medium text-muted-foreground">
                        {isAnonymous ? "Factories cannot see your email." : "Factories can email you directly."}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold w-16 text-right">{isAnonymous ? "Anonymous" : "Public"}</span>

                        {/* Custom Switch Implementation */}
                        <button
                            type="button"
                            role="switch"
                            aria-checked={isAnonymous}
                            onClick={() => onAnonymousChange(!isAnonymous)}
                            className={`
                                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                                ${isAnonymous ? 'bg-green-500' : 'bg-zinc-200 dark:bg-zinc-700'}
                            `}
                        >
                            <span
                                className={`
                                    pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out
                                    ${isAnonymous ? 'translate-x-5' : 'translate-x-0'}
                                `}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all">
                {/* Placeholders for logos like ISO, ASME, SSL */}
                <div className="h-8 w-12 bg-muted rounded animate-pulse" />
                <div className="h-8 w-12 bg-muted rounded animate-pulse" />
                <div className="h-8 w-12 bg-muted rounded animate-pulse" />
            </div>
        </div>
    )
}
