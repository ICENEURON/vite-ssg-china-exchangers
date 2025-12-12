import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "../../utils/cn"

interface AccordionContextType {
  type?: 'single' | 'multiple'
  collapsible?: boolean
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

const AccordionContext = React.createContext<AccordionContextType>({})

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple'
  collapsible?: boolean
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

function Accordion({
  type = 'single',
  collapsible = false,
  value,
  onValueChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    type === 'multiple' ? [] : ''
  )

  const currentValue = value !== undefined ? value : internalValue
  
  const handleValueChange = React.useCallback((newValue: string | string[]) => {
    if (onValueChange) {
      onValueChange(newValue)
    } else {
      setInternalValue(newValue)
    }
  }, [onValueChange])

  const contextValue = React.useMemo(() => ({
    type,
    collapsible,
    value: currentValue,
    onValueChange: handleValueChange
  }), [type, collapsible, currentValue, handleValueChange])

  return (
    <AccordionContext.Provider value={contextValue}>
      <div data-slot="accordion" className={className} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

function AccordionItem({
  value,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const { type, collapsible, value: accordionValue, onValueChange } = React.useContext(AccordionContext)
  
  const isOpen = React.useMemo(() => {
    if (type === 'multiple' && Array.isArray(accordionValue)) {
      return accordionValue.includes(value)
    }
    return accordionValue === value
  }, [accordionValue, value, type])

  const toggle = React.useCallback(() => {
    if (type === 'multiple' && Array.isArray(accordionValue)) {
      const newValue = isOpen 
        ? accordionValue.filter(v => v !== value)
        : [...accordionValue, value]
      onValueChange?.(newValue)
    } else {
      const newValue = isOpen && collapsible ? '' : value
      onValueChange?.(newValue)
    }
  }, [type, accordionValue, isOpen, value, collapsible, onValueChange])

  const itemContextValue = React.useMemo(() => ({
    isOpen,
    toggle
  }), [isOpen, toggle])

  return (
    <AccordionItemContext.Provider value={itemContextValue}>
      <div
        data-slot="accordion-item"
        className={cn("border-b last:border-b-0 py-1", className)}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

// 为 AccordionItem 创建单独的 Context
interface AccordionItemContextType {
  isOpen: boolean
  toggle: () => void
}

const AccordionItemContext = React.createContext<AccordionItemContextType>({
  isOpen: false,
  toggle: () => {}
})

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isOpen, toggle } = React.useContext(AccordionItemContext)

  return (
    <div className="flex">
      <button
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-center justify-between py-4 text-left text-md font-medium transition-all hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        onClick={toggle}
        aria-expanded={isOpen}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        {children}
        <ChevronDownIcon 
          className={cn(
            "h-l w-l shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
    </div>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = React.useContext(AccordionItemContext)

  return (
    <div
      data-slot="accordion-content"
      data-state={isOpen ? 'open' : 'closed'}
      className={cn(
        "grid overflow-hidden text-sm transition-all duration-300 ease-out",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
      {...props}
    >
      <div className={cn("overflow-hidden", isOpen ? "min-h-0" : "")}>
        <div className={cn("pb-2 pt-2", className)}>
          {children}
        </div>
      </div>
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
