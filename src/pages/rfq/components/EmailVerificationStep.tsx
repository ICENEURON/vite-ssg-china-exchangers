import { useCallback, useEffect, useRef, useState } from "react";
import { ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useTranslation } from "react-i18next";
import { sendVerificationOTP, verifyOTPCode } from "../../../lib/supabase/auth";

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

const OTP_SLOT_COUNT = 8;

function getLocalizedErrorMessage(
    error: unknown,
    phase: "send" | "verify",
    t: (key: string, options?: Record<string, unknown>) => string
) {
    const fallback = phase === "send" ? t("step3.errors.sendFailed") : t("step3.errors.verifyFailed");

    if (!(error instanceof Error)) {
        return fallback;
    }

    const message = error.message.trim();
    const rateLimitMatch = message.match(/after\s+(\d+)\s+seconds/i);

    if (/for security purposes/i.test(message) && rateLimitMatch) {
        return t("step3.errors.rateLimit", { seconds: Number(rateLimitMatch[1]) });
    }

    if (/failed to fetch|network|err_name_not_resolved/i.test(message)) {
        return t("step3.errors.network");
    }

    if (/invalid|expired|token/i.test(message)) {
        return t("step3.errors.invalidCode");
    }

    return fallback;
}

export function EmailVerificationStep({ email, setEmail, onVerify, isVerified, onNext }: EmailVerificationStepProps) {
    const { t } = useTranslation("translation", { keyPrefix: "pages.rfq" });
    const otpInputRef = useRef<HTMLInputElement>(null);

    const [domainStatus, setDomainStatus] = useState<"unknown" | "free" | "business">("unknown");
    const [step, setStep] = useState<"input" | "otp" | "success">("input");
    const [otp, setOtp] = useState("");
    const [isOtpFocused, setIsOtpFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const showSendError = step === "input" && errorMsg;
    const showVerifyError = step === "otp" && errorMsg;
    const isEmailReady = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

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

    const syncOtpCaret = useCallback(() => {
        const input = otpInputRef.current;
        if (!input) return;

        const caretPosition = Math.min(otp.length, OTP_SLOT_COUNT);

        window.requestAnimationFrame(() => {
            input.setSelectionRange(caretPosition, caretPosition);
        });
    }, [otp]);

    useEffect(() => {
        if (!isOtpFocused) return;
        syncOtpCaret();
    }, [isOtpFocused, syncOtpCaret]);

    if (isVerified) {
        return (
            <div className="w-full max-w-2xl mx-auto text-center">
                 <div className="h-[250px] flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-emerald-100 rounded-sm flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{t("step3.verifiedTitle")}</h3>
                    <p className="text-slate-500 mt-2">({email})</p>
                    <div className="mt-8">
                        <Button size="lg" className="h-14 text-base font-bold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white rounded-sm shadow-lg shadow-primary/20 px-8" onClick={onNext}>
                            {t("step3.continueBtn")} <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const handleSendCode = async () => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail || !normalizedEmail.includes("@")) return;
        setIsLoading(true);
        setErrorMsg(null);
        try {
            setEmail(normalizedEmail);
            await sendVerificationOTP(normalizedEmail);
            setStep("otp");
        } catch (err: unknown) {
            setErrorMsg(getLocalizedErrorMessage(err, "send", t));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const token = otp.trim();
        if (!token) return;
        setIsLoading(true);
        setErrorMsg(null);
        try {
            await verifyOTPCode(email.trim().toLowerCase(), token);
            setStep("success");
            setTimeout(() => {
                onVerify();
            }, 1000);
        } catch (err: unknown) {
            setErrorMsg(getLocalizedErrorMessage(err, "verify", t));
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (value: string) => {
        setOtp(value.replace(/\D/g, "").slice(0, OTP_SLOT_COUNT));
    };

    const handleOtpKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(event.key)) {
            event.preventDefault();
            syncOtpCaret();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {step === "input" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div>
                        <input
                            id="rfq-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            aria-label={t("step3.emailLabel")}
                            className="flex h-14 w-full rounded-sm border-2 border-slate-200 bg-background px-4 py-2 text-lg ring-offset-background transition-all hover:border-primary/40 focus:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
                            placeholder={t("step3.emailPlaceholder")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {domainStatus === "free" && (
                        <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 flex gap-3 text-amber-800">
                            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="text-sm leading-relaxed">
                                <span className="font-bold">{t("step3.freeEmailTitle")}</span> {t("step3.freeEmailDesc")}
                            </div>
                        </div>
                    )}

                    {domainStatus === "business" && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-4 flex gap-3 text-emerald-800">
                            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="text-sm leading-relaxed">
                                <span className="font-bold">{t("step3.businessEmailTitle")}</span> {t("step3.businessEmailDesc")}
                            </div>
                        </div>
                    )}

                    <Button
                        size="lg"
                        className="w-full h-14 text-base font-bold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white rounded-sm shadow-lg shadow-primary/20"
                        disabled={!isEmailReady || isLoading}
                        onClick={handleSendCode}
                    >
                        {isLoading ? t("step3.sendingBtn") : t("step3.sendBtn")}
                    </Button>

                    {showSendError && (
                        <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600">
                            {errorMsg}
                        </div>
                    )}
                </div>
            )}

            {step === "otp" && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div className="text-center">
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">{t("step3.codeSentTo")}</p>
                        <p className="mt-2 truncate text-lg font-bold text-slate-900">{email}</p>
                    </div>

                    <div className="space-y-2">
                        <div
                            className={`relative overflow-hidden rounded-sm border px-3 py-4 ring-offset-background transition-all focus-within:outline-none sm:px-5 ${isOtpFocused
                                ? "border-primary/30 bg-white shadow-lg shadow-primary/10 ring-4 ring-primary/10"
                                : "border-blue-200/80 bg-linear-to-r from-blue-50/80 via-white to-slate-50"
                                }`}
                            onClick={() => otpInputRef.current?.focus()}
                        >
                            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-blue-100/50 via-blue-50/15 to-transparent" />
                            <input
                                ref={otpInputRef}
                                id="rfq-verification-code"
                                name="verificationCode"
                                autoFocus
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                aria-label={t("step3.accessCodeLabel")}
                                className="absolute inset-0 h-full w-full opacity-0"
                                value={otp}
                                onFocus={() => {
                                    setIsOtpFocused(true);
                                    syncOtpCaret();
                                }}
                                onBlur={() => setIsOtpFocused(false)}
                                onChange={(e) => handleOtpChange(e.target.value)}
                                onClick={syncOtpCaret}
                                onKeyDown={handleOtpKeyDown}
                                onKeyUp={syncOtpCaret}
                                onMouseUp={syncOtpCaret}
                                onSelect={syncOtpCaret}
                            />
                            <div className="relative mx-auto flex max-w-[20rem] items-end justify-between gap-1.5 sm:max-w-[24rem] sm:gap-2.5">
                                {Array.from({ length: OTP_SLOT_COUNT }, (_, index) => {
                                    const value = otp[index] || "";
                                    const isCurrentSlot = index === Math.min(otp.length, OTP_SLOT_COUNT - 1);
                                    const isFilled = value !== "";
                                    const showCaret = isOtpFocused && isCurrentSlot;

                                    return (
                                        <div
                                            key={index}
                                            className="relative flex h-14 min-w-0 flex-1 items-center justify-center text-center sm:h-16"
                                        >
                                            <span className={`inline-flex min-h-[1em] min-w-[0.7ch] items-center justify-center font-mono text-2xl font-bold tracking-[0.04em] transition-colors sm:text-3xl ${isFilled
                                                ? isCurrentSlot
                                                    ? "text-blue-600"
                                                    : "text-slate-900"
                                                : "text-transparent"
                                                }`}>
                                                {value || "\u00a0"}
                                            </span>
                                            <span className={`absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-sm transition-all sm:bottom-2 ${showCaret
                                                ? "w-8 bg-blue-500"
                                                : isCurrentSlot
                                                    ? "w-7 bg-blue-500"
                                                    : isFilled
                                                        ? "w-6 bg-slate-300"
                                                        : "w-5 bg-blue-200"
                                                }`} />
                                            {showCaret && (
                                                <span className={`absolute top-1/2 w-0.5 -translate-y-1/2 animate-pulse rounded-sm bg-blue-600 ${isFilled ? "right-[calc(50%-0.9rem)] h-6 sm:right-[calc(50%-1.1rem)] sm:h-7" : "h-7 sm:h-8"}`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button
                            size="lg"
                            className="h-14 w-full text-base font-bold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white rounded-sm shadow-lg shadow-primary/20"
                            disabled={!otp.trim() || isLoading}
                            onClick={handleVerifyOtp}
                        >
                            {isLoading ? t("step3.verifyingBtn") : t("step3.verifyBtn")} <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>

                    {showVerifyError && (
                        <div className="text-red-500 text-sm font-medium text-center">
                            {errorMsg}
                        </div>
                    )}
                </div>
            )}

            {step === "success" && (
                <div className="h-[250px] flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-emerald-100 rounded-sm flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{t("step3.successTitle")}</h3>
                    <p className="text-slate-500 mt-2">{t("step3.successSubtitle")}</p>
                </div>
            )}

        </div>
    );
}
