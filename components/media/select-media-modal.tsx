"use client"

import * as React from "react"

import Image from "@/components/image"
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/toast/use-toast"
import { useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import { Button } from "../ui/button"
import InfiniteScrollMedia from "./infinite-scroll-media"
import UploadMedia from "./upload-media"

interface SelectMediaModalProps {
  handleSelectUpdateMedia: (_media: {
    name: string
    id: string
    url: string
  }) => void
  open: boolean
  setOpen: (_open: boolean) => void
  children?: React.ReactNode
  id?: string
}

const SelectMediaModal: React.FunctionComponent<SelectMediaModalProps> = (
  props,
) => {
  const { handleSelectUpdateMedia, children, open, setOpen, id } = props

  const ts = useScopedI18n("media")

  const [toggleUpload, setToggleUpload] = React.useState<boolean>(false)
  const [searched, setSearched] = React.useState<boolean>(false)
  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const { data: resultMedias } = api.media.search.useQuery(searchQuery, {
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
          description: ts("fetch_failed"),
        })
      }
    },
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearched(true)

    if (e.target.value.length > 1) {
      setSearchQuery(e.target.value)
    } else if (e.target.value.length < 1) {
      setSearched(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogPortal>
        <DialogContent id={id} className="min-h-full min-w-full">
          <ScrollArea className="max-h-[90vh]">
            <div className="mx-3">
              <DialogTitle>Select Featured Image</DialogTitle>
              <div className="my-8 space-y-2">
                <Button
                  aria-label="Add New Media"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setToggleUpload(!toggleUpload)
                  }}
                >
                  Add New
                </Button>
                <UploadMedia
                  toggleUpload={toggleUpload}
                  setToggleUpload={setToggleUpload}
                />
              </div>
              <div>
                <form onSubmit={(e) => e.preventDefault()}>
                  <Input
                    onChange={handleSearchChange}
                    type="text"
                    placeholder={ts("search")}
                  />
                </form>
              </div>
            </div>
            <div className="m-3">
              {!searched && (
                <InfiniteScrollMedia
                  toggleUpload={toggleUpload}
                  selectMedia={handleSelectUpdateMedia}
                />
              )}
              {searched && resultMedias && resultMedias?.length > 0 ? (
                <div className="mb-4 grid grid-cols-3 gap-3 lg:grid-cols-5">
                  {resultMedias?.map((media) => {
                    return (
                      <Image
                        key={media.id}
                        src={media.url}
                        alt={media.name}
                        fill
                        sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                        className="!relative aspect-[1/1] h-[500px] max-w-[unset] cursor-pointer rounded-lg border-2 border-muted/30 bg-muted/30 object-cover"
                        onClick={(e: { preventDefault: () => void }) => {
                          e.preventDefault()
                          handleSelectUpdateMedia(media)
                          setSearched(false)
                        }}
                        quality={60}
                      />
                    )
                  })}
                </div>
              ) : (
                searched && <p>{ts("not_found")}</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default SelectMediaModal
