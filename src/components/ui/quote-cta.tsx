import { Button, type ButtonProps } from "./button";

import { cn } from "../../utils/cn";

const QUOTE_CTA_CLASS = "bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-400 text-white font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 rounded-sm gap-2";

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