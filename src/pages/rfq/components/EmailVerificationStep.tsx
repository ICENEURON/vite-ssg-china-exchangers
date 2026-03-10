import { useState, useEffect } from "react";
import { Mail, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useTranslation } from "react-i18next";

interface EmailVerificationStepProps {
    email: string;
    setEmail: (v: string) => void;
    onVerify: () => void;
    isVerified: boolean;
    onNext: () => void;
}

const FREE_EMAIL_DOMAINS = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
    "qq.com", "163.com", "126.com", "foxmail.com", "icloud.com"
];

export function EmailVerificationStep({ email, setEmail, onVerify, isVerified, onNext }: EmailVerificationStepProps) {
    const { t } = useTranslation("translation", { keyPrefix: "pages.rfq" });

    const [domainStatus, setDomainStatus] = useState<"unknown" | "free" | "business">("unknown");
    const [step, setStep] = useState<"input" | "otp" | "success">("input");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (isVerified) {
        return (
            <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center">
                 <div className="h-[250px] flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{t("step3.verifiedTitle")}</h3>
                    <p className="text-slate-500 mt-2">({email})</p>
                    <div className="mt-8">
                        <Button size="lg" className="h-14 text-base font-bold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white rounded-xl shadow-lg shadow-primary/20 px-8" onClick={onNext}>
                            {t("step3.continueBtn")} <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        if (!email.includes("@")) {
            setDomainStatus("unknown");
            return;
        }
        const domain = email.split("@")[1].toLowerCase();
        if (FREE_EMAIL_DOMAINS.includes(domain)) {
            setDomainStatus("free");
        } else {
            setDomainStatus("business");
        }
    }, [email]);

    const handleSendCode = () => {
        if (!email || !email.includes("@")) return;
        setIsLoading(true);
        // Simulate network request for OTP
        setTimeout(() => {
            setIsLoading(false);
            setStep("otp");
        }, 800);
    };

    const handleVerifyOtp = () => {
        if (otp.length < 6) return;
        setIsLoading(true);
        // Simulate verification
        setTimeout(() => {
            setIsLoading(false);
            setStep("success");
            setTimeout(() => {
                onVerify();
            }, 1000);
        }, 1000);
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">{t("step3.title")}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                    {t("step3.verifySubtitle")}
                </p>
            </div>

            {step === "input" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("step3.emailLabel")}</label>
                        <input
                            type="email"
                            className="flex h-14 w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-background px-4 py-2 text-lg ring-offset-background transition-all hover:border-primary/40 focus:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
                            placeholder={t("step3.emailPlaceholder")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {domainStatus === "free" && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 flex gap-3 text-amber-800 dark:text-amber-200">
                            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="text-sm leading-relaxed">
                                <span className="font-bold">{t("step3.freeEmailTitle")}</span> {t("step3.freeEmailDesc")}
                            </div>
                        </div>
                    )}

                    {domainStatus === "business" && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4 flex gap-3 text-emerald-800 dark:text-emerald-200">
                            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="text-sm leading-relaxed">
                                <span className="font-bold">{t("step3.businessEmailTitle")}</span> {t("step3.businessEmailDesc")}
                            </div>
                        </div>
                    )}

                    <Button
                        size="lg"
                        className="w-full h-14 text-base font-bold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white rounded-xl shadow-lg shadow-primary/20"
                        disabled={domainStatus === "unknown" || isLoading}
                        onClick={handleSendCode}
                    >
                        {isLoading ? t("step3.sendingBtn") : t("step3.sendBtn")}
                    </Button>
                </div>
            )}

            {step === "otp" && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">{t("step3.codeSentTo")}</p>
                        <p className="font-bold text-slate-900 dark:text-slate-50">{email}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("step3.accessCodeLabel")}</label>
                        <input
                            autoFocus
                            type="text"
                            maxLength={6}
                            className="flex h-16 w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-background px-4 py-2 text-3xl tracking-[1em] text-center font-mono ring-offset-background transition-all focus:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 uppercase"
                            placeholder="------"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.toUpperCase())}
                        />
                    </div>

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-14 font-bold border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl px-6"
                            onClick={() => setStep("input")}
                        >
                            {t("actions.back")}
                        </Button>
                        <Button
                            size="lg"
                            className="flex-1 h-14 text-base font-bold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white rounded-xl shadow-lg shadow-primary/20"
                            disabled={otp.length !== 6 || isLoading}
                            onClick={handleVerifyOtp}
                        >
                            {isLoading ? t("step3.verifyingBtn") : t("step3.verifyBtn")} <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            )}

            {step === "success" && (
                <div className="h-[250px] flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{t("step3.successTitle")}</h3>
                    <p className="text-slate-500 mt-2">{t("step3.successSubtitle")}</p>
                </div>
            )}

        </div>
    );
}
