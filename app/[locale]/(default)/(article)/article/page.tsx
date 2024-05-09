import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import NextLink from "next/link"
import { BreadcrumbJsonLd } from "next-seo"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Icon } from "@/components/ui/icon"
import env from "@/env.mjs"
import { getI18n } from "@/lib/locales/server"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

const Ad = dynamicFn(
  async () => {
    const Ad = await import("@/components/ad")
    return Ad
  },
  {
    ssr: false,
  },
)

const ArticleList = dynamicFn(
  async () => {
    const ArticleList = await import("@/components/article/article-list")
    return ArticleList
  },
  {
    ssr: false,
  },
)

export function generateMetadata({
  params,
}: {
  params: { locale: LanguageType }
}): Metadata {
  const { locale } = params

  return {
    title: "Article",
    description: "Article",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/article/`,
    },
    openGraph: {
      title: "Article",
      description: "Article",
      url: `${env.NEXT_PUBLIC_SITE_URL}/article`,
      locale: locale,
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: { locale: LanguageType }
}) {
  const { locale } = params

  const t = await getI18n()

  const adsBelowHeader = await api.ad.byPosition("article_below_header")

  return (
    <>
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={[
          {
            position: 1,
            name: env.NEXT_PUBLIC_DOMAIN,
          },
          {
            position: 2,
            name: `${env.NEXT_PUBLIC_SITE_URL}/article`,
          },
        ]}
      />
      <section>
        {adsBelowHeader.length > 0 &&
          adsBelowHeader.map((ad) => {
            return <Ad key={ad.id} ad={ad} />
          })}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild aria-label="Home">
                <NextLink href="/">
                  <Icon.Home />
                </NextLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("article")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="my-2 flex w-full flex-col">
          <ArticleList locale={locale} />
        </div>
      </section>
    </>
  )
}
