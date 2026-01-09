import { cn } from "../../utils/cn";
import Logo from "../../assets/logos/logo_light.png";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  useCurrentLanguage,
  addLanguageToPath,
} from "../../utils/language-routing";

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
        key: "rfq",
        url: addLanguageToPath("/rfq", currentLanguage),
      },
    ],
    [
      {
        key: "profile",
        url: addLanguageToPath("/claim-your-profile", currentLanguage),
      },
      {
        key: "content-marketing-services",
        url: addLanguageToPath("/content-marketing-services", currentLanguage),
      },
    ],
    [
      {
        key: "about",
        url: addLanguageToPath("/about", currentLanguage),
      },
      {
        key: "industry-news",
        url: addLanguageToPath("/industry-news", currentLanguage),
      },
    ],
  ];

  const bottomLinks = [
    {
      text: t("footer.legal.terms"),
      url: addLanguageToPath("/terms", currentLanguage),
    },
    {
      text: t("footer.legal.privacy"),
      url: addLanguageToPath("/privacy", currentLanguage),
    },
  ];

  return (
    <footer className={cn("bg-navbar text-navbar-foreground")}>
      <div className="container mx-auto px-4 md:px-6 pt-12 pb-6 max-w-8xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* 左侧：Logo + 描述 */}
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
                  className="h-8 w-16"
                />
                <span className="text-xl font-bold text-navbar-foreground">
                  {logo.title}
                </span>
              </a>
            </div>
            <p className="mt-4 text-navbar-foreground/60 font-medium max-w-sm">
              {t("footer.tagline")}
            </p>
          </div>

          {/* 右侧：三个列链接 */}
          <div className="justify-self-start lg:justify-self-end">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 text-left">
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

        {/* 底部：版权 + 法律链接 */}
        <div className="mt-4 flex flex-col justify-between gap-4 pt-8 text-sm font-medium md:flex-row md:items-center">
          <p className="text-navbar-foreground/60">
            {t("footer.legal.copyright", { year: currentYear })}
          </p>
          <ul className="flex gap-6">
            {bottomLinks.map((link, linkIdx) => (
              <li key={linkIdx}>
                <a
                  href={link.url}
                  className="text-navbar-foreground/60 hover:text-navbar-foreground underline underline-offset-4 transition-colors duration-200"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
