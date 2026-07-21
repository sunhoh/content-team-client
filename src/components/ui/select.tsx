"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon } from "lucide-react"

const Select = SelectPrimitive.Root

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left text-sm text-[var(--_ink)]", className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  children,
  ...props
}: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex w-full cursor-pointer items-center justify-between rounded-2xl bg-[var(--_base)] px-4 py-3 text-sm outline-none select-none transition-all",
        "shadow-[var(--neu-inset)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-placeholder:text-[var(--_ink-faint)]",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className="pointer-events-none size-4 text-[var(--_ink-faint)] transition-transform duration-200 data-[popup-open]:rotate-180" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 8,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-[200]"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-hidden rounded-2xl scrollbar-none",
            "bg-[var(--_base)] shadow-[var(--neu-raised-sm)]",
            "p-1.5",
            "duration-150",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          {...props}
        >
          <SelectPrimitive.List className="scrollbar-none">{children}</SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-[var(--_ink-dim)] outline-none select-none transition-all",
        "hover:bg-[var(--_surface)] hover:text-[var(--_ink)]",
        "focus:bg-[var(--_surface)] focus:text-[var(--_ink)]",
        "data-highlighted:bg-[var(--_surface)] data-highlighted:text-[var(--_ink)]",
        "data-selected:text-[var(--_ink)] data-selected:font-medium",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="size-3.5 text-violet-500" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("my-1 h-px bg-[var(--_line-dim)]", className)}
      {...props}
    />
  )
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
