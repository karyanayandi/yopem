"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { Skeleton } from "@/components/ui/skeleton"
import env from "@/env.mjs"

interface AdsenseProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
}

const Adsense: React.FunctionComponent<AdsenseProps> = (props) => {
  const { content } = props

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hasScrolled, setHasScrolled] = React.useState(false)

  React.useEffect(() => {
    const scriptElement = document.querySelector(
      `script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}"]`,
    )

    const handleAdLoad = () => {
      try {
        const insElements = Array.from(document.querySelectorAll("ins"))
        const insWithoutIframe = insElements.filter(
          (ins) => !ins.querySelector("iframe"),
        )
        if (!hasScrolled && insWithoutIframe.length > 0) {
          //@ts-expect-error
          if (window.adsbygoogle) {
            setHasScrolled(true)
            insWithoutIframe.forEach(() => {
              //@ts-expect-error
              window.adsbygoogle.push({})
            })
          } else {
            scriptElement?.addEventListener("load", handleAdLoad)
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    const handleAdScroll = () => {
      const insElements = Array.from(document.querySelectorAll("ins"))
      const insWithoutIframe = insElements.filter(
        (ins) => !ins.querySelector("iframe"),
      )
      if (!hasScrolled && insWithoutIframe.length > 0) {
        //@ts-expect-error
        if (window?.adsbygoogle) {
          setHasScrolled(true)
          insWithoutIframe.forEach(() => {
            //@ts-expect-error
            window.adsbygoogle.push({})
          })
        }
      }
    }

    // Push ad after 8 seconds
    const timeoutId = setTimeout(handleAdLoad, 8000)

    // Push ad when scrolled
    window.addEventListener("scroll", handleAdScroll)

    return () => {
      clearTimeout(timeoutId)
      if (scriptElement) {
        scriptElement.removeEventListener("load", handleAdLoad)
      }
      window.removeEventListener("scroll", handleAdScroll)
    }
  }, [hasScrolled, pathname, searchParams])

  React.useEffect(() => {
    setHasScrolled(false)
  }, [pathname, searchParams])

  if (process.env.APP_ENV === "development") {
    return null
  }

  return (
    <React.Suspense
      fallback={
        <Skeleton className="mb-4 h-auto w-full min-w-full rounded-xl" />
      }
    >
      <div
        key={pathname}
        className="m-[5px] flex h-auto w-full min-w-full justify-center overflow-hidden"
      >
        <ins
          className="adsbygoogle manual-ad"
          style={{
            display: "block",
            height: "auto",
            minWidth: "100%",
            width: "100%",
          }}
          data-ad-client={env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
          data-ad-slot={content}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </React.Suspense>
  )
}

export default Adsense
