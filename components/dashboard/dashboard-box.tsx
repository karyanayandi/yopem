import * as React from "react"

interface DashboardBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const DashboardBox: React.FC<DashboardBoxProps> = (props) => {
  const { children } = props

  return <div className="rounded-md p-5 shadow-md">{children}</div>
}

export const DashboardBoxIconWrapper: React.FC<DashboardBoxProps> = (props) => {
  const { children } = props

  return <div className="flex">{children}</div>
}

export const DashboardBoxCount: React.FC<DashboardBoxProps> = (props) => {
  const { children } = props

  return <div className="mt-6 text-3xl font-medium leading-8">{children}</div>
}

export const DashboardBoxDescription: React.FC<DashboardBoxProps> = (props) => {
  const { children } = props

  return <div className="mt-1 text-base text-foreground/80">{children}</div>
}
