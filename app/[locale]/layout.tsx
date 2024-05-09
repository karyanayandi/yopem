import * as React from "react"
import { Inter } from "next/font/google"

import "@/styles/globals.css"

import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import Scripts from "@/components/scripts"
import ThemeProvider from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/toast/toaster"
import env from "@/env.mjs"
import { I18nProviderClient } from "@/lib/locales/client"
import TRPCReactProvider from "@/lib/trpc/react"
import type { LanguageType } from "@/lib/validation/language"

const inter = Inter({ subsets: ["latin"] })

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}) {
  const { locale } = params

  return {
    title: {
      template: `%s | ${env.NEXT_PUBLIC_SITE_TITLE}`,
      default: env.NEXT_PUBLIC_SITE_TITLE,
    },
    description: env.NEXT_PUBLIC_SITE_DESCRIPTION,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/`,
    },
    openGraph: {
      title: env.NEXT_PUBLIC_SITE_TITLE,
      description: env.NEXT_PUBLIC_SITE_DESCRIPTION,
      url: env.NEXT_PUBLIC_SITE_URL,
      siteName: env.NEXT_PUBLIC_SITE_TITLE,
      images: [
        {
          url: env.NEXT_PUBLIC_LOGO_OG_URL,
          width: env.NEXT_PUBLIC_LOGO_OG_WIDTH,
          height: env.NEXT_PUBLIC_LOGO_OG_HEIGHT,
        },
      ],
      locale: locale,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    twitter: {
      title: env.NEXT_PUBLIC_X_USERNAME,
      card: "summary_large_image",
      images: [
        {
          url: env.NEXT_PUBLIC_LOGO_OG_URL,
          width: env.NEXT_PUBLIC_LOGO_OG_WIDTH,
          height: env.NEXT_PUBLIC_LOGO_OG_HEIGHT,
        },
      ],
    },
    icons: {
      shortcut: "/icon/favicon.ico",
    },
  }
}

interface RootLayoutProps {
  children: React.ReactNode
  params: { locale: LanguageType }
}

export default function RootLayout({ params, children }: RootLayoutProps) {
  const { locale } = params

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <I18nProviderClient locale={locale}>
          <ThemeProvider>
            <Toaster />
            <TRPCReactProvider>
              <ReactQueryDevtools initialIsOpen={false} />
              {children}
            </TRPCReactProvider>
          </ThemeProvider>
          <Scripts />
        </I18nProviderClient>
      </body>
    </html>
  )
}
