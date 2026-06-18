import { Link } from "react-router-dom";
import { FileSearch } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RfqLink } from "../../../utils/rfq-routing/link";
import { addLanguageToPath, useCurrentLanguage } from "../../../utils/language-routing";
import { QUOTE_CTA_CLASS, QUOTE_SECONDARY_CTA_CLASS } from "../../../components/ui/quote-cta";
import { cn } from "../../../utils/cn";

function renderBrandName(key: string) {
  return (
    <strong key={key} className="font-bold text-white">
      HeatEx <span className="text-orange-500">Direct</span>
    </strong>
  );
}

function renderTextWithBrand(text: string) {
  const brand = "HeatEx Direct";
  const parts = text.split(brand);

  if (parts.length === 1) return text;

  return parts.flatMap((part, index) => (
    index === parts.length - 1
      ? [part]
      : [part, renderBrandName(`about-brand-${index}`)]
  ));
}

export function AboutQuoteServiceBand() {
  const { t } = useTranslation("translation");
  const currentLanguage = useCurrentLanguage();

  return (
    <section
      data-component="about-quote-service-band"
      className="bg-[#101820] px-2 py-10 text-white md:py-12"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="break-words text-2xl font-black leading-tight tracking-tight [overflow-wrap:anywhere] md:text-3xl">
            {t("pages.about.quote_service.title")}
          </h2>
          <p className="mx-auto mt-5 max-w-full break-words text-base leading-8 text-white/72 [overflow-wrap:anywhere] md:max-w-3xl">
            {renderTextWithBrand(t("pages.about.quote_service.description"))}
          </p>
        </div>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <RfqLink className={cn("inline-flex h-12 w-full items-center justify-center px-7 text-sm sm:w-auto", QUOTE_CTA_CLASS)}>
            {t("pages.rfq.spotlight.primaryCta")}
          </RfqLink>
          <Link
            to={addLanguageToPath("/quote-request-service", currentLanguage)}
            className={cn("inline-flex h-12 w-full items-center justify-center px-6 text-sm sm:w-auto", QUOTE_SECONDARY_CTA_CLASS, "!border-white/20 !bg-white !text-primary hover:!border-orange-500 hover:!bg-white hover:!text-primary")}
          >
            <FileSearch className="h-5 w-5 text-orange-500" />
            {t("pages.rfq.spotlight.serviceCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
