import { useTranslation } from "react-i18next";
import { BrandText } from "../../../components/ui/brand-text";
import { PageHero } from "../../../components/ui/page-hero";

export function HeroSection() {
  const { t } = useTranslation("translation");

  return (
    <PageHero
      title={t("pages.quoteRequestService.hero.title")}
      description={(
        <BrandText
          text={t("pages.quoteRequestService.hero.description")}
          directClassName="text-orange-400"
          nameClassName="font-bold text-white"
        />
      )}
      backgroundImageSrc="/static/websites/product-hero.png"
      backgroundImageAlt={t("ui.image.industrial_facility")}
    />
  );
}
