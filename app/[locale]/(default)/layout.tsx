import * as React from "react"

import Footer from "@/components/layout/footer"
import TopNav from "@/components/layout/top-nav"

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TopNav />
      <div className="flex">
        <main className="container mx-auto flex-1 overflow-y-auto px-2 pt-2 md:px-24 lg:px-48 xl:px-80">
          {children}
        </main>
      </div>
      <Footer />
    </>
  )
}
