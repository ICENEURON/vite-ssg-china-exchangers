import { useTranslation } from "react-i18next";
import { MailCheck } from "lucide-react";
import { QuoteCta } from "../../../components/ui/quote-cta";
import { cn } from "../../../utils/cn";
import { RfqLink } from "../../../utils/rfq-routing/link";

interface RoutingTier {
  title: string;
  value: string;
  body: string;
}

interface LandingMetric {
  label: string;
  value: string;
  body: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getRoutingTiers(value: unknown): RoutingTier[] {
  return Array.isArray(value)
    ? value.filter((item): item is RoutingTier => (
      isRecord(item)
      && typeof item.title === "string"
      && typeof item.value === "string"
      && typeof item.body === "string"
    ))
    : [];
}

function getMetrics(value: unknown): LandingMetric[] {
  return Array.isArray(value)
    ? value.filter((item): item is LandingMetric => (
      isRecord(item)
      && typeof item.label === "string"
      && typeof item.value === "string"
      && typeof item.body === "string"
    ))
    : [];
}

function BusinessTowerIllustration() {
  return (
    <svg aria-hidden="true" className="h-28 w-44" viewBox="0 0 180 160" fill="none">
      <path d="M24 132h132" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
      <path d="M43 70h34v62H43V70Z" fill="#DCEBFF" stroke="#0A57E3" strokeWidth="4" />
      <path d="M75 46h52v86H75V46Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="4" />
      <path d="M114 76h27v56h-27V76Z" fill="#DCEBFF" stroke="#0A57E3" strokeWidth="4" />
      <path d="M86 58h30v18H86V58Z" fill="#0A57E3" opacity=".9" />
      <path d="M86 92h8M86 108h8M105 92h8M105 108h8M52 84h8M52 100h8M123 92h8M123 108h8" stroke="#0A57E3" strokeWidth="4" strokeLinecap="round" />
      <path d="M34 118c0-10 8-18 18-18s18 8 18 18" fill="#FFEDD5" />
      <path d="M132 121c0-8 7-15 15-15s15 7 15 15" fill="#DBEAFE" />
    </svg>
  );
}

function PersonalDeskIllustration() {
  return (
    <svg aria-hidden="true" className="h-28 w-44" viewBox="0 0 180 160" fill="none">
      <path d="M31 132h118" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
      <path d="M49 62h82v51H49V62Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="4" />
      <path d="M63 75h54v25H63V75Z" fill="#DCEBFF" stroke="#0A57E3" strokeWidth="4" />
      <path d="M74 113h32v19H74v-19Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="4" />
      <path d="M38 132c0-20 13-37 30-37 16 0 29 17 29 37H38Z" fill="#FFEDD5" />
      <path d="M122 132c0-18 9-32 20-32s20 14 20 32h-40Z" fill="#DBEAFE" />
      <path d="M58 47h31" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
      <path d="M99 47h24" stroke="#0A57E3" strokeWidth="5" strokeLinecap="round" />
      <path d="M126 36h18v30h-18V36Z" fill="#FEF3C7" stroke="#F97316" strokeWidth="4" />
      <circle cx="45" cy="45" r="12" fill="#EFF6FF" stroke="#0A57E3" strokeWidth="4" />
      <path d="M45 38v8l6 3" stroke="#0A57E3" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function EmailTypeContactRangeSection() {
  const { t } = useTranslation("translation");
  const tiers = getRoutingTiers(t("pages.quoteRequestService.routingTiers", { returnObjects: true }));
  const metrics = getMetrics(t("pages.quoteRequestService.metrics", { returnObjects: true }));
  const reviewMetric = metrics[2];

  return (
    <section data-section="quote-service-routing" className="relative overflow-hidden bg-[#101820] px-4 py-12 text-white md:py-16">
      <div className="absolute inset-0 bg-dot-overlay-inverse opacity-10" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="relative mx-auto max-w-6xl px-2 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            {t("pages.quoteRequestService.routingHeading")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/68 md:text-base md:leading-7">
            {t("pages.quoteRequestService.routingDescription")}
          </p>
        </div>
        {reviewMetric && (
          <p className="mx-auto mt-4 max-w-xl text-center text-sm font-semibold leading-6 text-white/78">
            {reviewMetric.body}
          </p>
        )}
        <div data-visual="quote-service-email-ranges" data-layout="quote-service-email-tier-panels" className="mx-auto mt-7 grid max-w-[760px] min-w-0 gap-4 md:grid-cols-[minmax(0,340px)_minmax(0,340px)] md:justify-center">
          {tiers.map((tier, index) => (
            <article
              key={tier.title}
              className={cn(
                "flex min-h-[276px] min-w-0 flex-col overflow-hidden rounded-sm border bg-white/[0.055] shadow-[0_18px_54px_rgba(0,0,0,0.18)]",
                index === 0 ? "border-primary/35" : "border-white/12",
              )}
            >
              <div className="flex h-full min-h-0 flex-col p-4">
                <div className="flex h-32 shrink-0 items-center justify-center">
                  {index === 0 ? <BusinessTowerIllustration /> : <PersonalDeskIllustration />}
                </div>
                <div className="mt-4 flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center">
                    <h3 className="text-lg font-extrabold leading-7 text-white">{tier.title}</h3>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-6 text-white/72">{tier.body}</p>
                  <div className="mt-4 flex h-11 items-end justify-between gap-4 border-t border-white/10 pt-3">
                    <span className="min-w-0 truncate text-xs font-semibold leading-5 text-white/54">{tier.title}</span>
                    <div className={cn(
                      "shrink-0 text-lg font-extrabold leading-5 tracking-tight",
                      index === 0 ? "text-blue-200" : "text-orange-200",
                    )}>
                      {tier.value}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 border-t border-white/10 pt-9 md:mt-14 md:pt-10">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                {t("pages.quoteRequestService.cta.title")}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/68 md:text-base md:leading-7">
                {t("pages.quoteRequestService.cta.description")}
              </p>
            </div>
            <QuoteCta size="lg" className="h-12 px-7 md:shrink-0" asChild>
              <RfqLink>
                <MailCheck className="h-5 w-5" />
                {t("pages.quoteRequestService.cta.button")}
              </RfqLink>
            </QuoteCta>
          </div>
        </div>
      </div>
    </section>
  );
}
