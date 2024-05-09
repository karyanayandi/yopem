import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import NextLink from "next/link"
import { notFound } from "next/navigation"
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

const ArticleListByAuthor = dynamicFn(
  async () => {
    const ArticleListByAuthor = await import(
      "@/components/article/article-list-by-author"
    )
    return ArticleListByAuthor
  },
  {
    ssr: false,
  },
)

export async function generateMetadata({
  params,
}: {
  params: { username: string; locale: LanguageType }
}): Promise<Metadata> {
  const { username, locale } = params

  const user = await api.user.byUsername(username)

  return {
    title: `${user?.name ?? user?.username} Articles`,
    description: `${user?.name ?? user?.username} Articles Page`,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/article/user/${user?.username}/`,
    },
    openGraph: {
      title: `${user?.name ?? user?.username} Articles`,
      description: `${user?.name ?? user?.username} Articles Page`,
      url: `${env.NEXT_PUBLIC_SITE_URL}/article/user/${user?.username}`,
      locale: locale,
    },
  }
}

interface AuthorArticlesPageProps {
  params: {
    username: string
    locale: LanguageType
  }
}

export default async function AuthorArticlesPage({
  params,
}: AuthorArticlesPageProps) {
  const { username, locale } = params

  const t = await getI18n()

  const user = await api.user.byUsername(username)

  const adsBelowHeader = await api.ad.byPosition("article_below_header")

  if (!user) {
    notFound()
  }

  return (
    <>
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={[
          {
            position: 1,
            name: env.NEXT_PUBLIC_DOMAIN,
            item: env.NEXT_PUBLIC_SITE_URL,
          },
          {
            position: 2,
            name: "Article",
            item: `${env.NEXT_PUBLIC_SITE_URL}/article`,
          },
          {
            position: 4,
            name: user?.name ?? user?.username,
            item: `${env.NEXT_PUBLIC_SITE_URL}/article/user/${user?.username}`,
          },
        ]}
      />
      <section className="flex w-full flex-col">
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
            <BreadcrumbItem>
              <BreadcrumbLink asChild aria-label={t("article")}>
                <NextLink href="/article">{t("article")}</NextLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{user?.name ?? user?.username}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="my-8">
          <h1 className="text-center text-4xl">
            {user?.name ?? user?.username}
          </h1>
        </div>
        <div className="flex w-full flex-col">
          <ArticleListByAuthor authorId={user.id} locale={locale} />
        </div>
      </section>
    </>
  )
}
