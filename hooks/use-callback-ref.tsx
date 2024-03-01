/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"

export function useCallbackRef<T extends (..._args: any[]) => any>(
  callback: T | undefined,
  deps: React.DependencyList = [],
) {
  const callbackRef = React.useRef(callback)

  React.useEffect(() => {
    callbackRef.current = callback
  })

  return React.useCallback(
    ((...args) => callbackRef.current?.(...args)) as T,
    deps,
  )
}
