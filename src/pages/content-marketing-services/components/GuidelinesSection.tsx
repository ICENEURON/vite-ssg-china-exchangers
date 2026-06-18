import { FileText, XCircle, CheckCircle } from "lucide-react"
import { useTranslation, Trans } from "react-i18next"

export function GuidelinesSection() {
    const { t } = useTranslation("translation", { keyPrefix: "pages.cms.guidelines" });

    return (
        <section className="px-4 py-8 md:py-10">
            <div className="container px-4 mx-auto max-w-5xl">
                <div className="mb-6 text-center md:mb-7">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">{t("title")}</h2>
                    <p className="text-muted">{t("description")}</p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                    {/* The "YES" Column */}
                    <div className="overflow-hidden rounded-sm bg-green-500/10">
                        <div className="h-full p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <CheckCircle className="h-6 w-6 shrink-0 text-green-500" />
                                <h3 className="text-2xl font-extrabold leading-tight text-foreground">{t("accepted.title")}</h3>
                            </div>

                            <div className="space-y-4 md:space-y-5">
                                <div>
                                    <span className="text-xs font-bold text-green-500/80 uppercase tracking-wider">{t("accepted.formats.title")}</span>
                                    <div className="mt-3 flex flex-wrap gap-3">
                                        {(t("accepted.formats.types", { returnObjects: true }) as string[]).map((type, i) => (
                                            <div key={i} className="flex items-center gap-2 py-1">
                                                <FileText className="h-4 w-4 text-blue-500" />
                                                <span className="text-sm leading-snug text-foreground">{type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs font-bold text-green-500/80 uppercase tracking-wider">{t("accepted.requirements.title")}</span>
                                    <ul className="mt-3 space-y-3 text-sm text-foreground/90">
                                        {(t("accepted.requirements.items", { returnObjects: true }) as string[]).map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-sm bg-green-500 mt-2 shrink-0 shadow-success-glow"></div>
                                                <span className="text-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <span className="text-xs font-bold text-green-500/80 uppercase tracking-wider">{t("accepted.topics.title")}</span>
                                    <ul className="mt-3 space-y-3 text-sm text-foreground/90">
                                        {(t("accepted.topics.items", { returnObjects: true }) as string[]).map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-sm bg-green-500 mt-2 shrink-0 shadow-success-glow"></div>
                                                <span className="text-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The "NO" Column */}
                    <div className="overflow-hidden rounded-sm bg-red-500/10">
                        <div className="h-full p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <XCircle className="h-6 w-6 shrink-0 text-red-500" />
                                <h3 className="text-2xl font-extrabold leading-tight text-foreground">{t("rejected.title")}</h3>
                            </div>

                            <div className="space-y-4 md:space-y-5">
                                <div className="mt-1 flex flex-wrap gap-3">
                                    <span className="text-xs font-bold text-red-500/80 uppercase tracking-wider">{t("rejected.formats.title")}</span>
                                    <div>
                                        <span className="mt-3 text-sm leading-snug text-foreground">
                                            <Trans i18nKey="pages.cms.guidelines.rejected.formats.description" components=  {[<span className="text-sm leading-snug text-red-500" key="0" />]} />
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs font-bold text-red-500/80 uppercase tracking-wider">{t("rejected.content.title")}</span>
                                    <ul className="mt-3 space-y-3">
                                        {(t("rejected.content.items", { returnObjects: true }) as string[]).map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-sm bg-red-400/50 mt-2 shrink-0"></div>
                                                <span className="text-sm leading-snug text-foreground">{item}</span>
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
