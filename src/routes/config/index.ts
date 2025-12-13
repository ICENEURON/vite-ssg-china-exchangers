import type { ComponentType } from "react"

import HomePage from "../../pages/home"

import ManufacturersPage from "../../pages/manufacturers"
import FaqPage from "../../pages/rfq"
import ProductsPage from "../../pages/products"

import AboutPage from "../../pages/about"
import DocsPage from "../../pages/claim-your-profile"
import ContentMarketingServicesPage from "../../pages/content-marketing-services"

import LoginPage from "../../pages/login"
import SignUpPage from "../../pages/signup"
import DashboardPage from "../../app/dashboard"

import TermsPage from "../../pages/terms"
import PrivacyPage from "../../pages/privacy"
import NotFoundPage from "../../pages/404"

import BlogIndex from "../../pages/industry-news"
import BlogPost from "../../pages/industry-news/post"

// import ComponentsPage from "../../pages/components"

export type Auth = "public" | "private"
export type NavGroup = "none" | "public" | "guest" | "auth"

export type RouteDef = {
    path: string
    element: ComponentType
    auth: Auth
    nav: NavGroup
    label?: string
    translationKey?: string
}


const blogEnvValue = import.meta.env.VITE_ENABLE_BLOG;
const enableBlog = blogEnvValue === "true";

const allRoutes: RouteDef[] = [
    { path: "/", element: HomePage, auth: "public", nav: "none" },

    { path: "/manufacturers", element: ManufacturersPage, auth: "public", nav: "public", label: "For Buyers", translationKey: "navigation.menu.for_buyers_label" },
    { path: "/rfq", element: FaqPage, auth: "public", nav: "none", label: "RFQ", translationKey: "navigation.menu.rfq" },
    { path: "/products", element: ProductsPage, auth: "public", nav: "none", label: "Products", translationKey: "navigation.menu.products" },

    { path: "/claim-your-profile", element: DocsPage, auth: "public", nav: "public", label: "Docs", translationKey: "navigation.menu.for_manufacturers_label" },

    { path: "/content-marketing-services", element: ContentMarketingServicesPage, auth: "public", nav: "none", label: "Content Marketing" },

    { path: "/about", element: AboutPage, auth: "public", nav: "public", label: "About", translationKey: "navigation.menu.about" },

    // { path: "/components", element: ComponentsPage, auth: "public", nav: "public", label: "Components", translationKey: "navigation.menu.components" },

    // Blog routes
    ...(enableBlog ? [
        { path: "/industry-news", element: BlogIndex, auth: "public", nav: "public", label: "Industry News", translationKey: "navigation.menu.industry-news" },
        { path: "/industry-news/:slug", element: BlogPost, auth: "public", nav: "none" },
    ] as RouteDef[] : []),

    { path: "/login", element: LoginPage, auth: "public", nav: "guest", label: "Login", translationKey: "navigation.menu.login" },
    { path: "/signup", element: SignUpPage, auth: "public", nav: "guest", label: "Sign up", translationKey: "navigation.menu.signup" },
    { path: "/dashboard", element: DashboardPage, auth: "private", nav: "auth", label: "Dashboard", translationKey: "navigation.menu.dashboard" },

    { path: "/terms", element: TermsPage, auth: "public", nav: "none", label: "Terms", translationKey: "navigation.menu.terms" },
    { path: "/privacy", element: PrivacyPage, auth: "public", nav: "none", label: "Privacy", translationKey: "navigation.menu.privacy" },
    { path: "*", element: NotFoundPage, auth: "public", nav: "none", label: "NotFound" },
]

export const ROUTES = allRoutes;