import * as React from "react"

import { cn } from "@/lib/utils"

export const Skeleton = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className, ...rest } = props

  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...rest}
    />
  )
}
