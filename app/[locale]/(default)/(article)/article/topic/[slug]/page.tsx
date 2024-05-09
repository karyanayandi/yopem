import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import NextLink from "next/link"
import { notFound } from "next/navigation"
import { BreadcrumbJsonLd } from "next-seo"

import Ad from "@/components/ad"
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

const ArticleListByTopic = dynamicFn(
  async () => {
    const ArticleListByTopic = await import(
      "@/components/article/article-list-by-topic"
    )
    return ArticleListByTopic
  },
  {
    ssr: false,
  },
)

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } = params

  const topic = await api.topic.bySlug(slug)

  return {
    title: `${topic?.title} Articles`,
    description: `${topic?.title} Articles Page`,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/article/topic/${topic?.slug}/`,
    },
    openGraph: {
      title: `${topic?.title} Articles`,
      description: `${topic?.title} Articles Page`,
      url: `${env.NEXT_PUBLIC_SITE_URL}/article/topic/${topic?.slug}`,
      locale: topic?.language,
    },
  }
}

interface TopicArticlesPageProps {
  params: {
    slug: string
    locale: LanguageType
  }
}

export default async function TopicArticlesPage({
  params,
}: TopicArticlesPageProps) {
  const { slug, locale } = params

  const t = await getI18n()

  const topic = await api.topic.bySlug(slug)

  const adsBelowHeader = await api.ad.byPosition("article_below_header")

  if (!topic) {
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
            name: topic?.metaTitle ?? topic?.title,
            item: `${env.NEXT_PUBLIC_SITE_URL}/article/topic/${topic?.slug}`,
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
              <BreadcrumbPage>{topic?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="my-8">
          <h1 className="text-center text-4xl">{topic?.title}</h1>
        </div>
        <div className="flex w-full flex-col">
          <ArticleListByTopic topicId={topic.id} locale={locale} />
        </div>
      </section>
    </>
  )
}
