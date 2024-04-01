import Ad from "@/components/ad"
import ArticleList from "@/components/article/article-list"
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
    <section>
      {adsBelowHeader.length > 0 &&
        adsBelowHeader.map((ad) => {
          return <Ad key={ad.id} ad={ad} />
        })}
      <div className="my-2 flex w-full flex-col">
        <ArticleList locale={locale} />
      </div>
    </section>
  )
}
