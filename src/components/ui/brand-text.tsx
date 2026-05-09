import { Fragment } from "react";

interface BrandTextProps {
    text: string;
    directClassName?: string;
    nameClassName?: string;
}

export function BrandText({
    text,
    directClassName = "text-orange-500",
    nameClassName = "font-bold",
}: BrandTextProps) {
    const parts = text.split("HeatEx Direct");

    return (
        <>
            {parts.map((part, index) => (
                <Fragment key={`${part}-${index}`}>
                    {index > 0 ? (
                        <span className={nameClassName}>
                            HeatEx <span className={directClassName}>Direct</span>
                        </span>
                    ) : null}
                    {part}
                </Fragment>
            ))}
        </>
    );
}