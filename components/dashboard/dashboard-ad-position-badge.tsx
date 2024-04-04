import * as React from "react"

import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { AdPosition } from "@/lib/validation/ad"

interface DashboardAdPositionBadgeProps extends BadgeProps {
  position: AdPosition
  children: React.ReactNode
}

const DashboardAdPositionBadge: React.FC<DashboardAdPositionBadgeProps> = (
  props,
) => {
  const { position, className, children } = props

  const positionToVariantMap: Record<AdPosition, BadgeProps["variant"]> = {
    home_below_header: "default",
    article_below_header: "success",
    article_below_header_amp: "warning",
    topic_below_header: "info",
    single_article_above_content: "success",
    single_article_below_content: "success",
    single_article_middle_content: "success",
    single_article_pop_up: "success",
    single_article_above_content_amp: "warning",
    single_article_below_content_amp: "warning",
    single_article_middle_content_amp: "warning",
  }

  const variant = positionToVariantMap[position] ?? "default"

  return (
    <Badge className={cn("uppercase", className)} variant={variant}>
      {children}
    </Badge>
  )
}

export default DashboardAdPositionBadge
