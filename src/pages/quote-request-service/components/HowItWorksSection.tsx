import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ClipboardList, Factory, MailCheck } from "lucide-react";
import { BrandText } from "../../../components/ui/brand-text";
import { cn } from "../../../utils/cn";

interface LandingTextItem {
  title: string;
  body: string;
}

const processStepIcons = [ClipboardList, MailCheck, Factory] as const;

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
  index,
}: {
  icon: LucideIcon;
  tone?: "primary" | "orange";
  index: number;
}) {
  return (
    <div
      className={cn(
        "relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border shadow-sm",
        tone === "primary" && "border-blue-100 bg-blue-50 text-primary shadow-blue-900/5",
        tone === "orange" && "border-orange-100 bg-orange-50 text-orange-600 shadow-orange-900/5",
      )}
    >
      <div className={cn(
        "absolute -right-2.5 -top-2.5 flex h-6 min-w-6 items-center justify-center rounded-full border border-white px-1 font-mono text-[11px] font-bold leading-none text-white shadow-sm",
        tone === "orange" ? "bg-orange-600" : "bg-primary",
      )}>
        {index + 1}
      </div>
      <Icon aria-hidden="true" className="h-[22px] w-[22px] stroke-[2]" />
    </div>
  );
}

export function HowItWorksSection() {
  const { t } = useTranslation("translation");
  const steps = getTextItems(t("pages.quoteRequestService.steps", { returnObjects: true }));

  return (
    <section data-section="quote-service-process" className="bg-white px-4 pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-2 md:px-6">
        <div className="mx-auto min-w-0 max-w-full text-center md:max-w-3xl">
          <h2 className="max-w-full break-words font-heading text-3xl font-extrabold tracking-tight text-[#101820] md:text-4xl">
            {t("pages.quoteRequestService.stepsTitle")}
          </h2>
          <p className="mt-4 max-w-full break-words text-base leading-7 text-slate-600 md:text-lg md:leading-8">
            {t("pages.quoteRequestService.stepsDescription")}
          </p>
        </div>
        <div
          role="list"
          data-layout="quote-service-sequence"
          className="relative mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)_44px_minmax(0,1fr)] md:items-stretch md:justify-center md:gap-0 lg:grid-cols-[minmax(0,320px)_88px_minmax(0,320px)_88px_minmax(0,320px)]"
        >
          {steps.map((step, index) => {
            const Icon = processStepIcons[index] ?? ClipboardList;
            return (
              <div key={step.title} className="contents">
                <article role="listitem" className="relative flex min-w-0 flex-col rounded-sm border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.07)] md:min-h-[245px]">
                  <div className="flex items-center gap-4 md:flex-col md:items-center md:gap-0 md:text-center">
                    <IconMark icon={Icon} tone={index === 1 ? "orange" : "primary"} index={index} />
                    <h3 className={cn("min-w-0 break-words text-xl font-extrabold leading-7 md:mt-6", index === 1 ? "text-orange-600" : "text-[#101820]")}>
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    <BrandText text={step.body} />
                  </p>
                </article>
                {index < steps.length - 1 && (
                  <div aria-hidden="true" className="hidden items-center justify-center md:flex">
                    <ArrowRight className={cn("h-8 w-8 stroke-[1.45] lg:h-11 lg:w-11", index === 0 ? "text-primary/55" : "text-orange-500/55")} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
