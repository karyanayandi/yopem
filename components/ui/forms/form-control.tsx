"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface UseFormControlProps {
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  readOnly?: boolean
  id?: string
}

interface UseFormControlData extends UseFormControlProps {
  labelId?: string
  errorId?: string
  helpTextId?: string
}

export interface FormControlProps
  extends UseFormControlProps,
    React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

interface FormControlContextProps extends UseFormControlProps {}

export const useFormControl = (
  props: UseFormControlProps,
): UseFormControlData => {
  const context = useFormControlContext()
  if (!context) {
    return props
  }
  const keys = Object.keys(context)
  return keys.reduce((acc, prop) => {
    // FIX: later
    //@ts-ignore
    acc[prop] = props[prop]
    if (context) {
      //@ts-ignore
      if (props[prop] == null) {
        //@ts-ignore
        acc[prop] = context[prop]
      }
    }

    return acc
  }, {})
}

const FormControlContext = React.createContext<
  FormControlContextProps | undefined
>(undefined)

const useFormControlContext = () => React.useContext(FormControlContext)

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  (props, ref) => {
    const {
      children,
      className,
      required,
      disabled,
      invalid,
      readOnly,
      id: idProp,
      ...rest
    } = props

    const id = idProp ?? `field-${React.useId()}`

    const labelId = `${id}-label`
    const errorId = `${id}-error`
    const helpTextId = `${id}-helptext`

    const context = {
      required,
      disabled,
      invalid,
      readOnly,
      id,
      labelId,
      errorId,
      helpTextId,
    }

    return (
      <FormControlContext.Provider value={context}>
        <div
          role="group"
          ref={ref}
          className={cn("relative w-full", className)}
          {...rest}
        >
          {children}
        </div>
      </FormControlContext.Provider>
    )
  },
)
