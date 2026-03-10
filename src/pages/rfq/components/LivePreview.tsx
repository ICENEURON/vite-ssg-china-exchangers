import { ShieldCheck, Eye, EyeOff, User, Factory } from "lucide-react"
import { useTranslation } from "react-i18next"

interface LivePreviewProps {
    specs: any
    productType: string
    isAnonymous: boolean
    onAnonymousChange: (v: boolean) => void
    application?: string
}

export function LivePreview({ specs, productType, isAnonymous, onAnonymousChange, application }: LivePreviewProps) {
    const { t } = useTranslation("translation", { keyPrefix: "pages.rfq.preview" });

    const getProductName = (type: string) => {
        if (type === 'phe') return t("productPHE")
        if (type === 'shell') return t("productShell")
        return t("productSpares")
    }

    return (
        <div className="w-full relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-2xl blur-lg opacity-50 pointer-events-none" />
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden relative z-10 transition-all duration-300">
                {/* Header Strip */}
                <div className="h-1.5 bg-gradient-to-r from-primary to-orange-500 w-full" />

                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Factory className="w-4 h-4" /> {t("title")}
                        </div>
                        <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                            #{t("draftStatus")}
                        </div>
                    </div>

                    {/* Buyer Info Block */}
                    <div className="flex items-start gap-4 mb-8 pb-8 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 ${isAnonymous ? 'bg-slate-100 dark:bg-slate-800' : 'bg-primary/10 dark:bg-primary/20'}`}>
                            {isAnonymous ? <ShieldCheck className="w-7 h-7 text-slate-400" /> : <User className="w-7 h-7 text-primary" />}
                        </div>
                        <div>
                            <div className="font-bold text-lg text-slate-900 dark:text-slate-50 leading-tight transition-all duration-300">
                                {isAnonymous ? t("verifiedBuyer") : t("nameDisplayed")}
                            </div>
                            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 w-fit px-2 py-1 rounded-md">
                                {isAnonymous ? (
                                    <>
                                        <EyeOff className="w-3.5 h-3.5" /> {t("contactHidden")}
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-3.5 h-3.5 text-primary" /> <span className="text-primary font-medium">{t("contactVisible")}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Request Summary */}
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t("productRequirement")}</div>
                            <div className="font-bold text-slate-900 dark:text-slate-50 text-lg">{getProductName(productType)}</div>
                        </div>

                        {application && (
                             <div className="space-y-1.5">
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t("industryLabel")}</div>
                                <div className="font-medium text-primary bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-lg w-fit text-sm">{t(`applications.${application.replace(/[^a-zA-Z]/g, '')}`, application)}</div>
                            </div>
                        )}

                        {(specs.hotFluid || specs.hotFlow || specs.hotIn || specs.coldFluid) && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm space-y-3 border border-slate-100 dark:border-slate-800">
                                <div className="font-bold text-xs text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">{t("techSpecsPreview")}</div>
                                
                                {specs.hotFluid && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">{t("hotFluid")}:</span> 
                                        <span className="font-mono font-medium text-slate-900 dark:text-slate-100">{specs.hotFluid}</span>
                                    </div>
                                )}
                                {specs.coldFluid && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">{t("coldFluid")}:</span> 
                                        <span className="font-mono font-medium text-slate-900 dark:text-slate-100">{specs.coldFluid}</span>
                                    </div>
                                )}
                                {specs.hotIn && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">{t("hotIn")}:</span> 
                                        <span className="font-mono font-medium text-slate-900 dark:text-slate-100">{specs.hotIn}°</span>
                                    </div>
                                )}
                                {specs.hotFlow && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">{t("hotFlow")}:</span> 
                                        <span className="font-mono font-medium text-slate-900 dark:text-slate-100">{specs.hotFlow}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>

                {/* Privacy Control Footer */}
                <div className="bg-slate-50 dark:bg-slate-800/30 p-5 md:p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between mt-auto">
                    <div className="text-xs font-medium text-slate-500 max-w-[140px] leading-relaxed">
                        {isAnonymous ? t("factoriesCannotSee") : t("factoriesCanEmail")}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold w-16 text-right ${isAnonymous ? 'text-slate-500' : 'text-primary'}`}>
                            {isAnonymous ? t("anonymous") : t("public")}
                        </span>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={isAnonymous}
                            onClick={() => onAnonymousChange(!isAnonymous)}
                            className={`
                                relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                                ${isAnonymous ? 'bg-slate-300 dark:bg-slate-700' : 'bg-primary'}
                            `}
                        >
                            <span
                                className={`
                                    pointer-events-none block h-6 w-6 rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out
                                    ${isAnonymous ? 'translate-x-0' : 'translate-x-5'}
                                `}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
