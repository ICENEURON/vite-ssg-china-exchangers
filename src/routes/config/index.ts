import type { ComponentType } from "react"
import { createElement } from "react"
import { Navigate, useLocation } from "react-router-dom"

import HomePage from "../../pages/home"

import ManufacturersPage from "../../pages/manufacturers"
import ManufacturerProfilePage from "../../pages/manufacturers/company"

import ProductsPage from "../../pages/products"
import ProductProfilePage from "../../pages/products/product"

import FaqPage from "../../pages/rfq"

import AboutPage from "../../pages/about"
import DocsPage from "../../pages/claim-your-profile"
import ContentMarketingServicesPage from "../../pages/content-marketing-services"

import LoginPage from "../../pages/login"
import SignUpPage from "../../pages/register"
import DashboardPage from "../../app/dashboard"

import TermsPage from "../../pages/terms"
import PrivacyPage from "../../pages/privacy"
import NotFoundPage from "../../pages/404"

import BlogIndex from "../../pages/industry-news"
import BlogPost from "../../pages/industry-news/post"
import ContactPage from "../../pages/contact"
import { addLanguageToPath, getLanguageFromPath } from "../../utils/language-routing"

// import ComponentsPage from "../../pages/components"

export type Auth = "public" | "private"
export type NavGroup = "none" | "public" | "guest" | "auth"
export type MobileGroup = "none" | "public" | "guest" | "auth"

export type RouteDef = {
    path: string
    element: ComponentType
    auth: Auth
    nav: NavGroup
    mobile: MobileGroup
    label?: string
    translationKey?: string
}

function LegacyProfileRedirect() {
    const location = useLocation()
    const language = getLanguageFromPath(location.pathname)
    const targetPath = addLanguageToPath("/update-your-profile", language)

    return createElement(Navigate, {
        to: {
            pathname: targetPath,
            search: location.search,
            hash: location.hash,
        },
        replace: true,
    })
}


const blogEnvValue = import.meta.env.VITE_ENABLE_BLOG;
const enableBlog = blogEnvValue === "true";

const allRoutes: RouteDef[] = [
    { path: "/", element: HomePage, auth: "public", nav: "none", mobile: "none" },

    { path: "/manufacturers", element: ManufacturersPage, auth: "public", nav: "public", mobile: "public", label: "Manufacturers", translationKey: "navigation.menu.manufacturers" },
    { path: "/manufacturers/:slug", element: ManufacturerProfilePage, auth: "public", nav: "none", mobile: "none" },

    { path: "/products", element: ProductsPage, auth: "public", nav: "none", mobile: "none", label: "Products", translationKey: "navigation.menu.products" },
    { path: "/products/:manufacturerSlug/:productSlug", element: ProductProfilePage, auth: "public", nav: "none", mobile: "none" },

    { path: "/rfq", element: FaqPage, auth: "public", nav: "none", mobile: "public", label: "Request for Quote", translationKey: "navigation.menu.rfq" },

    { path: "/update-your-profile", element: DocsPage, auth: "public", nav: "public", mobile: "public", label: "Update Your Profile", translationKey: "navigation.menu.profile" },
    { path: "/claim-your-profile", element: LegacyProfileRedirect, auth: "public", nav: "none", mobile: "none", label: "Legacy Profile Redirect" },

    { path: "/content-marketing-services", element: ContentMarketingServicesPage, auth: "public", nav: "none", mobile: "public", label: "Submit Articles", translationKey: "navigation.menu.content_marketing_services" },

    { path: "/about", element: AboutPage, auth: "public", nav: "public", mobile: "public", label: "About", translationKey: "navigation.menu.about" },

    // Blog routes
    ...(enableBlog ? [
        { path: "/industry-news", element: BlogIndex, auth: "public", nav: "public", mobile: "public", label: "Industry News", translationKey: "navigation.menu.industry-news" },
        { path: "/industry-news/:slug", element: BlogPost, auth: "public", nav: "none", mobile: "none" },
    ] as RouteDef[] : []),

    { path: "/contact", element: ContactPage, auth: "public", nav: "public", mobile: "public", label: "Contact Us", translationKey: "navigation.menu.contact" },

    { path: "/login", element: LoginPage, auth: "public", nav: "guest", mobile: "guest", label: "Login", translationKey: "navigation.menu.login" },
    { path: "/register", element: SignUpPage, auth: "public", nav: "guest", mobile: "guest", label: "Register", translationKey: "navigation.menu.register" },
    { path: "/dashboard", element: DashboardPage, auth: "private", nav: "auth", mobile: "auth", label: "Dashboard", translationKey: "navigation.menu.dashboard" },

    { path: "/terms", element: TermsPage, auth: "public", nav: "none", mobile: "none", label: "Terms", translationKey: "navigation.menu.terms" },
    { path: "/privacy", element: PrivacyPage, auth: "public", nav: "none", mobile: "none", label: "Privacy", translationKey: "navigation.menu.privacy" },
    { path: "*", element: NotFoundPage, auth: "public", nav: "none", mobile: "none", label: "NotFound" },
]

export const ROUTES = allRoutes;