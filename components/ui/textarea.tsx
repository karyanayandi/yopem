import * as React from "react"

import { cn } from "@/lib/utils"

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "solid" | "plain"
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const { className, variant = "solid", rows = 4, ...rest } = props

    const variantClasses = {
      solid: cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      ),
      plain: cn(
        "appearance-none outline-none focus:outline-none border-none focus:border-none hover:border-none focus:ring-0 text-foreground invalid:text-danger bg-background",
      ),
    }
    return (
      <textarea
        className={cn(variantClasses[variant], className)}
        rows={rows}
        ref={ref}
        {...rest}
      />
    )
  },
)
