import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ClipboardPenLine, Factory, FileText, Mail, Menu, PackageSearch, X } from "lucide-react";
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
import { QuoteCta } from "../ui/quote-cta";
import { RfqLink } from "../../utils/rfq-routing/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "../ui/navigation-menu";
import { NavPopup, ListItem } from "./nav-popup";
import logoLight from "../../assets/logos/logo_new.png";

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

    const publicItems = ROUTES.filter((r) => r.nav === "public" && r.path !== "/quote-request");
    const guestItems = ROUTES.filter((r) => r.nav === "guest");
    const authItems = ROUTES.filter((r) => r.nav === "auth");

    const mobilePublicItems = ROUTES.filter((r) => (r.mobile === "public" && r.path !== "/quote-request") || r.path === "/products");
    const mobileGuestItems = ROUTES.filter((r) => r.mobile === "guest");
    const mobileAuthItems = ROUTES.filter((r) => r.mobile === "auth");

    const rfqRoute = ROUTES.find((r) => r.path === "/quote-request");

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
                            isActive && route.path === '/login' ? "text-navbar-foreground border-b-2 border-accent rounded-none" : ""
                        )}>
                            <Button
                                variant={route.path === '/login' ? "navigation" : "default"}
                                asChild
                                className={cn(
                                    "rounded-none",
                                    route.path === '/login' ? "text-navbar-foreground hover:text-navbar-foreground hover:bg-accent/40" : ""
                                )}
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
                            isActive && route.path === '/dashboard' ? "text-navbar-foreground border-b-2 border-accent rounded-none" : ""
                        )}>
                            <Button
                                variant="navigation"
                                asChild
                                className={cn("rounded-none text-navbar-foreground hover:text-navbar-foreground")}
                            >
                                <Link to={getLocalizedPath(route.path)}>
                                    {label}
                                </Link>
                            </Button>
                        </div>
                    </NavigationMenuItem>
                );
            }

            // Buyers Menu
            if (route.path === '/manufacturers') {
                const isBuyersActive = isActiveLink('/manufacturers') || isActiveLink('/products');
                return (
                    <NavPopup key={route.path} label={t('navigation.menu.for_buyers_label')} isActive={isBuyersActive} className="left-0">
                        <ul className="flex w-[220px] flex-col gap-2">
                            <ListItem href={getLocalizedPath("/manufacturers")} title={t('navigation.menu.manufacturers')} icon={<Factory className="h-4 w-4" />} />
                            <ListItem href={getLocalizedPath("/products")} title={t('navigation.menu.products')} icon={<PackageSearch className="h-4 w-4" />} />
                        </ul>
                    </NavPopup>
                );
            }

            // Components Menu
            if (route.path === '/update-your-profile') {
                const isProfileActive = isActiveLink('/update-your-profile') || isActiveLink('/content-marketing-services');
                return (
                    <NavPopup key={route.path} label={t('navigation.menu.for_manufacturers_label')} isActive={isProfileActive} className="left-0">
                        <ul className="flex w-[240px] flex-col gap-2">
                            <ListItem href={getLocalizedPath("/update-your-profile")} title={t('navigation.menu.profile')} icon={<ClipboardPenLine className="h-4 w-4" />}>
                            </ListItem>
                            <ListItem href={getLocalizedPath("/content-marketing-services")} title={t('navigation.menu.content_marketing_services')} icon={<FileText className="h-4 w-4" />}>
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
                                ? "border-b-2 border-accent !text-navbar-foreground hover:!text-navbar-foreground whitespace-nowrap"
                                : "border-b-2 border-transparent !text-navbar-foreground hover:bg-accent/40 hover:!text-navbar-foreground whitespace-nowrap"
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
            <header className="fixed top-0 left-0 right-0 z-50 bg-navbar border-b border-border/20">
                <div className="container mx-auto flex h-20 items-center px-4 md:px-6 max-w-8xl">
                    <Link to={getLocalizedPath("/")} className="mr-6 flex items-center">
                        <img src={logoLight} alt={t('navigation.logo')} className="h-10 w-auto" />
                    </Link>

                    {/* Left Navigation (Desktop) */}
                    <div className="hidden xl:flex items-center gap-2 text-navbar-foreground">
                        <NavigationMenu viewport={false}>
                            <NavigationMenuList>
                                {renderNavItems(leftItems)}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Right Navigation (Desktop) */}
                    <div className="ml-auto hidden xl:flex items-center gap-2 text-navbar-foreground">
                        <NavigationMenu viewport={false}>
                            <NavigationMenuList>
                                {rfqRoute && (
                                    <NavigationMenuItem key={rfqRoute.path}>
                                        <QuoteCta
                                            asChild
                                            size="sm"
                                            className={cn("px-5", isActiveLink(rfqRoute.path) && "ring-2 ring-white/50")}
                                        >
                                            <RfqLink>
                                                <Mail className="w-4 h-4" />
                                                {rfqRoute.translationKey ? t(rfqRoute.translationKey) : rfqRoute.label}
                                            </RfqLink>
                                        </QuoteCta>
                                    </NavigationMenuItem>
                                )}
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
                            className="h-8 w-8 p-0 text-navbar-foreground hover:text-navbar-foreground"
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
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 top-20 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 xl:hidden",
                    isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sliding Panel */}
            <div
                ref={mobileMenuRef}
                className={cn(
                    "xl:hidden bg-navbar fixed top-20 left-0 right-0 bottom-0 z-40 flex flex-col transition-transform duration-300 ease-in-out border-t border-border/20",
                    isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
                )}
            >
                {/* Scrollable Nav Content */}
                <nav className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 w-full" onClick={() => {}}>
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
                                    className={`block px-4 py-3 text-lg font-medium rounded-xl transition-colors ${isActive ? "bg-accent/60 text-navbar-foreground" : "hover:bg-accent/30 text-navbar-foreground"
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {label}
                                </Link>
                            );
                        })}

                        {/* Mobile CTA Button */}
                        {rfqRoute && (
                            <QuoteCta
                                asChild
                                size="lg"
                                className="mt-4 px-5 py-4 text-lg"
                            >
                                <RfqLink
                                    key={rfqRoute.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Mail className="w-5 h-5" />
                                    {rfqRoute.translationKey ? t(rfqRoute.translationKey) : rfqRoute.label}
                                </RfqLink>
                            </QuoteCta>
                        )}
                    </div>

                    {/* Mobile Guest Buttons */}
                    {enableAuth && !user && mobileGuestItems.length > 0 && (
                        <div className="flex flex-col gap-3 pt-6 border-t border-border/20 mt-auto pb-8">
                            {mobileGuestItems.map((route) => {
                                const label = route.translationKey
                                    ? t(route.translationKey)
                                    : route.label;
                                return (
                                    <Button
                                        key={route.path}
                                        variant={route.path === '/login' ? "outline" : "default"}
                                        size="lg"
                                        asChild
                                        className={cn(
                                            "justify-center w-full text-lg h-14 rounded-xl",
                                            route.path === '/login' ? "text-navbar-foreground hover:text-navbar-foreground hover:bg-accent/30 border-navbar-foreground/20" : ""
                                        )}
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
                        <div className="flex flex-col gap-3 pt-6 border-t border-border/20 mt-auto pb-8">
                            {mobileAuthItems.map((route) => {
                                const label = route.translationKey
                                    ? t(route.translationKey)
                                    : route.label;
                                return (
                                    <Button
                                        key={route.path}
                                        variant="default"
                                        size="lg"
                                        asChild
                                        className="w-full text-lg h-14 rounded-xl"
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
                                size="lg"
                                className="w-full text-lg h-14 rounded-xl mt-2"
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
        </>
    );
}
