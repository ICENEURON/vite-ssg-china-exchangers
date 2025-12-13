/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-4 transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 dark:hover:bg-destructive/80",
        outline:
          "border border-border bg-background hover:bg-accent/80 hover:text-accent-foreground dark:bg-background dark:border-border dark:hover:bg-accent/80 dark:hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:hover:bg-secondary/70",
        ghost:
          "hover:bg-accent/40 hover:text-accent-foreground dark:hover:bg-accentdark:hover:text-accent-foreground",
        nonbackground: "bg-transparent transition-colors hover:text-accent dark:hover:text-accent",
        link: "text-primary underline-offset-4 hover:underline dark:hover:text-primary/80",
      },
      size: {
        default: "rounded-sm px-4 py-2",
        sm: "rounded-sm gap-1 px-2 py-1",
        lg: "rounded-sm px-6 py-4",
        icon: "size-8",
        "icon-sm": "size-6",
        "icon-lg": "size-[calc(8*1.25)]",
        navigation: "px-3 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      style={{
        fontSize: 16,
        fontWeight: 400,
      }}
      {...props}
    />
  );
}

export { Button, buttonVariants };
