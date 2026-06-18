import { Button, type ButtonProps } from "./button";

import { cn } from "../../utils/cn";

export const QUOTE_CTA_CLASS = "bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white font-semibold shadow-sm shadow-primary/10 hover:shadow-md hover:shadow-primary/15 transition-all duration-300 hover:scale-105 rounded-sm gap-2";
export const QUOTE_SECONDARY_CTA_CLASS = "border border-primary/25 bg-white text-primary font-semibold shadow-sm shadow-primary/10 transition-all duration-200 hover:border-orange-500 hover:bg-orange-50 hover:text-primary hover:shadow-md hover:shadow-orange-500/10 rounded-sm gap-2";

function QuoteCta({
    className,
    ...props
}: ButtonProps) {
    return (
        <Button
            className={cn(QUOTE_CTA_CLASS, className)}
            {...props}
        />
    );
}

export { QuoteCta };
