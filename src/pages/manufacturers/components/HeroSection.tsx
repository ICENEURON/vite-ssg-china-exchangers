import { useTranslation } from "react-i18next"
import { PageHero } from "../../../components/ui/page-hero"

export function HeroSection() {
    const { t } = useTranslation("translation", { keyPrefix: "pages.manufacturers.hero" });
    const { t: tRoot } = useTranslation("translation");

    return (
        <PageHero
            title={t("title")}
            description={t("description")}
            backgroundImageSrc="/static/websites/manufacturers-hero.png"
            backgroundImageAlt={tRoot("ui.image.industrial_facility")}
        />
    )
}
