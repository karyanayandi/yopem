import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import type { SelectArticle } from "@/lib/db/schema/article"
import type { SelectMedia } from "@/lib/db/schema/media"
import { cn } from "@/lib/utils"

interface ArticleCardVerticalProps
  extends React.HTMLAttributes<HTMLDivElement> {
  article: Pick<SelectArticle, "slug" | "title"> & {
    featuredImage?: Pick<SelectMedia, "url">
  }
}

const ArticleCardVertical: React.FunctionComponent<ArticleCardVerticalProps> = (
  props,
) => {
  const { article, className } = props

  const { featuredImage, slug, title } = article

  return (
    <article className="max-w-sm">
      <NextLink aria-label={title} href={`/article/${slug}`}>
        <Image
          className="!relative !h-[200px] overflow-hidden rounded-lg object-cover"
          sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
          src={featuredImage?.url!}
          alt={title}
        />
      </NextLink>
      <div className="px-2 py-3">
        <NextLink aria-label={title} href={`/article/${slug}/`}>
          <h3
            className={cn(
              "mb-2 line-clamp-3 text-xl font-semibold hover:text-primary/80 md:line-clamp-4 md:font-bold",
              className,
            )}
          >
            {title}
          </h3>
        </NextLink>
      </div>
    </article>
  )
}

export default ArticleCardVertical
