import * as React from "react"

import DashboardAddNew from "@/components/dashboard/dashboard-add-new"
import DashboardHeading from "@/components/dashboard/dashboard-heading"

export default function DashboardMediaHeader() {
  return (
    <div className="mb-8 flex justify-between">
      <DashboardHeading>Media</DashboardHeading>
      <DashboardAddNew url="/dashboard/media/new" />
    </div>
  )
}
