import * as React from "react"

import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/lib/validation/user"

interface DashboardUserRoleBadgeProps extends BadgeProps {
  role: UserRole
  children: React.ReactNode
}

const DashboardUserRoleBadge: React.FC<DashboardUserRoleBadgeProps> = (
  props,
) => {
  const { role, className, children } = props

  const roleToVariantMap: Record<UserRole, BadgeProps["variant"]> = {
    admin: "default",
    user: "outline",
    author: "info",
    member: "success",
  }

  const variant = roleToVariantMap[role] ?? "default"

  return (
    <Badge className={cn("uppercase", className)} variant={variant}>
      {children}
    </Badge>
  )
}

export default DashboardUserRoleBadge
