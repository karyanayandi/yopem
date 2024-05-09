import * as React from "react"
import type { Metadata } from "next"
import dynamicFn from "next/dynamic"
import NextLink from "next/link"
import { notFound } from "next/navigation"
import { ArticleJsonLd, BreadcrumbJsonLd } from "next-seo"

import Image from "@/components/image"
import Share from "@/components/share"
import TransformContent from "@/components/transform-content"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import env from "@/env.mjs"
import { getSession } from "@/lib/auth/utils"
import { getI18n } from "@/lib/locales/server"
import { api } from "@/lib/trpc/server"
import { splitReactNodes } from "@/lib/utils"
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

const ArticleComment = dynamicFn(
  async () => {
    const Comment = await import("@/components/article/article-comment")
    return Comment
  },
  {
    ssr: false,
  },
)

const ArticleListRelated = dynamicFn(
  async () => {
    const ArticleListRelated = await import(
      "@/components/article/article-list-related"
    )
    return ArticleListRelated
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

  const article = await api.article.bySlug(slug)

  return {
    title: article?.metaTitle ?? article?.title,
    description: article?.metaDescription ?? article?.excerpt,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}/`,
    },
    openGraph: {
      title: article?.title,
      description: article?.metaDescription ?? article?.excerpt,
      images: [
        {
          url: article?.featuredImage.url!,
          width: 1280,
          height: 720,
        },
      ],
      url: `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}`,
      locale: article?.language,
    },
    twitter: {
      title: env.NEXT_PUBLIC_X_USERNAME,
      card: "summary_large_image",
      images: [
        {
          url: article?.featuredImage.url!,
          width: 1280,
          height: 720,
        },
      ],
    },
    icons: {
      other: [
        {
          rel: "amphtml",
          url: `${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}/amp`,
        },
      ],
    },
  }
}

interface ArticleSlugPageProps {
  params: {
    slug: string
    locale: LanguageType
  }
}

export default async function ArticleSlugPage({
  params,
}: ArticleSlugPageProps) {
  const { locale, slug } = params

  const t = await getI18n()

  const { session } = await getSession()
  const article = await api.article.bySlug(slug)

  if (!article) {
    notFound()
  }

  const adsBelowHeader = await api.ad.byPosition("article_below_header")
  const adsSingleArticleAboveContent = await api.ad.byPosition(
    "single_article_above_content",
  )
  const adsSingleArticleBelowContent = await api.ad.byPosition(
    "single_article_below_content",
  )
  const adsSingleArticleMiddleContent = await api.ad.byPosition(
    "single_article_middle_content",
  )

  const articleContent = TransformContent({
    htmlInput: article?.content,
    title: article?.title!,
  })

  const { firstContent, secondContent } = splitReactNodes(
    React.Children.toArray(articleContent),
  )

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
            position: 3,
            name: article?.topics[0]?.title,
            item: `${env.NEXT_PUBLIC_SITE_URL}/article/topic/${article?.topics[0]?.slug}`,
          },
          {
            position: 4,
            name: article?.metaTitle ?? article?.title,
            item: `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}`,
          },
        ]}
      />
      <ArticleJsonLd
        useAppDir={true}
        url={`${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}`}
        title={article.metaTitle ?? article.title}
        images={[article.featuredImage.url]}
        datePublished={JSON.stringify(article.createdAt)}
        dateModified={JSON.stringify(article.createdAt)}
        authorName={[
          {
            name: article?.authors[0]?.name,
            url: `${env.NEXT_PUBLIC_SITE_URL}/user/${article?.authors[0]?.username}`,
          },
        ]}
        publisherName={env.NEXT_PUBLIC_SITE_TITLE}
        publisherLogo={env.NEXT_PUBLIC_LOGO_URL}
        description={article.metaDescription ?? article.excerpt}
        isAccessibleForFree={true}
      />
      <section>
        {adsBelowHeader.length > 0 &&
          adsBelowHeader.map((ad) => {
            return <Ad key={ad.id} ad={ad} />
          })}
        <div className="mb-5 md:mb-10">
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
                <BreadcrumbLink asChild aria-label={t("article")}>
                  <NextLink href="/article">{t("article")}</NextLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild aria-label={article?.topics[0]?.title!}>
                  <NextLink href={`/article/topic/${article?.topics[0]?.slug}`}>
                    {article?.topics[0]?.title}
                  </NextLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{article.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl">{article.title}</h1>
          <div className="flex justify-between">
            <div className="inline-flex space-x-1">
              <NextLink
                aria-label={article?.authors[0]?.name!}
                href={`/user/${article?.authors[0]?.username}`}
                className="text-sm font-bold"
              >
                {article?.authors[0]?.name}
              </NextLink>
            </div>
          </div>
          <Image
            fill
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw"
            priority
            placeholder="empty"
            src={article.featuredImage.url}
            alt={article.title}
            className="!relative !h-auto !w-auto max-w-full rounded-xl object-cover"
          />
          <article className="article-content" id="content">
            {adsSingleArticleAboveContent.length > 0 &&
              adsSingleArticleAboveContent.map((ad) => {
                return <Ad key={ad.id} ad={ad} />
              })}
            {firstContent as React.ReactNode}
            {adsSingleArticleMiddleContent.length > 0 &&
              adsSingleArticleMiddleContent.map((ad) => {
                return <Ad key={ad.id} ad={ad} />
              })}
            {secondContent as React.ReactNode}
          </article>
          <div className="my-4 space-x-2">
            {article.topics.map((topic) => {
              return (
                <Button
                  key={topic.slug}
                  asChild
                  size="sm"
                  variant="outline"
                  className="rounded-full uppercase"
                >
                  <NextLink
                    aria-label={topic.title!}
                    href={`/article/topic/${topic.slug}`}
                  >
                    {topic.title}
                  </NextLink>
                </Button>
              )
            })}
          </div>
          <div className="my-4">
            {adsSingleArticleBelowContent.length > 0 &&
              adsSingleArticleBelowContent.map((ad) => {
                return <Ad key={ad.id} ad={ad} />
              })}
          </div>
          <div className="space-y-4">
            <Share
              url={`${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}`}
              text={article.title}
            />
            <ArticleComment articleId={article.id} session={session} />
            <ArticleListRelated
              locale={locale}
              currentArticleId={article.id}
              topicId={article?.topics[0]?.id!}
            />
          </div>
        </div>
      </section>
    </>
  )
}
