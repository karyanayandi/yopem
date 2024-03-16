"use client"

import * as React from "react"

import DashboardHeading from "@/components/dashboard/dashboard-heading"
import { useI18n } from "@/lib/locales/client"

export default function DashboardUserHeader() {
  const t = useI18n()

  return (
    <div className="mb-8">
      <DashboardHeading>{t("users")}</DashboardHeading>
    </div>
  )
}
