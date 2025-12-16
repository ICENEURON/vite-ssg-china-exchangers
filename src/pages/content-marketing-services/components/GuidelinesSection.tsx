import { FileText, XCircle, CheckCircle } from "lucide-react"
import { useTranslation, Trans } from "react-i18next"

export function GuidelinesSection() {
    const { t } = useTranslation("translation", { keyPrefix: "pages.cms.guidelines" });

    return (
        <section className="py-12 px-4">
            <div className="container px-4 mx-auto max-w-5xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">{t("title")}</h2>
                    <p className="text-muted">{t("description")}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* The "YES" Column */}
                    <div className="rounded-3xl border border-green-500/20 bg-gradient-to-b from-green-500/5 to-transparent p-1 overflow-hidden">
                        <div className="rounded-[1.4rem] p-8 h-full bg-green-500/5 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <h3 className="font-bold text-xl text-green-500">{t("accepted.title")}</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <span className="text-xs font-bold text-green-500/80 uppercase tracking-wider">{t("accepted.formats.title")}</span>
                                    <div className="mt-3 flex gap-3">
                                        {(t("accepted.formats.types", { returnObjects: true }) as string[]).map((type, i) => (
                                            <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-background/50 border border-green-500/10 rounded-xl shadow-sm hover:border-green-500/30 transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                    <FileText className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <span className="font-bold text-sm tracking-tight">{type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs font-bold text-green-500/80 uppercase tracking-wider">{t("accepted.topics.title")}</span>
                                    <ul className="mt-3 space-y-3 text-sm text-foreground/90">
                                        {(t("accepted.topics.items", { returnObjects: true }) as string[]).map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0 shadow-[0_0_6px_rgba(16,185,129,0.4)]"></div>
                                                <span className="text-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The "NO" Column */}
                    <div className="rounded-3xl border border-red-500/20 bg-gradient-to-b from-red-500/5 to-transparent p-1 overflow-hidden">
                        <div className="rounded-[1.4rem] p-8 h-full bg-red-500/5 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                    <XCircle className="w-5 h-5 text-red-500" />
                                </div>
                                <h3 className="font-bold text-xl text-red-500">{t("rejected.title")}</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <span className="text-xs font-bold text-red-500/80 uppercase tracking-wider">{t("rejected.formats.title")}</span>
                                    <p className="mt-2 font-bold text-sm text-foreground leading-relaxed">
                                        <Trans i18nKey="pages.cms.guidelines.rejected.formats.description" components={[<span className="text-red-500 font-bold bg-red-500/10 px-1 rounded-sm" key="0" />]} />
                                    </p>
                                </div>

                                <div>
                                    <span className="text-xs font-bold text-red-500/80 uppercase tracking-wider">{t("rejected.content.title")}</span>
                                    <ul className="mt-3 space-y-3 text-sm text-foreground">
                                        {(t("rejected.content.items", { returnObjects: true }) as string[]).map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-400/50 mt-2 shrink-0"></div>
                                                <span className="leading-snug">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
