import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import { Icon } from "@/components/ui/icon"
import type { SelectMedia } from "@/lib/db/schema/media"
import type { SelectTopic } from "@/lib/db/schema/topic"

type TopicDataProps = Pick<SelectTopic, "title" | "slug"> & {
  featuredImage?: Pick<SelectMedia, "url"> | null
}

interface TopicCardSearchProps {
  topic: TopicDataProps
}

const TopicCardSearch: React.FC<TopicCardSearchProps> = (props) => {
  const { topic } = props

  const { title, slug, featuredImage } = topic

  return (
    <NextLink
      aria-label={title}
      href={`/topic/${slug}`}
      className="mb-2 w-full"
    >
      <div className="flex flex-row hover:bg-accent">
        <div className="relative aspect-[1/1] h-[20px] w-auto max-w-[unset] overflow-hidden rounded-md">
          {featuredImage ? (
            <Image
              src={featuredImage?.url}
              className="object-cover"
              alt={title}
            />
          ) : (
            <Icon.Topic className="h-5 w-5" />
          )}
        </div>
        <div className="ml-2 w-3/4">
          <h3 className="mb-2 text-lg font-medium">{title}</h3>
        </div>
      </div>
    </NextLink>
  )
}

export default TopicCardSearch
