import * as React from "react"

interface PageInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
}

export const PageInfo: React.FunctionComponent<PageInfoProps> = (props) => {
  const { title, description } = props
  return (
    <div className="mb-6 mt-4 space-y-1 md:space-y-2 lg:mb-8 lg:mt-6">
      <h2>{title}</h2>
      {description && <p className="text-sm">{description}</p>}
    </div>
  )
}
