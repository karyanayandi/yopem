import * as React from "react"
import NextLink from "next/link"

import {
  Button,
  buttonVariants,
  type ButtonProps,
} from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icon } from "./icon"

export const Pagination = (props: React.ComponentProps<"nav">) => {
  const { className, ...rest } = props
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...rest}
    />
  )
}

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>((props, ref) => {
  const { className, ...rest } = props

  return (
    <ul
      ref={ref}
      className={cn("flex flex-row items-center gap-1", className)}
      {...rest}
    />
  )
})

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>((props, ref) => {
  const { className, ...rest } = props

  return <li ref={ref} className={cn("", className)} {...rest} />
})

type PaginationButtonProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<typeof Button>

export const PaginationButton = (props: PaginationButtonProps) => {
  const { className, isActive, size = "icon", ...rest } = props

  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      className={cn(className)}
      variant={isActive ? "outline" : "ghost"}
      size={size}
      {...rest}
    />
  )
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<typeof NextLink>

export const PaginationLink = (props: PaginationLinkProps) => {
  const { className, isActive, size = "icon", ...rest } = props

  return (
    <NextLink
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className,
      )}
      {...rest}
    />
  )
}

type PaginationPrevieousButtonProps = Omit<PaginationButtonProps, "children">

export const PaginationPreviousButton = (
  props: PaginationPrevieousButtonProps,
) => {
  const { className, ...rest } = props

  return (
    <PaginationButton
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...rest}
    >
      <Icon.ChevronLeft className="size-4" />
    </PaginationButton>
  )
}

type PaginationNextButtonProps = Omit<PaginationButtonProps, "children">

export const PaginationNextButton = (props: PaginationNextButtonProps) => {
  const { className, ...rest } = props

  return (
    <PaginationButton
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...rest}
    >
      <Icon.ChevronRight className="size-4" />
    </PaginationButton>
  )
}

type PaginationFirstButtonProps = Omit<PaginationButtonProps, "children">

export const PaginationFirstButton = (props: PaginationFirstButtonProps) => {
  const { className, ...rest } = props

  return (
    <PaginationButton
      aria-label="Go to first page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...rest}
    >
      <Icon.ChevronsLeft className="size-4" />
    </PaginationButton>
  )
}

type PaginationLastButtonProps = Omit<PaginationButtonProps, "children">

export const PaginationLastButton = (props: PaginationLastButtonProps) => {
  const { className, ...rest } = props

  return (
    <PaginationButton
      aria-label="Go to last page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...rest}
    >
      <Icon.ChevronsRight className="size-4" />
    </PaginationButton>
  )
}

export const PaginationPreviousLink = (
  props: React.ComponentProps<typeof PaginationLink>,
) => {
  const { className, ...rest } = props

  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...rest}
    >
      <Icon.ChevronLeft className="size-4" />
    </PaginationLink>
  )
}

export const PaginationNextLink = (
  props: React.ComponentProps<typeof PaginationLink>,
) => {
  const { className, ...rest } = props

  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...rest}
    >
      <Icon.ChevronRight className="size-4" />
    </PaginationLink>
  )
}

export const PaginationFirstLink = (
  props: React.ComponentProps<typeof PaginationLink>,
) => {
  const { className, ...rest } = props

  return (
    <PaginationLink
      aria-label="Go to first page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...rest}
    >
      <Icon.ChevronsLeft className="size-4" />
    </PaginationLink>
  )
}

export const PaginationLastLink = (
  props: React.ComponentProps<typeof PaginationLink>,
) => {
  const { className, ...rest } = props

  return (
    <PaginationLink
      aria-label="Go to last page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...rest}
    >
      <Icon.ChevronsRight className="size-4" />
    </PaginationLink>
  )
}

export const PaginationEllipsis = (props: React.ComponentProps<"span">) => {
  const { className, ...rest } = props

  return (
    <span
      aria-hidden
      className={cn("flex size-9 items-center justify-center", className)}
      {...rest}
    >
      <Icon.MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}
