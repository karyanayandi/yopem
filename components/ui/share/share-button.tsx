import * as React from "react"
import NextLink from "next/link"

import { cn } from "@/lib/utils"

export interface ShareButtonProps {
  url: string
  variant?: "solid" | "outline" | "ghost"
  onClick?: () => void
  className?: string
  icon?: string | React.ReactElement
  subject?: string | null
  message?: string | null
  mediaSrc?: string | null
  baseUrl?: string | null
  caption?: string | null
  title?: string
}

export const ShareButton: React.FunctionComponent<ShareButtonProps> = (
  props,
) => {
  const { onClick, title, icon, className, url } = props
  return (
    <NextLink
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      title={title}
      href={url}
      className={cn(
        "flex items-center rounded-lg px-3 py-2 text-base font-normal text-foreground hover:bg-accent",
        className,
      )}
    >
      {icon}
    </NextLink>
  )
}
