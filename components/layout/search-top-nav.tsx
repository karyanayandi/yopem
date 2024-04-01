"use client"

import * as React from "react"

import ArticleCardSearch from "@/components/article/article-card-search"
import TopicCardSearch from "@/components/topic/topic-card-search"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import UserCardSearch from "@/components/user/user-card-search"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import type { LanguageType } from "@/lib/validation/language"

interface SearchTopNavProps extends React.HTMLAttributes<HTMLDivElement> {
  locale: LanguageType
}

const SearchTopNav: React.FC<SearchTopNavProps> = ({ locale }) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [searched, setSearched] = React.useState<boolean>(false)
  const [searchVisibility, setSearchVisibility] = React.useState<boolean>(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (searchVisibility && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchVisibility])

  const t = useI18n()
  const ts = useScopedI18n("search")

  const { data: articles } = api.article.search.useQuery({
    searchQuery,
    language: locale,
  })

  const { data: topics } = api.topic.search.useQuery({
    searchQuery,
    language: locale,
  })

  const { data: users } = api.user.search.useQuery(searchQuery)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const value = e.target.value
    setSearchQuery(value)
    setSearched(value.length > 2)
  }

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        aria-label="Search"
        onClick={() => setSearchVisibility((prev) => !prev)}
      >
        <Icon.Search className="size-5 px-0" />
      </Button>
      <div
        className={`absolute inset-x-0 ${
          searchVisibility ? "top-14 h-[90vh]" : "top-[-200%] h-0"
        } z-20 transition-all duration-200`}
        onClick={() => {
          setSearchVisibility(false)
        }}
      >
        <div className="my-0 bg-background px-2 md:px-0">
          <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
            <div
              className="relative flex w-full min-w-full lg:w-[500px]"
              onClick={(e) => e.stopPropagation()}
            >
              <Input
                type="search"
                name="q"
                className="m-6 py-3"
                onChange={handleSearchChange}
                autoComplete="off"
                placeholder={ts("placeholder")}
                required
                ref={inputRef}
              />
            </div>
          </form>
          {searched && searchQuery && (
            <div
              className={`${
                searchVisibility ? "block" : "hidden"
              } space-y-4 bg-background p-5 shadow-lg`}
              onClick={() => {
                setSearchVisibility(false)
              }}
              aria-expanded={searchVisibility ? "true" : "false"}
            >
              {articles && articles.length > 0 && (
                <>
                  <h4 className="mb-2 border-b">{t("article")}</h4>
                  <div className="flex flex-col">
                    {articles.map((article) => (
                      <ArticleCardSearch key={article.slug} article={article} />
                    ))}
                  </div>
                </>
              )}
              {topics && topics.length > 0 && (
                <>
                  <h4 className="mb-2 border-b">{t("topic")}</h4>
                  <div className="flex flex-col">
                    {topics.map((topic) => (
                      <TopicCardSearch key={topic.slug} topic={topic} />
                    ))}
                  </div>
                </>
              )}
              {users && users.length > 0 && (
                <>
                  <h4 className="mb-2 border-b">{t("user")}</h4>
                  <div className="flex flex-col">
                    {users.map((user) => (
                      <UserCardSearch key={user.username} user={user} />
                    ))}
                  </div>
                </>
              )}
              {(!articles || articles.length === 0) &&
                (!topics || topics.length === 0) &&
                (!users || users.length === 0) && (
                  <p className="semibold text-lg">{ts("not_found")}</p>
                )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default SearchTopNav
