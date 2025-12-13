/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "../../utils/cn"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {
    viewport?: boolean
  }
>(({ className, children, viewport = true, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    data-viewport={viewport}
    className={cn(
      "group/navigation-menu relative z-10 flex flex-1 items-center justify-center gap-2",
      className
    )}
    {...props}
  >
    {children}
    {viewport && <NavigationMenuViewport />}
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center gap-2",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

function NavigationMenuItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  // 判断 children 是否包含 NavigationMenuContent
  const childrenArray = React.Children.toArray(children);
  const autoHasContent = childrenArray.some(child => {
    if (React.isValidElement(child) && child.type && typeof child.type !== 'string') {
      return ((child.type as { displayName?: string }).displayName) === 'NavigationMenuContent';
    }
    return false;
  });
  // 遍历 children，将 hasContent 传递给 NavigationMenuTrigger（优先使用 props 里的 hasContent）
  const enhancedChildren = childrenArray.map(child => {
    if (
      React.isValidElement(child) &&
      child.type &&
      typeof child.type !== 'string' &&
      ((child.type as { displayName?: string }).displayName) === 'NavigationMenuTrigger'
    ) {
      // 如果 child.props.hasContent 已经定义，则优先用它，否则用自动判断
      const hasContent = child.props.hasContent !== undefined ? child.props.hasContent : autoHasContent;
      return React.cloneElement(child, { hasContent });
    }
    return child;
  });
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    >
      {enhancedChildren}
    </NavigationMenuPrimitive.Item>
  );
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex min-h-4 w-max items-center justify-center rounded-m bg-card px-4 py-2 text-sm font-medium hover:text-foreground focus:text-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-foreground focus-visible:ring-ring outline-none transition-[color,box-shadow] focus-visible:ring-[2px] focus-visible:outline-1"
)

function NavigationMenuTrigger({
  className,
  children,
  hasContent,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger> & { hasContent?: boolean }) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}
      {hasContent && (
        <ChevronDownIcon
          className="relative top-[1px] m-1 size-4 transition duration-200 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      )}
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 w-full p-2 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-card group-data-[viewport=false]/navigation-menu:text-card-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-2 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-none group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:border-border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-100 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className
      )}
      {...props}
    />
  )
}

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className="absolute top-full left-0 flex justify-center w-full">
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center bg-card text-card-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-4 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-none border border-border shadow md:w-8",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "data-[active=true]:text-foreground hover:bg-accent/40 hover:text-foreground focus:text-foreground focus-visible:ring-ring[&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-2 rounded-m px-4 py-2 text-sm transition-all outline-none focus-visible:ring-[2px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-sm",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="bg-border/40 relative top-[60%] h-4 w-4 rotate-45 rounded-tl-m shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
