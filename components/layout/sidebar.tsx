"use client"

import * as React from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  isOpen: boolean
}

const Sidebar: React.FunctionComponent<SidebarProps> = (props) => {
  const { isOpen, children } = props

  return (
    <aside
      className={`${isOpen ? "translate-x-0" : "-translate-x-full"} fixed left-0 top-0 z-40 h-screen w-64 transition-transform sm:translate-x-0`}
      aria-label="Sidebar"
    >
      {children}
    </aside>
  )
}

export default Sidebar
