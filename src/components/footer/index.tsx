import { cn } from "../../utils/cn";
import Logo from "../../assets/logo.svg";
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
    alt: "Aussie Penny Stocks",
    title: "Aussie Penny Stocks",
    url: addLanguageToPath("/", currentLanguage),
  };

  // 四个主要页面（不含 Home）
  const pages = [
    {
      key: "about",
      url: addLanguageToPath("/about", currentLanguage),
    },
    {
      key: "history",
      url: addLanguageToPath("/history", currentLanguage),
    },
    {
      key: "docs",
      url: addLanguageToPath("/docs", currentLanguage),
    },
    {
      key: "faq",
      url: addLanguageToPath("/faq", currentLanguage),
    },
  ];

  const bottomLinks = [
    {
      text: t("footer.legal.terms"),
      url: addLanguageToPath("/terms", currentLanguage),
    },
    {
      text: t("footer.legal.privacy_policy"),
      url: addLanguageToPath("/privacy", currentLanguage),
    },
  ];

  return (
    <footer className={cn("bg-card border-t")}>
      <div className="container mx-auto px-4 md:px-6 pt-12 pb-6 max-w-8xl">
        <div className="grid gap-8 md:grid-cols-2">
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
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold text-foreground">
                  {logo.title}
                </span>
              </a>
            </div>
            <p className="mt-4 text-muted-foreground font-medium max-w-sm">
              {t("footer.tagline")}
            </p>
          </div>

          {/* 右侧：四个页面链接（两列，每列两个） */}
          <div className="md:justify-self-end">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 md:text-right">
              {pages.map((page) => (
                <li key={page.key}>
                  <a
                    href={page.url}
                    className="text-muted-foreground hover:text-primary font-medium transition-colors duration-200"
                  >
                    {t(`footer.links.items.${page.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 底部：版权 + 法律链接 */}
        <div className="mt-4 flex flex-col justify-between gap-4 pt-8 text-sm font-medium md:flex-row md:items-center">
          <p className="text-muted-foreground">
            {t("footer.legal.copyright", { year: currentYear })}
          </p>
          <ul className="flex gap-6">
            {bottomLinks.map((link, linkIdx) => (
              <li key={linkIdx}>
                <a
                  href={link.url}
                  className="text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors duration-200"
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
