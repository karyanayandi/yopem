import type { Metadata } from "next"
import NextLink from "next/link"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "404 Not Found",
  description: "404 Not Found",
}

export default function NotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <section className="flex h-screen items-center justify-center bg-background">
          <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
            <div className="mx-auto max-w-screen-sm text-center">
              <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-primary lg:text-9xl">
                404
              </h1>
              <p className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Something&apos;s missing.
              </p>
              <p className="mb-4 text-lg font-light text-foreground">
                Sorry, we can&apos;t find that page. You&apos;ll find lots to
                explore on the home page.
              </p>
              <Button asChild aria-label="Go To Homepage">
                <NextLink href="/">Back to Homepage</NextLink>
              </Button>
            </div>
          </div>
        </section>
      </body>
    </html>
  )
}
