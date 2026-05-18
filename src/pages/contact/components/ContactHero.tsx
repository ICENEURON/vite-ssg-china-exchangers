import { Check, Copy, Mail } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function BrandName() {
    return (
        <span className="whitespace-nowrap">
            HeatEx <span className="text-orange-300">Direct</span>
        </span>
    );
}

export function ContactHero() {
    const { t } = useTranslation("translation");
    const [copied, setCopied] = useState(false);
    const email = import.meta.env.VITE_CONTACT_EMAIL;

    const copyEmail = async () => {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    };

    return (
        <section className="relative isolate flex min-h-[380px] justify-center overflow-hidden bg-navbar px-2 py-10 text-navbar-foreground">
            <div className="absolute inset-0 -z-20 bg-[url('/static/websites/home-hero.png')] bg-cover bg-center opacity-30" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navbar/92 via-navbar/86 to-navbar" />

            <div className="container z-10 flex max-w-6xl flex-col justify-start gap-5 px-4 pt-9">
                <div className="max-w-5xl space-y-5">
                    <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
                        {t("pages.contact.hero.title_prefix")}
                        <BrandName />
                        {t("pages.contact.hero.title_suffix")}
                    </h1>

                    <p className="max-w-3xl text-sm leading-7 text-gray-300 md:text-base">
                        <BrandName />
                        {t("pages.contact.hero.description")}
                    </p>

                    <button
                        type="button"
                        className="group mt-3 inline-flex w-fit items-center gap-3 rounded-sm bg-white px-5 py-3 text-sm font-normal text-slate-950 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:text-blue-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 md:text-base"
                        onClick={copyEmail}
                    >
                        <Mail className="size-4 text-primary" />
                        <span>{email}</span>
                        <span className={copied ? "text-orange-500" : "text-slate-500 transition-colors group-hover:text-blue-600"} aria-label={copied ? t("pages.contact.hero.email_copied") : t("pages.contact.hero.copy_email")}>
                            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
}
