import { Link } from "react-router-dom";
import { FileSearch } from "lucide-react";
import { useTranslation } from "react-i18next";
import { QUOTE_CTA_CLASS, QUOTE_SECONDARY_CTA_CLASS } from "../../../components/ui/quote-cta";
import { RfqLink } from "../../../utils/rfq-routing/link";
import { addLanguageToPath, useCurrentLanguage } from "../../../utils/language-routing";
import { cn } from "../../../utils/cn";

interface BuyerRfqSpotlightProps {
  className?: string;
  showLearnMore?: boolean;
  tone?: "light" | "dark";
}

function renderBrandName(key: string, isDark: boolean) {
  return (
    <strong key={key} className={cn("font-bold text-current", isDark && "text-current")}>
      HeatEx <span className="text-orange-500">Direct</span>
    </strong>
  );
}

function renderTextWithBrand(text: string, isDark: boolean) {
  const brand = "HeatEx Direct";
  const parts = text.split(brand);

  if (parts.length === 1) return text;

  return parts.flatMap((part, index) => (
    index === parts.length - 1
      ? [part]
      : [part, renderBrandName(`brand-${index}`, isDark)]
  ));
}

export function BuyerRfqSpotlight({ className, showLearnMore = true, tone = "light" }: BuyerRfqSpotlightProps) {
  const { t } = useTranslation("translation");
  const currentLanguage = useCurrentLanguage();
  const isDark = tone === "dark";

  return (
    <section
      data-component="buyer-quote-routing-spotlight"
      data-visual="simple-quote-service-strip"
      className={cn(
        "relative isolate max-w-[100vw] overflow-hidden bg-white px-2 pb-0 pt-8 text-[#101820] md:pt-10",
        isDark && "bg-[#101820] text-white",
        className
      )}
    >
      <div className="relative container mx-auto max-w-6xl px-4 py-2 md:py-3">
        <div aria-hidden className="absolute bottom-0 left-4 h-20 w-44 sm:h-28 sm:w-80 md:h-32 md:w-[30rem]">
          <span className="absolute bottom-[4px] left-[4px] h-0 w-40 border-t-2 border-dashed border-orange-500 sm:w-72 md:w-[28rem]" />
          <span className="absolute bottom-[4px] left-[4px] h-16 w-0 border-l-2 border-dashed border-orange-500 sm:h-24 md:h-28" />
          <span className="absolute bottom-0.5 left-0.5 size-1.5 bg-orange-500" />
        </div>
        <div aria-hidden className="absolute right-4 top-0 h-20 w-44 sm:h-28 sm:w-80 md:h-32 md:w-[30rem]">
          <span className="absolute right-[4px] top-[4px] h-0 w-40 border-t-2 border-dashed border-primary sm:w-72 md:w-[28rem]" />
          <span className="absolute right-[4px] top-[4px] h-16 w-0 border-l-2 border-dashed border-primary sm:h-24 md:h-28" />
          <span className="absolute right-0.5 top-0.5 size-1.5 bg-primary" />
        </div>
        <div className="relative z-10 px-4 py-6 sm:px-6 sm:py-7 md:px-8">
          <div className="max-w-3xl">
            <h2 className={cn(
              "break-words text-2xl font-black leading-tight tracking-tight [overflow-wrap:anywhere] md:text-3xl",
              isDark ? "text-white" : "text-primary"
            )}>
              {t("pages.rfq.spotlight.title")}
            </h2>
            <p className={cn(
              "mt-5 max-w-full break-words text-base leading-8 [overflow-wrap:anywhere] md:max-w-3xl",
              isDark ? "text-white/72" : "text-[#101820]/70"
            )}>
              {renderTextWithBrand(t("pages.rfq.spotlight.description"), isDark)}
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <RfqLink className={cn("inline-flex h-12 w-full items-center justify-center px-7 text-sm sm:w-auto", QUOTE_CTA_CLASS)}>
              {t("pages.rfq.spotlight.primaryCta")}
            </RfqLink>
            {showLearnMore && (
              <Link
                to={addLanguageToPath("/quote-request-service", currentLanguage)}
                className={cn("inline-flex h-12 w-full items-center justify-center px-6 text-sm sm:w-auto", QUOTE_SECONDARY_CTA_CLASS)}
              >
                <FileSearch className="h-5 w-5 text-orange-500" />
                {t("pages.rfq.spotlight.serviceCta")}
              </Link>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
