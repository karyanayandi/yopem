import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

export const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => {
  return <nav ref={ref} aria-label="breadcrumb" {...props} />
})

export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>((props, ref) => {
  const { className, ...rest } = props
  return (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className,
      )}
      {...rest}
    />
  )
})

export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>((props, ref) => {
  const { className, ...rest } = props

  return (
    <li
      ref={ref}
      className={cn("inline-flex items-center gap-1.5", className)}
      {...rest}
    />
  )
})

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>((props, ref) => {
  const { asChild, className, ...rest } = props

  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...rest}
    />
  )
})

export const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>((props, ref) => {
  const { className, ...rest } = props

  return (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...rest}
    />
  )
})

export const BreadcrumbSeparator = (props: React.ComponentProps<"li">) => {
  const { children, className, ...rest } = props

  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...rest}
    >
      {children ?? <Icon.ChevronRight />}
    </li>
  )
}

export const BreadcrumbEllipsis = (props: React.ComponentProps<"span">) => {
  const { className, ...rest } = props

  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...rest}
    >
      <Icon.MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More</span>
    </span>
  )
}
