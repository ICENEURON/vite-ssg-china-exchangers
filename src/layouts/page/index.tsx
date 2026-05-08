import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "../../context/auth";
import Footer from "../../components/footer";
import { Navigation } from "../../components/navigation";

function PageLayoutContent() {
  const location = useLocation();

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

      <main className="flex-1 w-full mt-20">
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
