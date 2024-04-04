import * as React from "react"

import Footer from "@/components/layout/footer"
import TopNav from "@/components/layout/top-nav"
import type { LanguageType } from "@/lib/validation/language"

interface DefaultLayoutProps {
  children: React.ReactNode
  locale: LanguageType
  params: {
    locale: LanguageType
  }
}

export default function DefaultLayout(props: DefaultLayoutProps) {
  const { children, params } = props

  const { locale } = params

  return (
    <>
      <TopNav locale={locale} />
      <div className="flex">
        <main className="container mx-auto my-20 flex-1 overflow-y-auto px-2 pt-2 md:px-24 lg:px-48 xl:px-80">
          {children}
        </main>
      </div>
      <Footer />
    </>
  )
}
