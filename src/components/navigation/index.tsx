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
import { NavPopup, ListItem } from "./nav-popup";

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

                                    // Docs Menu
                                    if (route.path === '/docs') {
                                        return (
                                            <NavPopup key={route.path} label={label || ''} isActive={isActive} className="right-0">
                                                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                                    <li className="row-span-3">
                                                        <NavigationMenuLink asChild>
                                                            <Link
                                                                className="from-muted/50 to-muted flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none focus:shadow-md"
                                                                to={getLocalizedPath("/docs")}
                                                            >
                                                                <div className="mb-2 mt-4 text-lg font-medium">
                                                                    Documentation
                                                                </div>
                                                                <p className="text-sm leading-tight text-muted-foreground">
                                                                    Complete guides and API references for building amazing applications.
                                                                </p>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                    <ListItem href={getLocalizedPath("/docs")} title="Getting Started">
                                                        Learn how to set up and configure your project.
                                                    </ListItem>
                                                    <ListItem href={getLocalizedPath("/docs") + "#installation"} title="Installation">
                                                        Step-by-step installation guide and requirements.
                                                    </ListItem>
                                                    <ListItem href={getLocalizedPath("/docs") + "#api"} title="API Reference">
                                                        Complete API documentation and examples.
                                                    </ListItem>
                                                </ul>
                                            </NavPopup>
                                        );
                                    }

                                    // Components Menu
                                    if (route.path === '/components') {
                                        return (
                                            <NavPopup key={route.path} label={label || ''} isActive={isActive} className="right-0">
                                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                    <ListItem href={getLocalizedPath("/components")} title="All Components">
                                                        Complete showcase of all available UI components.
                                                    </ListItem>
                                                    <ListItem href={getLocalizedPath("/components") + "#badge"} title="Badge">
                                                        Display labels, status indicators, and small pieces of information.
                                                    </ListItem>
                                                    <ListItem href={getLocalizedPath("/components") + "#accordion"} title="Accordion">
                                                        Collapsible content areas for organizing information.
                                                    </ListItem>
                                                    <ListItem href={getLocalizedPath("/components") + "#card"} title="Card">
                                                        Flexible containers for grouping and organizing content.
                                                    </ListItem>
                                                    <ListItem href={getLocalizedPath("/components") + "#carousel"} title="Carousel">
                                                        Interactive slideshows for cycling through elements.
                                                    </ListItem>
                                                    <ListItem href={getLocalizedPath("/components") + "#tabs"} title="Tabs">
                                                        Organize content into separate views that users can switch between.
                                                    </ListItem>
                                                    <ListItem href={getLocalizedPath("/components") + "#table"} title="Table">
                                                        Display structured data in rows and columns.
                                                    </ListItem>
                                                </ul>
                                            </NavPopup>
                                        );
                                    }

                                    // About Menu
                                    if (route.path === '/about') {
                                        return (
                                            <NavPopup key={route.path} label={label || ''} isActive={isActive} className="right-0">
                                                <ul className="grid w-[300px] gap-3 p-3">
                                                    <ListItem href={getLocalizedPath("/about")} title="Technology Stack">
                                                        Learn about our modern development stack and tools.
                                                    </ListItem>
                                                    <ListItem href={getLocalizedPath("/about") + "#team"} title="Our Team">
                                                        Meet the people behind this amazing project.
                                                    </ListItem>
                                                    <ListItem href={getLocalizedPath("/about") + "#mission"} title="Mission">
                                                        Our vision and goals for the future of development.
                                                    </ListItem>
                                                    <ListItem href={getLocalizedPath("/about") + "#features"} title="Features">
                                                        Explore all the amazing features we offer.
                                                    </ListItem>
                                                    <ListItem href={getLocalizedPath("/about") + "#contact"} title="Contact">
                                                        Get in touch with our team for support or questions.
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
