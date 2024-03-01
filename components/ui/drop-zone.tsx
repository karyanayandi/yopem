import * as React from "react"

import { cn } from "@/lib/utils"
import { Icon } from "./icon"

export interface DropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string
  description?: string
}

export const DropZone = React.forwardRef<HTMLDivElement, DropZoneProps>(
  (props, ref) => {
    const {
      className,
      id,
      placeholder = "Click to upload",
      description = "JPG, JPEG, PNG or WEBP (MAX. 1280x720px)",
      ...rest
    } = props

    return (
      <div
        ref={ref}
        className={cn("flex w-full items-center justify-center", className)}
      >
        <label
          htmlFor={id ? `${id}-upload` : "file"}
          className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/30 bg-background/5 hover:bg-background/10 md:h-96"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <Icon.Upload className="mb-3 h-10 w-10 text-foreground/40" />
            <p className="mb-2 text-sm text-foreground/50">
              <span className="font-semibold">{placeholder}</span>
            </p>
            <p className="text-xs text-foreground/50">{description}</p>
          </div>
          <input
            id={id ? `${id}-upload` : "file"}
            type="file"
            className="hidden"
            multiple={true}
            {...rest}
          />
        </label>
      </div>
    )
  },
)
