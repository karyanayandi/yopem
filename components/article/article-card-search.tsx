import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import type { SelectArticle } from "@/lib/db/schema/article"
import type { SelectMedia } from "@/lib/db/schema/media"

type ArticleDataProps = Pick<SelectArticle, "title" | "slug"> & {
  featuredImage: Pick<SelectMedia, "url">
}

interface ArticleCardSearchProps {
  article: ArticleDataProps
}

const ArticleCardSearch: React.FunctionComponent<ArticleCardSearchProps> = (
  props,
) => {
  const { article } = props

  const { title, slug, featuredImage } = article

  return (
    <NextLink
      aria-label={title}
      href={`/article/${slug}`}
      className="mb-2 w-full"
    >
      <div className="flex flex-row hover:bg-accent">
        <div className="relative aspect-[1/1] h-[50px] w-auto max-w-[unset] overflow-hidden rounded-md">
          <Image src={featuredImage.url} className="object-cover" alt={title} />
        </div>
        <div className="ml-2 w-3/4">
          <h3 className="mb-2 text-lg font-medium">{title}</h3>
        </div>
      </div>
    </NextLink>
  )
}

export default ArticleCardSearch
