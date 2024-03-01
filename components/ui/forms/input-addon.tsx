import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export interface InputAddonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputAddonVariants> {}

const inputAddonVariants = cva(
  "flex items-center w-auto rounded-md shadow-sm whitespace-nowrap border border-border text-foreground/80 bg-background/80",
  {
    variants: {
      size: {
        xs: "px-2 text-xs",
        sm: "px-3 text-xs",
        md: "px-4 text-sm",
        lg: "px-4 text-base",
        xl: "px-6 text-lg",
      },
      placement: {
        left: "-mr-1 rounded-r-none",
        right: "-ml-1 rounded-l-none",
      },
    },
    defaultVariants: {
      size: "md",
      placement: "left",
    },
  },
)

export const InputAddon: React.FunctionComponent<InputAddonProps> = (props) => {
  const { placement, size, className, ...rest } = props

  return (
    <div
      className={cn(inputAddonVariants({ size, placement, className }))}
      {...rest}
    />
  )
}

export const InputLeftAddon: React.FunctionComponent<InputAddonProps> = (
  props,
) => <InputAddon placement="left" {...props} />

export const InputRightAddon: React.FunctionComponent<InputAddonProps> = (
  props,
) => <InputAddon placement="right" {...props} />
