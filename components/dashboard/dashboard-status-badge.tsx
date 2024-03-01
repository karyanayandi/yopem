import * as React from "react"

import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { StatusType } from "@/lib/validation/status"

interface DashboardStatusBadgeProps extends BadgeProps {
  status: StatusType
  children: React.ReactNode
}

const DashboardStatusBadge: React.FC<DashboardStatusBadgeProps> = (props) => {
  const { status, className, children } = props

  const statusToVariantMap: Record<StatusType, BadgeProps["variant"]> = {
    published: "success",
    draft: "default",
    in_review: "warning",
    rejected: "danger",
  }
  const variant = statusToVariantMap[status] ?? "default"

  return (
    <Badge className={cn(className)} variant={variant}>
      {children}
    </Badge>
  )
}

export default DashboardStatusBadge
