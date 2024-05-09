import * as React from "react"
import type { Metadata } from "next"
import NextLink from "next/link"
import { notFound } from "next/navigation"
import { BreadcrumbJsonLd } from "next-seo"

import ArticleCardVertical from "@/components/article/article-card-vertical"
import Image from "@/components/image"
import { Icon } from "@/components/ui/icon"
import env from "@/env.mjs"
import { getI18n, getScopedI18n } from "@/lib/locales/server"
import { api } from "@/lib/trpc/server"
import { formatDate } from "@/lib/utils"
import type { LanguageType } from "@/lib/validation/language"

export async function generateMetadata({
  params,
}: {
  params: { locale: LanguageType; username: string }
}): Promise<Metadata> {
  const { username, locale } = params

  const user = await api.user.byUsername(username)

  return {
    title: user?.name,
    description: user?.about ?? `${user?.name} Profile Page`,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_SITE_URL}/user/${user?.username}/`,
    },
    openGraph: {
      title: user?.name!,
      description: user?.about ?? `${user?.name} Profile Page`,
      url: `${env.NEXT_PUBLIC_SITE_URL}/user/${user?.username}`,
      locale: locale,
    },
  }
}

interface UserPageProps {
  params: {
    username: string
    locale: LanguageType
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const { username, locale } = params

  const t = await getI18n()
  const ts = await getScopedI18n("user")
  const tsa = await getScopedI18n("article")

  const user = await api.user.byUsername(username)
  const articles = await api.article.byAuthorId({
    authorId: user?.id!,
    language: locale,
    page: 1,
    perPage: 6,
  })

  if (!user) {
    return notFound()
  }

  return (
    <>
      <BreadcrumbJsonLd
        useAppDir={true}
        itemListElements={[
          {
            position: 2,
            name: env.NEXT_PUBLIC_DOMAIN,
            item: env.NEXT_PUBLIC_SITE_URL,
          },
          {
            position: 3,
            name: user?.name,
            item: `${env.NEXT_PUBLIC_SITE_URL}/user/${user?.username}`,
          },
        ]}
      />
      <div className="space-y-3">
        <div className="rounded border border-border p-4">
          <div className="flex justify-between">
            <div className="flex flex-row space-x-2">
              {user?.image ? (
                <Image
                  src={user?.image}
                  alt={user?.name!}
                  className="!relative !h-14 !w-14 max-w-full rounded-full border-2 border-border object-cover shadow"
                />
              ) : (
                <Icon.User className="bg-muted/61 h-[100px] w-[100px] rounded-full border-2 border-border object-cover p-2 text-foreground/80 shadow" />
              )}
              <div className="space-y-1">
                <h2 className="text-2xl">{user?.name}</h2>
                <p className="text-sm">@{user?.username}</p>
                <p className="line-clamp-3 max-w-sm break-words lg:max-w-md">
                  {user?.about}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center text-sm">
            <Icon.Calendar className="mr-0 h-3 w-3" />
            <p className="text-xs">
              {ts("member_since")} {formatDate(user?.createdAt, "LL")}
            </p>
          </div>
        </div>
        {articles && (
          <div className="flex w-full flex-col">
            <div className="my-1 flex flex-row items-center justify-between">
              <h3 className="text-2xl">{t("articles")}</h3>
              <NextLink
                aria-label={user?.name! ?? user?.username!}
                href={`/article/user/${user?.username}`}
                className="text-sm"
              >
                {t("see_more")}
              </NextLink>
            </div>
            {articles?.length > 0 ? (
              <div className="grid-cols0 grid gap-4 md:grid-cols-3">
                {articles.map((article) => {
                  return (
                    <ArticleCardVertical
                      key={article.title}
                      article={article}
                    />
                  )
                })}
              </div>
            ) : (
              <h3 className="my-16 text-center text-3xl">{tsa("not_found")}</h3>
            )}
          </div>
        )}
      </div>
    </>
  )
}
