"use client"

import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"

import CopyMediaLinkButton from "@/components/media/copy-media-link-button"
import DeleteMediaButton from "@/components/media/delete-media-button"
import MediaList from "@/components/media/media-list"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast/use-toast"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import DashboardMediaHeader from "./header"

export default function DashboardMediaContent() {
  const [searchQuery, setSearchQuery] = React.useState<string | null>(null)

  const ts = useScopedI18n("media")

  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
  }

  const { data: resultsMedias, refetch: updateMedias } =
    api.media.search.useQuery(searchQuery ?? "", {
      enabled: !!searchQuery,
    })

  const { mutate: deleteMedia } = api.media.deleteByName.useMutation({
    onSuccess: () => {
      updateMedias()
      toast({ variant: "success", description: ts("delete_success") })
    },
    onError: (error) => {
      const errorData = error?.data?.zodError?.fieldErrors

      if (errorData) {
        for (const field in errorData) {
          if (errorData.hasOwnProperty(field)) {
            errorData[field]?.forEach((errorMessage) => {
              toast({
                variant: "danger",
                description: errorMessage,
              })
            })
          }
        }
      } else {
        toast({
          variant: "danger",
          description: ts("delete_failed"),
        })
      }
    },
  })

  return (
    <>
      <DashboardMediaHeader />
      <div className="mt-4">
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
        >
          <Input
            type="text"
            className="w-full"
            onChange={handleSearchOnChange}
            placeholder={ts("search")}
          />
        </form>
      </div>
      {searchQuery && resultsMedias && resultsMedias.length > 0 ? (
        <div className="my-3">
          <div className="mb-4 grid grid-cols-3 gap-3 md:grid-cols-8">
            {resultsMedias?.map((media) => (
              <div
                className="relative overflow-hidden rounded-[18px]"
                key={media.id}
              >
                <DeleteMediaButton
                  description={media.name}
                  onDelete={() => deleteMedia(media.name)}
                />
                <CopyMediaLinkButton url={media.url} />
                <NextLink
                  aria-label={media.name}
                  href={`/dashboard/media/edit/${media.id}`}
                >
                  <NextImage
                    key={media.id}
                    src={media.url}
                    alt={media.name}
                    fill
                    sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                    className="!relative aspect-[1/1] h-[500px] max-w-[unset] rounded-sm border-2 border-muted/30 bg-muted/30 object-cover"
                    quality={60}
                  />
                </NextLink>
              </div>
            ))}
          </div>
        </div>
      ) : (
        searchQuery && (
          <div className="my-64 flex items-center justify-center">
            <h2>Medias Not found</h2>
          </div>
        )
      )}
      {!searchQuery ? (
        <div className="my-3">{<MediaList isLibrary={true} />}</div>
      ) : (
        !searchQuery && (
          <div className="my-64 flex items-center justify-center">
            <h2 className="text-center font-bold">Medias Not found</h2>
          </div>
        )
      )}
    </>
  )
}
