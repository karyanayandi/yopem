import { BreadcrumbJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo"

import Ad from "@/components/ad"
import ArticleList from "@/components/article/article-list"
import { env } from "@/env"
import { api } from "@/lib/trpc/server"
import type { LanguageType } from "@/lib/validation/language"

interface HomePageProps {
  params: {
    locale: LanguageType
  }
}

export default async function Home(props: HomePageProps) {
  const { params } = props
  const { locale } = params

  const adsBelowHeader = await api.ad.byPosition("article_below_header")

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
        ]}
      />
      <SiteLinksSearchBoxJsonLd
        useAppDir={true}
        url={env.NEXT_PUBLIC_SITE_URL}
        potentialActions={[
          {
            target: `${env.NEXT_PUBLIC_SITE_URL}/search?q`,
            queryInput: "search_term_string",
          },
        ]}
      />
      <section>
        {adsBelowHeader.length > 0 &&
          adsBelowHeader.map((ad) => {
            return <Ad key={ad.id} ad={ad} />
          })}
        <div className="my-2 flex w-full flex-col">
          <ArticleList locale={locale} />
        </div>
      </section>
    </>
  )
}
