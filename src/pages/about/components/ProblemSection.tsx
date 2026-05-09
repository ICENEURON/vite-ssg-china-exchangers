import { Shield, MessageSquare, CheckCircle2, XCircle, FileStack, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ProblemSection() {
    const { t } = useTranslation("translation");

    return (
        <section className="py-10 px-2 flex justify-center bg-section-fade relative">
            <div className="container px-4 max-w-6xl flex flex-col items-center justify-center gap-4 text-center">
                <div className="grid lg:grid-cols-2 gap-4 w-full justify-items-center">
                    <div className="flex flex-col items-center justify-center p-4 gap-4 w-full lg:order-2">
                        <div className="flex items-center justify-center gap-4 text-accent font-bold uppercase tracking-wider text-lg p-2">
                            <Shield className="w-5 h-5" />
                            {t("pages.about.advantages.badge")}
                        </div>
                        <h2 className="font-bold text-foreground p-2">
                            {t("pages.about.advantages.title")}
                        </h2>
                        <div className="prose prose-lg leading-relaxed flex flex-col items-center justify-center gap-2 p-2 w-full text-center">
                            <p className="font-medium text-foreground">
                                {t("pages.about.advantages.description_1")}
                            </p>
                            <p className="font-medium text-muted">
                                {t("pages.about.advantages.description_2")}
                            </p>
                        </div>
                    </div>

                    {/* Visual/graphic side */}
                    <div className="flex flex-col items-center justify-center bg-popover rounded-2xl p-6 border border-border/40 shadow-sm relative overflow-hidden lg:order-1 w-full gap-4 text-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-popover-foreground/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="flex flex-col items-center justify-center gap-4 relative z-10 w-full">
                            {/* Comparison Header */}
                            <div className="grid grid-cols-2 gap-4 p-2 text-sm font-bold uppercase tracking-wider text-popover-foreground text-center w-full">
                                <div>{t("pages.about.advantages.visual.header_standard")}</div>
                                <div>{t("pages.about.advantages.visual.header_us")}</div>
                            </div>

                            {/* Row 1: Communication */}
                            <div className="grid grid-cols-2 gap-4 bg-white rounded-xl p-4 shadow-sm items-center w-full">
                                <div className="text-muted flex items-center justify-center gap-4 text-sm">
                                    <MessageSquare className="w-5 h-5 text-muted shrink-0" />
                                    <span>{t("pages.about.advantages.visual.row_1.standard")}</span>
                                </div>
                                <div className="text-foreground flex items-center justify-center gap-4 font-medium text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>{t("pages.about.advantages.visual.row_1.us")}</span>
                                </div>
                            </div>

                            {/* Row 2: Multiple Options */}
                            <div className="grid grid-cols-2 gap-4 bg-white rounded-xl p-4 shadow-sm items-center w-full">
                                <div className="text-muted flex items-center justify-center gap-4 text-sm">
                                    <XCircle className="w-5 h-5 text-muted shrink-0" />
                                    <span>{t("pages.about.advantages.visual.row_2.standard")}</span>
                                </div>
                                <div className="text-foreground flex items-center justify-center gap-4 font-medium text-sm">
                                    <FileStack className="w-5 h-5 text-accent shrink-0" />
                                    <span>{t("pages.about.advantages.visual.row_2.us")}</span>
                                </div>
                            </div>

                            {/* Row 3: Privacy (Highlighted) */}
                            <div className="grid grid-cols-2 gap-4 bg-red-50 rounded-xl p-4 border border-red-100 items-center justify-center w-full">
                                <div className="text-red-600 font-bold text-sm flex items-center justify-center gap-4">
                                    <MessageSquare className="w-4 h-4 shrink-0" />
                                    {t("pages.about.advantages.visual.row_3.standard")}
                                </div>
                                <div className="text-green-600 font-bold text-sm bg-green-50 -m-4 p-4 rounded-xl border border-green-100 flex items-center justify-center gap-4">
                                    <Lock className="w-4 h-4 text-green-600 shrink-0" />
                                    {t("pages.about.advantages.visual.row_3.us")}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 text-center text-sm text-background italic w-full">
                            {t("pages.about.advantages.visual.footer")}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
