import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import { FileText, MailCheck, Network, ShieldCheck } from "lucide-react";
import { BrandText } from "../../../components/ui/brand-text";
import { QuoteCta } from "../../../components/ui/quote-cta";
import { cn } from "../../../utils/cn";
import { RfqLink } from "../../../utils/rfq-routing/link";

interface LandingTextItem {
  title: string;
  body: string;
}

const serviceFeatureIcons = [FileText, Network, ShieldCheck] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getTextItems(value: unknown): LandingTextItem[] {
  return Array.isArray(value)
    ? value.filter((item): item is LandingTextItem => (
      isRecord(item) && typeof item.title === "string" && typeof item.body === "string"
    ))
    : [];
}

function IconMark({
  icon: Icon,
  tone = "primary",
}: {
  icon: LucideIcon;
  tone?: "primary" | "orange" | "slate";
}) {
  return (
    <div
      className={cn(
        "relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border shadow-sm",
        tone === "primary" && "border-blue-100 bg-blue-50 text-primary shadow-blue-900/5",
        tone === "orange" && "border-orange-100 bg-orange-50 text-orange-600 shadow-orange-900/5",
        tone === "slate" && "border-slate-200 bg-slate-50 text-slate-600 shadow-slate-900/5",
      )}
    >
      <Icon aria-hidden="true" className="h-[22px] w-[22px] stroke-[2]" />
    </div>
  );
}

function HandDrawnCtaArrows() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-4 hidden h-36 w-[820px] -translate-x-1/2 overflow-visible md:block"
      viewBox="0 0 780 140"
      fill="none"
    >
      <defs>
        <marker id="quote-service-arrow-blue" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
          <path d="M1.5 1.5L10.5 6L1.5 10.5" stroke="#0A57E3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <marker id="quote-service-arrow-orange" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
          <path d="M1.5 1.5L10.5 6L1.5 10.5" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      <path
        d="M226 110C150 104 164 62 258 48"
        stroke="#0A57E3"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeDasharray="4 7"
        markerEnd="url(#quote-service-arrow-blue)"
      />
      <path
        d="M554 110C630 104 616 62 522 48"
        stroke="#F97316"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeDasharray="4 7"
        markerEnd="url(#quote-service-arrow-orange)"
      />
    </svg>
  );
}

export function WhatThisServiceDoesSection() {
  const { t } = useTranslation("translation");
  const summary = getTextItems(t("pages.quoteRequestService.summary", { returnObjects: true }));

  return (
    <section data-section="quote-service-overview" className="relative z-10 bg-white px-4 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-2 md:px-6">
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="relative z-10 mx-auto flex justify-center pt-4 md:pt-8">
            <QuoteCta size="lg" className="h-12 px-7 text-base" asChild>
              <RfqLink>
                <MailCheck className="h-5 w-5" />
                {t("pages.quoteRequestService.cta.button")}
              </RfqLink>
            </QuoteCta>
          </div>
          <HandDrawnCtaArrows />
          <h2 className="mt-7 break-words font-heading text-3xl font-extrabold tracking-tight text-[#101820] md:mt-8 md:text-4xl">
            {t("pages.quoteRequestService.serviceTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl break-words text-base leading-7 text-slate-600 md:text-lg md:leading-8">
            <BrandText text={t("pages.quoteRequestService.serviceDescription")} />
          </p>
        </div>
        <div data-visual="service-briefing-sheet" data-layout="quote-service-feature-cards" className="mt-8 grid min-w-0 gap-4 md:grid-cols-3 md:gap-5">
          {summary.slice(0, 3).map((item, index) => {
            const Icon = serviceFeatureIcons[index] ?? FileText;
            return (
              <article key={item.title} className="group flex min-w-0 flex-col rounded-sm border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_24px_70px_rgba(10,87,227,0.12)] md:min-h-[220px]">
                <div className="flex items-center gap-4 md:flex-col md:items-center md:gap-0 md:text-center">
                  <IconMark icon={Icon} tone={index === 1 ? "orange" : index === 2 ? "slate" : "primary"} />
                  <h3 className="min-w-0 break-words text-xl font-extrabold leading-7 text-[#101820] md:mt-6">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  <BrandText text={item.body} />
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
