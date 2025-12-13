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
    React.ComponentPropsWithoutRef<"a"> & { title: string; href: string }
>(({ className, title, children, href, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    to={href}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
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
                        ? "bg-transparent border-b-2 border-accent rounded-none text-accent-foreground data-[state=open]:bg-transparent whitespace-nowrap"
                        : "border-b-2 border-transparent hover:bg-accent/40 whitespace-nowrap"
                }
                onClick={(e) => e.preventDefault()}
            >
                {label}
            </NavigationMenuTrigger>
            <NavigationMenuContent className={className}>
                {children}
            </NavigationMenuContent>
        </NavigationMenuItem>
    )
}
