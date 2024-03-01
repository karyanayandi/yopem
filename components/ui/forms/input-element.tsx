import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import type { InputElementSizes } from "./input"

type Placement = "left" | "right"

export interface InputElementProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputElementVariants> {
  placement?: Placement
  size?: InputElementSizes
  children?: React.ReactNode
  disabledPointerEvents?: boolean
}

const inputElementVariants = cva(
  "z-10 absolute top-0 flex items-center justify-center",
  {
    variants: {
      size: {
        xs: "size-7 text-xs",
        sm: "size-8 text-sm",
        md: "size-9 text-base",
        lg: "size-11 text-lg",
        xl: "size-[3.125rem] text-xl",
      },
      disabledPointerEvents: {
        true: "pointer-events-none",
      },
    },
  },
)

export const InputElement = React.forwardRef<HTMLDivElement, InputElementProps>(
  (props, ref) => {
    const {
      size,
      children,
      placement = "left",
      disabledPointerEvents = false,
      className,
      ...rest
    } = props

    const placementProp = { [placement]: "0" }

    return (
      <div
        ref={ref}
        className={cn(
          inputElementVariants({ size, disabledPointerEvents, className }),
        )}
        style={placementProp}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

export const InputLeftElement = React.forwardRef<
  HTMLDivElement,
  InputElementProps
>((props, ref) => <InputElement ref={ref} placement="left" {...props} />)

export const InputRightElement = React.forwardRef<
  HTMLDivElement,
  InputElementProps
>((props, ref) => <InputElement ref={ref} placement="right" {...props} />)
