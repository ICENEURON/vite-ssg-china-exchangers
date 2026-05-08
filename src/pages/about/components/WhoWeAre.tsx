import { useTranslation } from "react-i18next";
import { Building2, Factory, Globe2, History, ShieldCheck, CheckCircle2 } from "lucide-react";

export function WhoWeAre() {
    const { t } = useTranslation("translation");
    const paragraphs = t("pages.about.who_we_are.paragraphs", { returnObjects: true }) as string[];
    const identityCards = t("pages.about.who_we_are.identity_cards", { returnObjects: true }) as Array<{
        title: string;
        body: string;
    }>;
    const identityIcons = [Building2, Factory, Globe2];

    const features = [
        {
            icon: History,
            title: t("pages.about.who_we_are.features.experience.title"),
            desc: t("pages.about.who_we_are.features.experience.desc"),
            number: "01"
        },
        {
            icon: ShieldCheck,
            title: t("pages.about.who_we_are.features.verification.title"),
            desc: t("pages.about.who_we_are.features.verification.desc"),
            number: "02"
        },
        {
            icon: Globe2,
            title: t("pages.about.who_we_are.features.connect.title"),
            desc: t("pages.about.who_we_are.features.connect.desc"),
            number: "03"
        },
    ];

    return (
        <section className="py-14 px-2 flex justify-center relative overflow-hidden bg-white">
            <div className="container px-4 max-w-6xl flex flex-col items-center justify-center gap-8">

                <div className="flex flex-col items-center justify-center gap-4 w-full p-2 text-center">
                    <div className="flex items-center justify-center gap-4 p-2">
                        <div className="w-12 h-[2px] bg-primary"></div>
                        <span className="text-sm font-bold tracking-widest uppercase text-foreground/60">
                            {t("pages.about.who_we_are.badge")}
                        </span>
                    </div>

                    <h1 className="tracking-tight text-accent p-2">
                        {t("pages.about.who_we_are.title")}
                    </h1>

                    <div className="prose prose-xl prose-slate dark:prose-invert max-w-4xl text-foreground leading-relaxed font-light p-2">
                        <p>{t("pages.about.who_we_are.description")}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr] w-full items-stretch">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-left shadow-sm md:p-8">
                        <h2 className="text-2xl font-bold text-slate-950 md:text-3xl">
                            {t("pages.about.who_we_are.story_title")}
                        </h2>
                        <div className="mt-5 space-y-4 text-base leading-8 text-slate-700">
                            {paragraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {identityCards.map((card, index) => {
                            const Icon = identityIcons[index] || Building2;

                            return (
                                <article key={card.title} className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm">
                                    <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Icon className="size-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-950">{card.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
                                </article>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full justify-items-center text-center">


                    <div className="flex flex-col items-center justify-center relative z-10 w-full p-4 gap-4">
                        <div className="flex flex-col items-center justify-center gap-4 w-full p-2">
                            {features.map((item, index) => (
                                <div key={index} className="group flex flex-col items-center justify-center gap-4 p-4 border-b border-border/50 hover:border-primary transition-colors duration-300 w-full">
                                    <div className="text-2xl font-black text-foreground/20 group-hover:text-primary transition-colors">
                                        {item.number}
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h4>
                                        <p className="text-foreground/70 text-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center relative w-full p-4">
                        <div className="relative z-10 bg-white dark:bg-slate-900 p-6 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-4 text-center w-full">
                            <div className="absolute -top-5 -right-5 w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg rotate-12">
                                {t("pages.about.who_we_are.transparency.metric")}
                            </div>

                            <div className="flex flex-col items-center justify-center gap-2 p-2">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <CheckCircle2 className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                                    {t("pages.about.who_we_are.transparency.subtitle")}
                                </h3>
                            </div>

                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed p-2">
                                {t("pages.about.who_we_are.transparency.desc")}
                            </p>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4 w-full">
                                <span className="flex h-2.5 w-2.5 relative">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {t("pages.about.who_we_are.transparency.policy_label")}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
