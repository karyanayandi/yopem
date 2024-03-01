import * as React from "react"

import DashboardAddNew from "@/components/dashboard/dashboard-add-new"
import DashboardHeading from "@/components/dashboard/dashboard-heading"

export default function DashboardTopicHeader() {
  return (
    <div className="mb-8 flex justify-between">
      <DashboardHeading>Topics</DashboardHeading>
      <DashboardAddNew url="/dashboard/topic/new" />
    </div>
  )
}
