"use client"

import * as React from "react"

import { useDisclosure } from "@/hooks/use-disclosure"
import DashboardSidebar from "./dashboard-sidebar"

interface DashboardContainerProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const DashboardContainer: React.FC<DashboardContainerProps> = (props) => {
  const { children } = props

  const { onToggle, onClose, isOpen } = useDisclosure()

  return (
    <>
      <DashboardSidebar onToggle={onToggle} onClose={onClose} isOpen={isOpen} />
      <main className="flex-1 overflow-y-auto p-4 sm:ml-64 md:p-8">
        {children}
      </main>
    </>
  )
}

export default DashboardContainer
