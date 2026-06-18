import { useTranslation } from "react-i18next";
import { Globe2, PackageSearch, ShieldCheck } from "lucide-react";
import { BrandText } from "../../../components/ui/brand-text";

export function WhoWeAre() {
    const { t } = useTranslation("translation");
    const paragraphs = t("pages.about.who_we_are.paragraphs", { returnObjects: true }) as string[];
    const identityCards = t("pages.about.who_we_are.identity_cards", { returnObjects: true }) as Array<{
        title: string;
        body: string;
    }>;
    const identityIcons = [ShieldCheck, PackageSearch, Globe2];

    return (
        <section className="flex justify-center bg-white px-2 py-14">
            <div className="container max-w-6xl px-4">
                <div className="max-w-5xl space-y-7">
                    <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                        <BrandText text={t("pages.about.who_we_are.story_title")} />
                    </h2>

                    <div className="space-y-5 text-base leading-8 text-muted md:text-lg">
                        <p className="font-medium text-foreground">
                            <BrandText text={t("pages.about.who_we_are.description")} />
                        </p>

                        {paragraphs.map((paragraph) => (
                            <p key={paragraph}>
                                <BrandText text={paragraph} />
                            </p>
                        ))}

                        <div className="flex max-w-5xl flex-col gap-4 pt-3">
                            {identityCards.map((card, index) => {
                                const Icon = identityIcons[index] || ShieldCheck;

                                return (
                                    <article key={card.title} className="border-l-2 border-transparent px-3 py-2.5 transition-colors duration-200 hover:border-primary md:px-4">
                                        <div className="flex items-center gap-2.5">
                                            <Icon className="size-5 shrink-0 text-primary" />
                                            <h3 className="text-base font-bold leading-6 text-foreground md:text-lg">
                                                {card.title}
                                            </h3>
                                        </div>
                                        <p className="mt-2 text-sm leading-6 text-muted md:ml-7 md:text-base">
                                            {card.body}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
