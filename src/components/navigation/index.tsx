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
import { cn } from "../../utils/cn";
import { Button } from "../ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "../ui/navigation-menu";
import { NavPopup, ListItem } from "./nav-popup";

export function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation("translation");
    const { user, signOut } = useAuth();
    const currentLanguage = useCurrentLanguage();
    const location = useLocation();

    // 检查认证标志
    const authEnvValue = import.meta.env.VITE_ENABLE_AUTH;
    const enableAuth = authEnvValue === "true";

    // 检查主题切换标志
    const themeEnvValue = import.meta.env.VITE_ENABLE_THEME_TOGGLE;
    const enableThemeToggle = themeEnvValue === "true";

    // 检查语言切换标志
    const languageEnvValue = import.meta.env.VITE_ENABLE_LANGUAGE_TOGGLE;
    const enableLanguageToggle = languageEnvValue === "true";

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

    const mobilePublicItems = ROUTES.filter((r) => r.mobile === "public");
    const mobileGuestItems = ROUTES.filter((r) => r.mobile === "guest");
    const mobileAuthItems = ROUTES.filter((r) => r.mobile === "auth");

    const leftItems = publicItems;
    const rightItems = enableAuth ? (user ? authItems : guestItems) : [];

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

    const renderNavItems = (routes: typeof ROUTES) => {
        return routes.map((route) => {
            const label = route.translationKey
                ? t(route.translationKey)
                : route.label;
            const isActive = isActiveLink(route.path);

            // Guest Items (Login/Register) as Buttons
            if (route.nav === 'guest') {
                return (
                    <NavigationMenuItem key={route.path}>
                        <div className={cn(
                            "inline-flex",
                            isActive && route.path === '/login' ? "text-accent-foreground border-b-2 border-primary rounded-none" : ""
                        )}>
                            <Button
                                variant={route.path === '/login' ? "navigation" : "default"}
                                asChild
                                className={cn("rounded-none")}
                            >
                                <Link to={getLocalizedPath(route.path)}>
                                    {label}
                                </Link>
                            </Button>
                        </div>
                    </NavigationMenuItem>
                );
            }

            // Auth Items (Dashboard) as Buttons
            if (route.nav === 'auth') {
                return (
                    <NavigationMenuItem key={route.path}>
                        <div className={cn(
                            "inline-flex",
                            isActive && route.path === '/dashboard' ? "text-accent-foreground border-b-2 border-primary rounded-none" : ""
                        )}>
                            <Button
                                variant="navigation"
                                asChild
                                className={cn("rounded-none")}
                            >
                                <Link to={getLocalizedPath(route.path)}>
                                    {label}
                                </Link>
                            </Button>
                        </div>
                    </NavigationMenuItem>
                );
            }

            // Manufacturers
            if (route.path === '/manufacturers') {
                return (
                    <NavPopup key={'route.path'} label={'For Buyers'} isActive={isActive} className="left-0">
                        <ul className="grid gap-3 p-2 w-[450px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-2">
                                <NavigationMenuLink asChild className="py-2">
                                    <Link
                                        className="from-muted/50 to-muted flex h-full w-full select-none flex-col justify-start bg-gradient-to-b no-underline outline-none focus:shadow-md hover:text-foreground"
                                        to={getLocalizedPath("/manufacturers")}
                                    >
                                        <div className="text-lg font-medium">
                                            {t('navigation.menu.manufacturers')}
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            {t('navigation.menu.manufacturers_details')}
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href={getLocalizedPath("/rfq")} title={t('navigation.menu.rfq')} className="py-3">
                                {t('navigation.menu.rfq_details')}
                            </ListItem>
                        </ul>
                    </NavPopup>
                );
            }

            // Components Menu
            if (route.path === '/claim-your-profile') {
                return (
                    <NavPopup key={route.path} label={'For Manufacturers'} isActive={isActive} className="left-0">
                        <ul className="grid w-[250px] gap-3 p-2">
                            <ListItem href={getLocalizedPath("/claim-your-profile")} title={t('navigation.menu.profile')} className="py-3">
                            </ListItem>
                            <ListItem href={getLocalizedPath("/content-marketing-services")} title={t('navigation.menu.content_marketing_services')} className="py-3">
                            </ListItem>
                        </ul>
                    </NavPopup>
                );
            }

            return (
                <NavigationMenuItem key={route.path}>
                    <NavigationMenuLink
                        asChild
                        className={
                            isActive
                                ? "border-b-2 border-accent text-foreground hover:text-foreground whitespace-nowrap"
                                : "border-b-2 border-transparent text-foreground hover:bg-accent/40 hover:text-foreground whitespace-nowrap"
                        }
                    >
                        <Link to={getLocalizedPath(route.path)}>{label}</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            );
        });
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-card">
                <div className="container mx-auto flex h-20 items-center px-4 md:px-6 max-w-8xl">
                    <Link to={getLocalizedPath("/")} className="font-semibold text-lg mr-6">
                        {t('navigation.logo')}
                    </Link>

                    {/* Left Navigation (Desktop) */}
                    <div className="hidden xl:flex items-center gap-2">
                        <NavigationMenu viewport={false}>
                            <NavigationMenuList>
                                {renderNavItems(leftItems)}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Right Navigation (Desktop) */}
                    <div className="ml-auto hidden xl:flex items-center gap-2">
                        <NavigationMenu viewport={false}>
                            <NavigationMenuList>
                                {renderNavItems(rightItems)}
                                {enableAuth && user && (
                                    <NavigationMenuItem>
                                        <Button
                                            variant="destructive"
                                            onClick={() => signOut()}
                                        >
                                            {t('navigation.menu.logout')}
                                        </Button>
                                    </NavigationMenuItem>
                                )}
                            </NavigationMenuList>
                        </NavigationMenu>
                        {enableThemeToggle && <ThemeToggle />}
                        {enableLanguageToggle && <LanguageToggle />}
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
                        {enableThemeToggle && <ThemeToggle />}
                        {enableLanguageToggle && <LanguageToggle />}
                    </div>
                </div>
            </header>

            {/* 移动端菜单覆盖层 */}
            {isMobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="xl:hidden bg-card border-t border-b fixed top-20 left-0 right-0 z-40"
                >
                    <nav className="p-6 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            {mobilePublicItems.map((route) => {
                                const isActive = isActiveLink(route.path);
                                const translationKey = route.translationKey;
                                const label = translationKey
                                    ? t(translationKey)
                                    : route.label;

                                return (
                                    <Link
                                        key={route.path}
                                        to={getLocalizedPath(route.path)}
                                        className={`block px-3 py-2 text-sm transition-colors ${isActive ? "bg-accent/60 text-foreground" : "hover:bg-accent/30 text-foreground"
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile Guest Buttons */}
                        {enableAuth && !user && mobileGuestItems.length > 0 && (
                            <div className="flex flex-row gap-4 pt-4 border-t border-border/80">
                                {mobileGuestItems.map((route) => {
                                    const label = route.translationKey
                                        ? t(route.translationKey)
                                        : route.label;
                                    return (
                                        <Button
                                            key={route.path}
                                            variant={route.path === '/login' ? "ghost" : "default"}
                                            asChild
                                            className="justify-center"
                                        >
                                            <Link
                                                to={getLocalizedPath(route.path)}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {label}
                                            </Link>
                                        </Button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Mobile Auth Buttons */}
                        {enableAuth && user && (
                            <div className="flex flex-row gap-4 pt-4 border-t border-border/80">
                                {mobileAuthItems.map((route) => {
                                    const label = route.translationKey
                                        ? t(route.translationKey)
                                        : route.label;
                                    return (
                                        <Button
                                            key={route.path}
                                            variant="default"
                                            asChild
                                        >
                                            <Link
                                                to={getLocalizedPath(route.path)}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {label}
                                            </Link>
                                        </Button>
                                    );
                                })}
                                <Button
                                    variant="destructive"

                                    onClick={() => {
                                        signOut();
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    {t('navigation.menu.logout')}
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </>
    );
}
