
import { Shield, MessageSquare, CheckCircle2, XCircle, FileStack, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ProblemSection() {
    const { t } = useTranslation("translation");

    return (
        <section className="pt-20 pb-8 px-8 bg-[linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] dark:bg-[linear-gradient(to_bottom,transparent,theme(colors.slate.900)_10%,theme(colors.slate.900)_90%,transparent)] relative">
            <div className="container mx-auto max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4 lg:order-2">
                        <div className="inline-flex items-center gap-2 text-accent font-bold uppercase tracking-wider text-lg">
                            <Shield className="w-5 h-5" />
                            {t("pages.about.advantages.badge")}
                        </div>
                        <h2 className="font-bold text-foreground">
                            {t("pages.about.advantages.title")}
                        </h2>
                        <div className="prose prose-lg leading-relaxed">
                            <p className="font-medium text-foreground">
                                {t("pages.about.advantages.description_1")}
                            </p>
                            <p className="font-medium text-muted">
                                {t("pages.about.advantages.description_2")}
                            </p>
                        </div>
                    </div>

                    {/* Visual/graphic side */}
                    <div className="bg-popover rounded-2xl p-8 border border-border/40 shadow-sm relative overflow-hidden lg:order-1 max-w-3xl mx-auto">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-popover-foreground/10 rounded-full blur-3xl" />
                        <div className="grid gap-4 relative z-10">
                            {/* Comparison Header */}
                            <div className="grid grid-cols-2 gap-4 mb-2 text-sm font-bold uppercase tracking-wider text-popover-foreground text-center">
                                <div>{t("pages.about.advantages.visual.header_standard")}</div>
                                <div>{t("pages.about.advantages.visual.header_us")}</div>
                            </div>

                            {/* Row 1: Communication */}
                            <div className="grid grid-cols-2 gap-4 bg-white  rounded-xl p-4 shadow-sm items-center">
                                <div className="text-muted flex items-center gap-2 text-sm">
                                    <MessageSquare className="w-5 h-5 text-muted shrink-0" />
                                    <span>{t("pages.about.advantages.visual.row_1.standard")}</span>
                                </div>
                                <div className="text-foreground flex items-center gap-2 font-medium text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>{t("pages.about.advantages.visual.row_1.us")}</span>
                                </div>
                            </div>

                            {/* Row 2: Multiple Options */}
                            <div className="grid grid-cols-2 gap-4 bg-white rounded-xl p-4 shadow-sm items-center">
                                <div className="text-muted flex items-center gap-2 text-sm">
                                    <XCircle className="w-5 h-5 text-muted shrink-0" />
                                    <span>{t("pages.about.advantages.visual.row_2.standard")}</span>
                                </div>
                                <div className="text-foreground flex items-center gap-2 font-medium text-sm">
                                    <FileStack className="w-5 h-5 text-accent shrink-0" />
                                    <span>{t("pages.about.advantages.visual.row_2.us")}</span>
                                </div>
                            </div>

                            {/* Row 3: Privacy (Highlighted) */}
                            <div className="grid grid-cols-2 gap-4 bg-red-50 rounded-xl p-4 border border-red-100">
                                <div className="text-red-600 font-bold text-sm flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    {t("pages.about.advantages.visual.row_3.standard")}
                                </div>
                                <div className="text-green-600 font-bold text-sm bg-green-50 -m-4 p-4 rounded-xl border-l-[1px] border-green-100 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-green-600" />
                                    {t("pages.about.advantages.visual.row_3.us")}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-sm text-background italic">
                            {t("pages.about.advantages.visual.footer")}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
