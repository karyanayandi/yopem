import env from "@/env.mjs"
import type { SelectArticle } from "@/lib/db/schema/article"
import type { SelectMedia } from "@/lib/db/schema/media"
import type { SelectTopic } from "@/lib/db/schema/topic"
import type { SelectUser } from "@/lib/db/schema/user"

interface ArticleProps extends SelectArticle {
  featuredImage: Pick<SelectMedia, "url">
  topics: Pick<SelectTopic, "title" | "slug">[]
  authors: Pick<SelectUser, "name" | "username" | "image">[]
}

export function generateAMPJsonLdSchema(article: ArticleProps) {
  const articleSections = article?.topics?.map((topic) => {
    return topic.title
  })

  const keywords =
    article?.topics.map((topic) => {
      return topic.title
    }) ?? ""

  const newsArticle = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}#article`,
        isPartOf: {
          "@id": `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}`,
        },
        author: {
          name: article?.authors[0]?.name ?? "",
          url: `${env.NEXT_PUBLIC_SITE_URL}/article/user/${article?.authors[0]?.username ?? ""}`,
        },
        headline: article?.title ?? "",
        datePublished: article?.createdAt,
        dateModified: article?.updatedAt,
        mainEntityOfPage: {
          "@id": `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}#article`,
        },
        publisher: {
          "@id": `${env.NEXT_PUBLIC_SITE_URL}/#organization`,
        },
        image: {
          "@id": `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}#primaryimage/`,
        },
        thumbnailUrl: article?.featuredImage?.url ?? "",
        keywords: keywords,
        articleSection: articleSections,
        inLanguage: "id",
        potentialAction: [
          {
            "@type": "CommentAction",
            name: "Comment",
            target: [
              `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}#respond`,
            ],
          },
        ],
        copyrightYear: new Date().getFullYear(),
        copyrightHolder: {
          "@id": `${env.NEXT_PUBLIC_SITE_URL}/#organization`,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}`,
        url: `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}#article`,
        name: article?.title ?? "",
        isPartOf: {
          "@id": `${env.NEXT_PUBLIC_SITE_URL}/#website`,
        },
        primaryImageOfPage: {
          "@id": `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}#primaryimage`,
        },
        image: {
          "@id": `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}#primaryimage`,
        },
        thumbnailUrl: article?.featuredImage?.url ?? "",
        datePublished: article?.createdAt,
        dateModified: article?.updatedAt,
        description: article.metaDescription,
        breadcrumb: {
          "@id": `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}#breadcrumb`,
        },
        inLanguage: "id",
        potentialAction: [
          {
            "@type": "ReadAction",
            target: [`${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}`],
          },
        ],
      },
      {
        "@type": "ImageObject",
        inLanguage: "id",
        "@id": `${env.NEXT_PUBLIC_SITE_URL}/article/${article?.slug}#primaryimage`,
        url: article?.featuredImage?.url ?? "",
        contentUrl: article?.featuredImage?.url ?? "",
        width: 1280,
        height: 720,
        caption: article?.title ?? "",
      },
      {
        "@type": "WebSite",
        "@id": `${env.NEXT_PUBLIC_SITE_URL}#article`,
        url: env.NEXT_PUBLIC_SITE_URL,
        name: env.NEXT_PUBLIC_SITE_TITLE,
        description: env.NEXT_PUBLIC_SITE_DESCRIPTION,
        publisher: {
          "@id": `${env.NEXT_PUBLIC_SITE_URL}/#organization`,
        },
        inLanguage: "id",
      },
      {
        "@type": "Organization",
        "@id": `${env.NEXT_PUBLIC_SITE_URL}/#organization`,
        name: env.NEXT_PUBLIC_SITE_TITLE,
        url: env.NEXT_PUBLIC_SITE_URL,
        logo: {
          "@type": "ImageObject",
          inLanguage: "id",
          "@id": `${env.NEXT_PUBLIC_SITE_URL}/#schema/logo/image`,
          url: env.NEXT_PUBLIC_LOGO_URL,
          contentUrl: env.NEXT_PUBLIC_LOGO_URL,
          width: 512,
          height: 512,
          caption: env.NEXT_PUBLIC_SITE_TITLE,
        },
        image: {
          "@id": `${env.NEXT_PUBLIC_SITE_URL}/#schema/logo/image`,
        },
        sameAs: [
          `https://www.facebook.com/${env.NEXT_PUBLIC_FACEBOOK_USERNAME}/`,
          `https://www.twitter.com/${env.NEXT_PUBLIC_X_USERNAME}/`,
          `https://www.instagram.com/${env.NEXT_PUBLIC_INSTAGRAM_USERNAME}/`,
          `https://www.tiktok.com/${env.NEXT_PUBLIC_TIKTOK_USERNAME}/`,
          `https://www.whatsapp.com/${env.NEXT_PUBLIC_WHATSAPP_CHANNEL_USERNAME}/`,
        ],
      },
      {
        "@type": "Person",
        "@id": `${env.NEXT_PUBLIC_SITE_URL}#/schema/person/cfbb8c50dad6788bea8bc82c4d5dbcae`,
        name: article?.authors[0]?.name ?? "",
        image: {
          "@type": "ImageObject",
          inLanguage: "id",
          "@id": `${env.NEXT_PUBLIC_SITE_URL}#/schema/person/image`,
          url: article?.authors[0].image ?? "",
          contentUrl: article?.authors[0].image ?? "",
          caption: article?.authors[0]?.name ?? "",
        },
        url: `${
          env.NEXT_PUBLIC_SITE_URL
        }/article/user/${article?.authors[0]?.username ?? ""}`,
      },
    ],
  }

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@id": env.NEXT_PUBLIC_SITE_URL,
          name: "Home",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@id": `${
            env.NEXT_PUBLIC_SITE_URL
          }/article/topic/${article.topics[0].slug ?? ""}/`,
          name: `${article.topics[0].title}`,
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          name: `${article?.title ?? ""}`,
        },
      },
    ],
  }

  return { newsArticle, breadcrumbList }
}
