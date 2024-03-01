import * as React from "react"

import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TopicVisibility } from "@/lib/validation/topic"

interface DashboardTopicVisibilityBadgeProps extends BadgeProps {
  visibility: TopicVisibility
  children: React.ReactNode
}

const DashboardTopicVisibilityBadge: React.FC<
  DashboardTopicVisibilityBadgeProps
> = (props) => {
  const { visibility, className, children } = props

  const visibilityToVariantMap: Record<TopicVisibility, BadgeProps["variant"]> =
    {
      public: "outline",
      internal: "default",
    }
  const variant = visibilityToVariantMap[visibility] ?? "default"

  return (
    <Badge className={cn(className)} variant={variant}>
      {children}
    </Badge>
  )
}

export default DashboardTopicVisibilityBadge
