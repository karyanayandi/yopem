import * as React from "react"

import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Container: React.FunctionComponent<ContainerProps> = (props) => {
  const { className, children } = props

  return (
    <section className={cn("container mx-auto w-full py-4", className)}>
      {children}
    </section>
  )
}
