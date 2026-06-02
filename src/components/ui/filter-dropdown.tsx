import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "../../utils/cn";

interface FilterDropdownTriggerProps {
  type: "button";
  "aria-expanded": boolean;
  "aria-haspopup": "menu";
  onClick: () => void;
}

interface FilterDropdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: (props: { open: boolean; triggerProps: FilterDropdownTriggerProps }) => ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function FilterDropdown({
  open,
  onOpenChange,
  trigger,
  children,
  className,
  contentClassName,
}: FilterDropdownProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const openedTopRef = useRef(0);
  const filterHeightRef = useRef(0);

  useEffect(() => {
    if (!open) return;

    const openedRect = rootRef.current?.getBoundingClientRect();
    openedTopRef.current = openedRect?.top ?? 0;
    filterHeightRef.current = openedRect?.height || 40;

    const closeDropdown = () => onOpenChange(false);
    const handleWindowScroll = () => {
      const currentTop = rootRef.current?.getBoundingClientRect().top ?? openedTopRef.current;
      const movementThreshold = filterHeightRef.current * 4;

      if (Math.abs(currentTop - openedTopRef.current) < movementThreshold) return;

      closeDropdown();
    };
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDropdown();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleWindowScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, [onOpenChange, open]);

  return (
    <div
      ref={rootRef}
      className={cn("relative", className)}
    >
      {trigger({
        open,
        triggerProps: {
          type: "button",
          "aria-expanded": open,
          "aria-haspopup": "menu",
          onClick: () => onOpenChange(!open),
        },
      })}

      {open && (
        <div className="absolute left-0 top-full z-50 pt-2">
          <div
            className={cn(
              "overflow-hidden rounded-sm border border-border/50 bg-card shadow-xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200",
              contentClassName
            )}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
