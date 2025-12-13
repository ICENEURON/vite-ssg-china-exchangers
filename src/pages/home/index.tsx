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
} from "../../components/ui/card";
import { Zap, Shield, Palette } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type FeatureItem = {
  title: string;
  description: string;
  icon: string;
  link: string;
};

export default function HomePage() {
  const { t } = useTranslation("translation");

  const aboutParagraphs = t("pages.home.sections.about.content", {
    returnObjects: true,
  }) as string[];

  const gettingStartedParagraphs = t("pages.home.sections.gettingStarted.content", {
    returnObjects: true,
  }) as string[];

  const faqItems = t("pages.home.faqPreview.items", {
    returnObjects: true,
  }) as FaqItem[];

  const features = t("pages.home.features.items", {
    returnObjects: true,
  }) as FeatureItem[];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap":
        return <Zap className="h-6 w-6" />;
      case "Shield":
        return <Shield className="h-6 w-6" />;
      case "Palette":
        return <Palette className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

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
      <section className="pt-20 pb-12 px-4">
        <div className="grid mx-auto max-w-5xl text-center gap-6">
          <h1 className="gradient-text mb-4">{t("pages.home.hero.title")}</h1>
          <h2 className="text-2xl md:text-3xl text-foreground mb-2 font-semibold">
            {t("pages.home.hero.subtitle")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("pages.home.hero.description")}
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <a href="/docs/getting-started">{t("pages.home.hero.cta_primary")}</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/docs">{t("pages.home.hero.cta_secondary")}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-6">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-3 text-center mb-10">
            <h3 className="text-3xl font-bold">{t("pages.home.features.title")}</h3>
            <p className="text-muted-foreground">
              {t("pages.home.features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.isArray(features) && features.length > 0 ? (
              features.map((feature, index) => (
                <Card key={index} className="flex flex-col h-full border-border/50 shadow-sm transition-shadow">
                  <CardHeader>
                    <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {getIcon(feature.icon)}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="nonbackground" className="pl-0 gap-2" asChild>
                      <a href={feature.link}>Learn more &rarr;</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : null}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto max-w-5xl px-4 space-y-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {t("pages.home.sections.about.title")}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                {Array.isArray(aboutParagraphs) &&
                  aboutParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </div>
            <div className="bg-muted rounded-xl p-8 h-64 flex items-center justify-center text-muted-foreground">
              <span className="text-sm">Feature Illustration Placeholder</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="order-last md:order-first bg-muted rounded-xl p-8 h-64 flex items-center justify-center text-muted-foreground">
              <span className="text-sm">Code Snippet Placeholder</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {t("pages.home.sections.gettingStarted.title")}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                {Array.isArray(gettingStartedParagraphs) &&
                  gettingStartedParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t("pages.home.faqPreview.title")}
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {Array.isArray(faqItems) &&
              faqItems.map((item, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>

          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" asChild>
              <a href="/faq">{t("pages.home.faqPreview.cta_fullFaq")}</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
