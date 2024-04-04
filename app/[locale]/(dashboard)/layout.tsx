import * as React from "react"
import dynamicFn from "next/dynamic"

const DashboardContainer = dynamicFn(
  async () => {
    const DashboardContainer = await import(
      "@/components/dashboard/dashboard-container"
    )
    return DashboardContainer
  },
  {
    ssr: false,
  },
)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DashboardContainer>{children}</DashboardContainer>
    </>
  )
}
