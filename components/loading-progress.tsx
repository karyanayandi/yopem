import * as React from "react"

interface LoadingProgressProps extends React.HTMLAttributes<HTMLDivElement> {}

const LoadingProgress: React.FunctionComponent<LoadingProgressProps> = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="h-4 w-4 animate-pulse rounded-full bg-primary"></div>
      <div className="h-4 w-4 animate-pulse rounded-full bg-primary"></div>
      <div className="h-4 w-4 animate-pulse rounded-full bg-primary"></div>
    </div>
  )
}

export default LoadingProgress
