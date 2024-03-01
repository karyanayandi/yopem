"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <section className="flex h-screen items-center justify-center bg-background">
          <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
            <div className="mx-auto max-w-screen-sm text-center">
              <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-primary lg:text-9xl">
                500
              </h1>
              <p className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                We are already working to solve the problem
              </p>
              <p className="mb-4 text-lg font-light text-foreground">
                We are already working to solve the problem
              </p>
              <Button onClick={() => reset()}>Try again</Button>
            </div>
          </div>
        </section>
      </body>
    </html>
  )
}
