import { Link } from "react-router-dom";
import { FileSearch, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { QUOTE_CTA_CLASS, QUOTE_SECONDARY_CTA_CLASS } from "../../../../components/ui/quote-cta";
import { RfqLink } from "../../../../utils/rfq-routing/link";
import { addLanguageToPath, useCurrentLanguage } from "../../../../utils/language-routing";
import { cn } from "../../../../utils/cn";

interface ProductRfqRequirementsProps {
  className?: string;
  productName: string;
}

interface RequirementItem {
  title: string;
  body: string;
}

function getRequirements(value: unknown): RequirementItem[] {
  return Array.isArray(value) ? value.filter((item): item is RequirementItem => (
    typeof item?.title === "string" && typeof item?.body === "string"
  )) : [];
}

function renderHeadingWithProductName(heading: string, productName: string) {
  if (!productName || !heading.includes(productName)) return heading;

  const parts = heading.split(productName);

  return parts.flatMap((part, index) => (
    index === parts.length - 1
      ? [part]
      : [
          part,
          <span key={`product-name-${index}`} className="text-blue-600">
            {productName}
          </span>,
        ]
  ));
}

export function ProductRfqRequirements({ className, productName }: ProductRfqRequirementsProps) {
  const { t } = useTranslation("translation");
  const currentLanguage = useCurrentLanguage();
  const quoteChecklist = getRequirements(t("pages.products.detail.rfq_requirements.items", { returnObjects: true })).slice(0, 3);
  const heading = t("pages.products.detail.rfq_requirements.heading", { productName });

  return (
    <section
      id="quote-readiness"
      data-component="product-quote-readiness"
      data-visual="minimal-product-quote"
      data-layout="detached-product-quote"
      className={cn("mb-8 mt-10 w-full max-w-full min-w-0 scroll-mt-28", className)}
    >
      <div className="mt-6 mb-4 flex items-center gap-2">
        <FileSearch className="h-6 w-6 shrink-0 text-blue-600" />
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          {t("pages.products.detail.rfq_requirements.title")}
        </h2>
      </div>

      <div className="overflow-hidden rounded-sm border border-[#101820]/10 bg-white text-[#101820] shadow-sm">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(340px,460px)]">
          <div className="min-w-0 p-6 md:p-8">
            <h3 className="text-2xl font-black leading-tight tracking-tight md:text-3xl">
              {renderHeadingWithProductName(heading, productName)}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#101820]/70">
              {t("pages.products.detail.rfq_requirements.description")}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <RfqLink className={cn("inline-flex h-12 w-full items-center justify-center px-6 text-sm font-bold sm:w-auto", QUOTE_CTA_CLASS)}>
                <Mail className="h-5 w-5" />
                {t("pages.products.detail.rfq_requirements.cta")}
              </RfqLink>
              <Link
                to={addLanguageToPath("/quote-request-service", currentLanguage)}
                className={cn("inline-flex h-12 w-full items-center justify-center px-6 text-sm sm:w-auto", QUOTE_SECONDARY_CTA_CLASS)}
              >
                <FileSearch className="h-5 w-5 text-orange-500" />
                {t("pages.products.detail.rfq_requirements.serviceCta")}
              </Link>
            </div>
          </div>

          <div className="bg-[#101820] p-6 text-white md:p-8">
            <h3 className="mb-5 text-xl font-black leading-tight text-white">
              {t("pages.products.detail.rfq_requirements.checklistTitle")}
            </h3>
            <ul className="grid gap-4">
              {quoteChecklist.map((item) => (
                <li key={item.title} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-3">
                  <span className="mt-2 h-2 w-2 bg-orange-500" aria-hidden="true" />
                  <p className="min-w-0 text-sm leading-6 text-white/70">
                    <span className="font-bold text-white">{item.title}</span>
                    <span className="mx-1 text-white/35">:</span>
                    <span>{item.body}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
