import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import {
    ArrowRight,
    Building2,
    FileWarning,
    Newspaper,
    PackageSearch,
} from "lucide-react";
import { Link } from "react-router-dom";
import { addLanguageToPath, useCurrentLanguage } from "../../../utils/language-routing";

const pathIcons = {
    buyer: PackageSearch,
    supplier: Building2,
    content: Newspaper,
    correction: FileWarning,
};

const pathKeys = ["buyer", "supplier", "content", "correction"] as const;

function scrollToEmail(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    document.getElementById("contact-email")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ContactReasons() {
    const { t } = useTranslation("translation");
    const currentLanguage = useCurrentLanguage();
    const updateProfilePath = addLanguageToPath("/update-your-profile", currentLanguage);
    const contentMarketingPath = addLanguageToPath("/content-marketing-services", currentLanguage);

    return (
        <section className="flex justify-center bg-white px-2 py-16">
            <div className="container flex max-w-6xl flex-col gap-10 px-4">
                <div className="max-w-3xl">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                        {t("pages.contact.paths.title")}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-muted md:text-base">
                        {t("pages.contact.paths.description")}
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {pathKeys.map((key) => {
                        const Icon = pathIcons[key];
                        const action = t(`pages.contact.paths.items.${key}.action`);
                        const cardClassName = "group flex min-h-72 flex-col border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:bg-orange-50/40 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
                        const content = (
                            <>
                                <div className="flex justify-center">
                                    <Icon className="size-9 text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-orange-500" />
                                </div>
                                <h3 className="mt-6 text-center text-base font-bold leading-6 text-foreground transition-colors duration-300 group-hover:text-primary">
                                    {t(`pages.contact.paths.items.${key}.title`)}
                                </h3>
                                <p className="mt-3 flex-1 text-center text-sm leading-7 text-muted">
                                    {t(`pages.contact.paths.items.${key}.description`)}
                                </p>
                                <span className="mt-5 block text-center text-sm font-semibold text-primary transition-colors duration-300 group-hover:text-orange-600">
                                    <span className="relative inline-block whitespace-nowrap pr-6 leading-none">
                                        {action}
                                        <ArrowRight className="absolute right-0 top-1/2 size-4 -translate-y-1/2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1/2" />
                                    </span>
                                </span>
                            </>
                        );

                        if (key === "buyer") {
                            return (
                                <a key={key} href="#contact-email" className={cardClassName} onClick={scrollToEmail}>
                                    {content}
                                </a>
                            );
                        }

                        if (key === "supplier") {
                            return (
                                <Link key={key} to={updateProfilePath} className={cardClassName}>
                                    {content}
                                </Link>
                            );
                        }

                        if (key === "content") {
                            return (
                                <Link key={key} to={contentMarketingPath} className={cardClassName}>
                                    {content}
                                </Link>
                            );
                        }

                        return (
                            <a key={key} href="#contact-email" className={cardClassName} onClick={scrollToEmail}>
                                {content}
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
