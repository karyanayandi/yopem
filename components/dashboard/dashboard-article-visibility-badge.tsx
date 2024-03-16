import * as React from "react"

import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ArticleVisibility } from "@/lib/validation/article"

interface DashboardArticleVisibilityBadgeProps extends BadgeProps {
  visibility: ArticleVisibility
  children: React.ReactNode
}

const DashboardArticleVisibilityBadge: React.FC<
  DashboardArticleVisibilityBadgeProps
> = (props) => {
  const { visibility, className, children } = props

  const visibilityToVariantMap: Record<
    ArticleVisibility,
    BadgeProps["variant"]
  > = {
    public: "outline",
    member: "success",
  }
  const variant = visibilityToVariantMap[visibility] ?? "default"

  return (
    <Badge className={cn(className)} variant={variant}>
      {children}
    </Badge>
  )
}

export default DashboardArticleVisibilityBadge
