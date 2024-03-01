import * as React from "react"

const DashboardHeading: React.FC<{ children: React.ReactNode }> = (props) => {
  const { children } = props

  return <h1 className="text-xl font-bold md:text-3xl">{children}</h1>
}

export default DashboardHeading
