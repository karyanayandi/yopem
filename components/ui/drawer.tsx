"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

export const Drawer = (
  props: React.ComponentProps<typeof DrawerPrimitive.Root>,
) => {
  const { shouldScaleBackground = true, ...rest } = props

  return (
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      {...rest}
    />
  )
}

export const DrawerTrigger = DrawerPrimitive.Trigger

export const DrawerPortal = DrawerPrimitive.Portal

export const DrawerClose = DrawerPrimitive.Close

export const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>((props, ref) => {
  const { className, ...rest } = props

  return (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn("fixed inset-0 z-50 bg-black/80", className)}
      {...rest}
    />
  )
})

export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>((props, ref) => {
  const { className, children, ...rest } = props

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
          className,
        )}
        {...rest}
      >
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
})

export const DrawerHeader = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className, ...rest } = props

  return (
    <div
      className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
      {...rest}
    />
  )
}

export const DrawerFooter = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className, ...rest } = props

  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...rest}
    />
  )
}

export const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>((props, ref) => {
  const { className, ...rest } = props

  return (
    <DrawerPrimitive.Title
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
      {...rest}
    />
  )
})

export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>((props, ref) => {
  const { className, ...rest } = props

  return (
    <DrawerPrimitive.Description
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...rest}
    />
  )
})
