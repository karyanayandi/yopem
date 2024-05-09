"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"

import env from "@/env.mjs"

function AdsenseScript() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hasScrolled, setHasScrolled] = React.useState<boolean>(false)

  React.useEffect(() => {
    const scriptElement = document.querySelector(
      `script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}"]`,
    )

    const handleAdLoad = () => {
      try {
        const insElements = Array.from(
          document.querySelectorAll("ins.manual-ad"),
        )
        const insWithoutIframe = insElements.filter(
          (ins) => !ins.querySelector("iframe"),
        )
        if (!hasScrolled && insWithoutIframe.length > 0) {
          //@ts-expect-error
          if (window.adsbygoogle) {
            setHasScrolled(true)
            insWithoutIframe.forEach((el) => {
              if (!el.querySelector("iframe")) {
                //@ts-expect-error
                ;(window.adsbygoogle = window.adsbygoogle || []).push({})
              }
            })
            window.removeEventListener("scroll", handleAdScroll)
          } else {
            scriptElement?.addEventListener("load", handleAdLoad)
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    const handleAdScroll = () => {
      const insElements = Array.from(document.querySelectorAll("ins.manual-ad"))
      const insWithoutIframe = insElements.filter(
        (ins) => !ins.querySelector("iframe"),
      )
      if (!hasScrolled && insWithoutIframe.length > 0) {
        //@ts-expect-error
        if (window?.adsbygoogle) {
          setHasScrolled(true)

          insWithoutIframe.forEach((el) => {
            if (!el.querySelector("iframe")) {
              //@ts-expect-error
              ;(window.adsbygoogle = window.adsbygoogle || []).push({})
            }
            window.removeEventListener("scroll", handleAdScroll)
          })
        }
      }
    }

    // Push ad after 8 seconds
    const timeoutId = setTimeout(handleAdLoad, 9000)

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

  React.useEffect(() => {
    const scriptElement = document.querySelector(
      `script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}"]`,
    )
    const handleScriptLoad = () => {
      if (!scriptElement) {
        const script = document.createElement("script")
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`
        script.async = true
        script.crossOrigin = "anonymous"
        document.body.appendChild(script)
      }
    }

    const handleLoad = () => {
      clearTimeout(timeoutId)
      handleScriptLoad()
    }

    const handleScroll = () => {
      handleScriptLoad()

      // Remove event listener after script is loaded
      window.removeEventListener("scroll", handleScroll)
    }

    // Push ad after 8 seconds
    const timeoutId = setTimeout(handleLoad, 8000)

    // Push ad when scrolled
    window.addEventListener("scroll", handleScroll)

    // Clean up event listener on component unmount
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return <></>
}

export default AdsenseScript
