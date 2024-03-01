import * as React from "react"

import { cn } from "@/lib/utils"
import { useFormControl } from "./form-control"

export interface FormErrorMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const FormErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  FormErrorMessageProps
>((props, ref) => {
  const { className, id, ...rest } = props

  const formControl = useFormControl({})

  return (
    <div
      ref={ref}
      className={cn(
        "mt-1.5 flex items-center text-sm leading-none text-danger",
        className,
      )}
      id={id ?? formControl.errorId}
      {...rest}
    />
  )
})
