//TODO: Handle jsonld

import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import NextLink from "next/link"
import { notFound } from "next/navigation"

import ArticleCardVertical from "@/components/article/article-card-vertical"
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
import { getI18n, getScopedI18n } from "@/lib/locales/server"
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

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } = params

  const topic = await api.topic.bySlug(slug)

  return {
    title: topic?.metaTitle ?? topic?.title,
    description: topic?.metaDescription ?? topic?.description,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/topic/${topic?.slug}/`,
    },
    openGraph: {
      title: topic?.title,
      description: topic?.metaDescription! ?? topic?.description!,
      url: `${env.NEXT_PUBLIC_SITE_URL}/topic/${topic?.slug}`,
      locale: topic?.language,
    },
  }
}

interface SingleTopicPageProps {
  params: {
    slug: string
    locale: LanguageType
  }
}

export default async function SingleTopicPage({
  params,
}: SingleTopicPageProps) {
  const { slug, locale } = params

  const t = await getI18n()
  const ts = await getScopedI18n("article")

  const topic = await api.topic.bySlug(slug)

  const articles = await api.article.byTopicId({
    topicId: topic?.id!,
    language: locale,
    page: 1,
    perPage: 6,
  })

  const adsBelowHeader = await api.ad.byPosition("article_below_header")

  if (!articles) {
    notFound()
  }

  return (
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
          <BreadcrumbItem>
            <BreadcrumbLink asChild aria-label={t("topic")}>
              <NextLink href="/topic">{t("topic")}</NextLink>
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
        <div className="my-2 flex flex-row items-center justify-between">
          <h2 className="text-2xl">{t("articles")}</h2>
          <NextLink
            aria-label={topic?.title}
            href={`/article/topic/${topic?.slug}`}
            className="text-sm"
          >
            {t("see_more")}
          </NextLink>
        </div>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {articles.map((article) => {
              return <ArticleCardVertical key={article.id} article={article} />
            })}
          </div>
        ) : (
          <h3 className="my-16 text-center text-3xl">{ts("not_found")}</h3>
        )}
      </div>
    </section>
  )
}
