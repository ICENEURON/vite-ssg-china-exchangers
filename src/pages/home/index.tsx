import { Head } from "vite-react-ssg";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../components/ui/accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardAction,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

type FaqItem = {
  question: string;
  answer: string;
};

type WeeklyPick = {
  ticker: string;
  name: string;
  price: string;
  score: string;
  thesis: string;
  risk: string;
  link: string;
  tag: string;
};

export default function HomePage() {
  const { t } = useTranslation("translation");

  const whatIsSmallCapParagraphs = t(
    "pages.home.sections.whatAreSmallCaps.content",
    { returnObjects: true }
  ) as string[];

  const howToUseParagraphs = t("pages.home.sections.howToUse.content", {
    returnObjects: true,
  }) as string[];

  const faqItems = t("pages.home.faqPreview.items", {
    returnObjects: true,
  }) as FaqItem[];

  const weeklyPicks = t("pages.home.thisWeek.picks", {
    returnObjects: true,
  }) as WeeklyPick[];

  return (
    <>
      <Head>
        <title>{t("pages.home.title")}</title>
        <meta name="description" content={t("pages.home.meta.description")} />
        <meta name="keywords" content={t("pages.home.meta.keywords")} />
        <meta property="og:title" content={t("pages.home.og.title")} />
        <meta
          property="og:description"
          content={t("pages.home.og.description")}
        />
      </Head>

      {/* Hero */}
      <section className="pt-12 pb-6 px-4">
        <div className="grid mx-auto max-w-5xl text-center gap-6">
          <h1 className="gradient-text mb-4">{t("pages.home.hero.title")}</h1>
          <h2 className="text-xl md:text-2xl text-foreground mb-2">
            {t("pages.home.hero.subtitle")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("pages.home.hero.description")}
          </p>

          <div className="m-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <a href="/docs">{t("pages.home.hero.cta_secondary")}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* This Week - 3 stock cards */}
      <section className="py-6">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-3 text-center pt-4">
            <h3>{t("pages.home.thisWeek.title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("pages.home.thisWeek.subtitle")}
            </p>
          </div>

          <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-6">
              {Array.isArray(weeklyPicks) && weeklyPicks.length > 0 ? (
                weeklyPicks.map((pick) => {
                  const codeOnly = pick.tag.trim();
                  const asxUrl = `https://www.asx.com.au/markets/company/${codeOnly}`;

                  return (
                    <Card
                      key={pick.tag}
                      className="relative flex h-full flex-col pt-8 hover:shadow-md transition-shadow"
                    >
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center justify-center">
                          <Badge
                            variant="destructive"
                            className="px-4 py-1.5 text-sm md:text-base font-semibold shadow-md"
                          >
                            {pick.score}
                          </Badge>
                        </span>
                      </div>

                      <CardHeader className="pb-4 h-[4.5rem]">
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="flex-1">
                            <span className="block text-xl font-semibold">
                              {pick.name}
                            </span>
                          </CardTitle>
                          <CardAction>
                            <Badge className="px-3 py-1 text-xs font-semibold">
                              {pick.tag || "ASX Small Cap"}
                            </Badge>
                          </CardAction>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 pt-1">
                        <div className="space-y-3">
                          <div className="text-sm md:text-base text-muted-foreground line-clamp-[10]">
                            {pick.thesis}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="mt-auto pt-4">
                        <Button className="w-full" asChild>
                          <a
                            href={asxUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View on ASX ({codeOnly})
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })
              ) : (
                <p className="text-center text-sm text-muted-foreground col-span-3">
                  {t("pages.home.thisWeek.emptyState")}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Educational Sections */}
      <section className="py-6">
        <div className="container mx-auto max-w-5xl px-4 space-y-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t("pages.home.sections.whatAreSmallCaps.title")}
            </h2>
            <div className="space-y-3 text-muted-foreground text-sm md:text-base">
              {Array.isArray(whatIsSmallCapParagraphs) &&
                whatIsSmallCapParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t("pages.home.sections.howToUse.title")}
            </h2>
            <div className="space-y-3 text-muted-foreground text-sm md:text-base">
              {Array.isArray(howToUseParagraphs) &&
                howToUseParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              {t("pages.home.faqPreview.title")}
            </h2>
            <Button variant="secondary" asChild>
              <a href="/faq">{t("pages.home.faqPreview.cta_fullFaq")}</a>
            </Button>
          </div>

          <Accordion type="single" collapsible>
            {Array.isArray(faqItems) &&
              faqItems.map((item, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
