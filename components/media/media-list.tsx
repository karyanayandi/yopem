"use client"

import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"

import LoadingProgress from "@/components/loading-progress"
import { toast } from "@/components/ui/toast/use-toast"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import CopyMediaLinkButton from "./copy-media-link-button"
import DeleteMediaButton from "./delete-media-button"

interface MediaListProps extends React.HTMLAttributes<HTMLDivElement> {
  selectMedia?: (_media: { name: string; id: string; url: string }) => void
  isLibrary?: boolean
  deleteMedia?: () => void
  toggleUpload?: boolean
  onSelect?: () => void
}

const MediaList: React.FunctionComponent<MediaListProps> = (props) => {
  const { isLibrary, selectMedia, onSelect, toggleUpload } = props
  const prevToggleRef = React.useRef(toggleUpload)

  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  const {
    data: medias,
    hasNextPage,
    fetchNextPage,
    refetch: updateMedias,
  } = api.media.dashboardInfinite.useInfiniteQuery(
    { limit: 10 },
    {
      staleTime: 0,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
    },
  )

  React.useEffect(() => {
    if (prevToggleRef.current !== toggleUpload) {
      updateMedias()
    }

    prevToggleRef.current = toggleUpload
  }, [toggleUpload, updateMedias])

  const handleObserver = React.useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target?.isIntersecting && hasNextPage) {
        setTimeout(() => fetchNextPage(), 2)
      }
    },
    [fetchNextPage, hasNextPage],
  )

  React.useEffect(() => {
    const lmRef: HTMLDivElement | null = loadMoreRef.current
    const observer = new IntersectionObserver(handleObserver)

    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => {
      if (lmRef) {
        observer.unobserve(lmRef)
      }
    }
  }, [handleObserver, isLibrary, medias])

  const ts = useScopedI18n("media")

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
    <div>
      <div className="mb-4 grid grid-cols-3 gap-3 lg:grid-cols-8">
        {isLibrary
          ? medias?.pages.map((media) =>
              media?.medias.map((media) => {
                return (
                  <div
                    key={media.name}
                    className="relative overflow-hidden rounded-[18px]"
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
                )
              }),
            )
          : medias?.pages.map((media, i) =>
              media?.medias.map((media) => {
                return (
                  <div key={i}>
                    <NextImage
                      key={media.id}
                      src={media.url}
                      alt={media.name}
                      fill
                      sizes="(max-width: 768px) 30vw,
                    (max-width: 1200px) 20vw,
                    33vw"
                      className="!relative aspect-[1/1] h-[500px] max-w-[unset] cursor-pointer rounded-sm border-2 border-muted/30 bg-muted/30 object-cover"
                      onClick={(
                        e: React.MouseEvent<HTMLImageElement, MouseEvent>,
                      ) => {
                        e.preventDefault()
                        if (selectMedia) selectMedia(media)
                        if (onSelect) onSelect()
                      }}
                    />
                  </div>
                )
              }),
            )}
      </div>
      {hasNextPage && (
        <div ref={loadMoreRef}>
          <div className="text-center">
            <LoadingProgress />
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaList
