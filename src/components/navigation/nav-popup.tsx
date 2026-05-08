import * as React from "react"
import { Link } from "react-router-dom"
import {
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
} from "../ui/navigation-menu"
import { cn } from "../../utils/cn"

export const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { title: string; href: string; icon?: React.ReactNode }
>(({ className, title, children, href, icon, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    to={href}
                    className={cn(
                        "block select-none px-3 py-2 text-left leading-none no-underline outline-none transition-colors hover:bg-accent/40 hover:text-navbar-foreground focus:bg-accent/70 focus:text-navbar-foreground rounded-none",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-center gap-2 text-sm font-medium leading-none text-navbar-foreground">
                        {icon && <span className="flex h-5 w-5 shrink-0 items-center justify-center text-navbar-foreground/80">{icon}</span>}
                        <span>{title}</span>
                    </div>
                    {children && (
                        <p className="line-clamp-2 text-sm leading-snug text-navbar-foreground/70">
                            {children}
                        </p>
                    )}
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"

interface NavPopupProps {
    label: string
    isActive?: boolean
    children: React.ReactNode
    className?: string
}

export function NavPopup({ label, isActive, children, className }: NavPopupProps) {
    return (
        <NavigationMenuItem>
            <NavigationMenuTrigger
                hasContent
                className={
                    isActive
                        ? "border-b-2 border-accent !text-navbar-foreground hover:!text-navbar-foreground data-[state=open]:!text-navbar-foreground whitespace-nowrap"
                        : "border-b-2 border-transparent !text-navbar-foreground hover:bg-accent/40 hover:!text-navbar-foreground data-[state=open]:!text-navbar-foreground whitespace-nowrap"
                }
                onClick={(e) => e.preventDefault()}
            >
                {label}
            </NavigationMenuTrigger>
            <NavigationMenuContent className={cn("pt-2", className)}>
                {children}
            </NavigationMenuContent>
        </NavigationMenuItem>
    )
}
