import * as React from "react"

import DashboardContainer from "@/components/dashboard/dashboard-container"

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <DashboardContainer>{children}</DashboardContainer>
    </>
  )
}
