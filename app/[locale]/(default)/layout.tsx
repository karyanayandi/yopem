import * as React from "react"

import Footer from "@/components/layout/footer"
import TopNav from "@/components/layout/top-nav"

export default function DefaultLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <TopNav />
      <div className="flex">
        <main className="container mx-auto flex-1 overflow-y-auto p-8 pt-2 md:p-8">
          {children}
        </main>
      </div>
      <Footer />
    </>
  )
}
