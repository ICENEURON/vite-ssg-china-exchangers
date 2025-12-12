import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { LanguageToggle } from "../../components/language-toggle";
import { useAuth } from "../../context/auth";
import { ROUTES } from "../../routes/config";
import {
    useCurrentLanguage,
    addLanguageToPath,
} from "../../utils/language-routing";
import { Button } from "../ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "../ui/navigation-menu";

export function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation("translation");
    const { user } = useAuth();
    const currentLanguage = useCurrentLanguage();
    const location = useLocation();

    // 检查认证标志
    const authEnvValue = import.meta.env.VITE_ENABLE_AUTH;
    const enableAuth = authEnvValue === "true";

    // 点击菜单外自动关闭
    useEffect(() => {
        if (!isMobileMenuOpen) return;
        function handleClickOutside(event: MouseEvent) {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node)
            ) {
                setIsMobileMenuOpen(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    const publicItems = ROUTES.filter((r) => r.nav === "public");
    const guestItems = ROUTES.filter((r) => r.nav === "guest");
    const authItems = ROUTES.filter((r) => r.nav === "auth");

    const items = enableAuth
        ? user
            ? [...publicItems, ...authItems]
            : [...publicItems, ...guestItems]
        : publicItems;

    const getLocalizedPath = (path: string) => {
        return addLanguageToPath(path, currentLanguage);
    };

    const isActiveLink = (path: string) => {
        const currentPath = location.pathname;
        const localizedPath = getLocalizedPath(path);

        if (path === "/") {
            return currentPath === "/";
        }

        return (
            currentPath === localizedPath ||
            currentPath.startsWith(localizedPath + "/")
        );
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-card">
                <div className="container mx-auto flex h-20 items-center px-4 md:px-6 max-w-6xl">
                    <Link to={getLocalizedPath("/")} className="font-semibold text-lg">
                        Aussie Penny Stocks
                    </Link>

                    {/* 桌面导航 */}
                    <div className="ml-auto hidden xl:flex items-center gap-2">
                        <NavigationMenu viewport={false}>
                            <NavigationMenuList>
                                {items.map((route) => {
                                    const label = route.translationKey
                                        ? t(route.translationKey)
                                        : route.label;
                                    const isActive = isActiveLink(route.path);

                                    return (
                                        <NavigationMenuItem key={route.path}>
                                            <NavigationMenuLink
                                                asChild
                                                className={
                                                    isActive
                                                        ? "bg-accent hover:bg-accent"
                                                        : "hover:bg-accent/40"
                                                }
                                            >
                                                <Link to={getLocalizedPath(route.path)}>{label}</Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    );
                                })}
                            </NavigationMenuList>
                        </NavigationMenu>
                        <ThemeToggle />
                        <LanguageToggle />
                    </div>

                    {/* 移动端导航 */}
                    <div className="ml-auto flex xl:hidden items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            aria-label="Toggle mobile menu"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMobileMenuOpen((prev) => !prev);
                            }}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-4 w-4" />
                            ) : (
                                <Menu className="h-4 w-4" />
                            )}
                        </Button>
                        <ThemeToggle />
                        <LanguageToggle />
                    </div>
                </div>
            </header>

            {/* 移动端菜单覆盖层 */}
            {isMobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="xl:hidden bg-card border-t border-b fixed top-20 left-0 right-0 z-40"
                >
                    <nav className="px-6 py-4 space-y-2">
                        {items.map((route) => {
                            const isActive = isActiveLink(route.path);
                            const label = route.translationKey
                                ? t(route.translationKey)
                                : route.label;
                            return (
                                <Link
                                    key={route.path}
                                    to={getLocalizedPath(route.path)}
                                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${isActive ? "bg-accent" : "hover:bg-accent/40"
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </>
    );
}
