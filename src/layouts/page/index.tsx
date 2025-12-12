import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AuthProvider } from "../../context/auth";
import {
  useCurrentLanguage,
} from "../../utils/language-routing";
import Footer from "../../components/footer";
import { Navigation } from "../../components/navigation";

function PageLayoutContent() {
  const { i18n } = useTranslation("translation");
  const currentLanguage = useCurrentLanguage();
  const location = useLocation();

  // 与URL路径同步语言
  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
    document.documentElement.lang = currentLanguage;
    localStorage.setItem("language", currentLanguage);
  }, [currentLanguage, i18n]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-2 py-8 mt-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default function PageLayout() {
  return (
    <AuthProvider>
      <PageLayoutContent />
    </AuthProvider>
  );
}
