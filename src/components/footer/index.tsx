import { cn } from "../../utils/cn";
import Logo from "../../assets/logos/logo_new.png";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  useCurrentLanguage,
  addLanguageToPath,
} from "../../utils/language-routing";
import { QuoteCta } from "../ui/quote-cta";
import { RfqLink } from "../../utils/rfq-routing/link";
import { Mail } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation("translation");
  const currentLanguage = useCurrentLanguage();
  const [currentYear, setCurrentYear] = useState<number>(2025);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const logo = {
    src: Logo,
    alt: t("footer.logo.alt"),
    title: t("footer.logo.title"),
    url: addLanguageToPath("/", currentLanguage),
  };

  const linkColumns = [
    [
      {
        key: "manufacturers",
        url: addLanguageToPath("/manufacturers", currentLanguage),
      },
      {
        key: "products",
        url: addLanguageToPath("/products", currentLanguage),
      },
    ],
    [
      {
        key: "profile",
        url: addLanguageToPath("/update-your-profile", currentLanguage),
      },
      {
        key: "content-marketing-services",
        url: addLanguageToPath("/content-marketing-services", currentLanguage),
      },
    ],
    [
      {
        key: "industry-news",
        url: addLanguageToPath("/industry-news", currentLanguage),
      },
      {
        key: "about",
        url: addLanguageToPath("/about", currentLanguage),
      },
      {
        key: "contact",
        url: addLanguageToPath("/contact", currentLanguage),
      },
    ],
  ];

  const termsUrl = addLanguageToPath("/terms", currentLanguage);
  const privacyUrl = addLanguageToPath("/privacy", currentLanguage);

  return (
    <footer className={cn("bg-navbar text-navbar-foreground")}>
      <div className="container mx-auto px-4 md:px-6 pt-12 pb-6 max-w-8xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* 左侧：Logo + 描述 + 按钮 */}
          <div>
            <div className="flex items-center gap-2">
              <a
                href={logo.url}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src={logo.src}
                  alt="logo"
                  title={logo.title}
                  className="h-12 w-auto"
                />
                {/* <span className="text-xl font-bold text-navbar-foreground">
                  {logo.title}
                </span> */}
              </a>
            </div>
            <p className="mt-4 text-navbar-foreground/60 font-medium max-w-sm">
              {t("footer.tagline")}
            </p>
            <div className="mt-6 flex">
              <QuoteCta
                asChild
                size="lg"
                className="px-6"
              >
                <RfqLink>
                  <Mail className="w-5 h-5" />
                  {t("navigation.menu.rfq")}
                </RfqLink>
              </QuoteCta>
            </div>
          </div>

          {/* 右侧：三个列链接 */}
          <div className="justify-self-start lg:justify-self-end mt-4 lg:mt-0">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 grid grid-cols-2 md:flex text-left">
              {linkColumns.map((column, colIndex) => (
                <ul key={colIndex} className="flex flex-col gap-4">
                  {column.map((page) => (
                    <li key={page.key}>
                      <a
                        href={page.url}
                        className="text-navbar-foreground/70 hover:text-navbar-foreground font-medium transition-colors duration-200"
                      >
                        {t(`footer.links.items.${page.key}`)}
                      </a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>

        {/* 底部：版权与法律说明 */}
        <div className="mt-8 border-t border-navbar-foreground/10 pt-8 text-xs font-medium leading-6 text-navbar-foreground/60">
          <p>
            {t("footer.legal.copyright", { year: currentYear })}{" "}
            {t("footer.legal.see")}{" "}
            <a
              href={termsUrl}
              className="text-navbar-foreground/80 hover:text-navbar-foreground underline underline-offset-4 transition-colors duration-200"
            >
              {t("footer.legal.terms")}
            </a>{" "}
            {t("footer.legal.and")}{" "}
            <a
              href={privacyUrl}
              className="text-navbar-foreground/80 hover:text-navbar-foreground underline underline-offset-4 transition-colors duration-200"
            >
              {t("footer.legal.privacy")}
            </a>
            {t("footer.legal.afterLinks")}{" "}
            {t("footer.legal.entityStatement")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
