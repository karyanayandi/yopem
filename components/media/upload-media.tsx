"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { DropZone } from "@/components/ui/drop-zone"
import { Form } from "@/components/ui/form"
import { toast } from "@/components/ui/toast/use-toast"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { cn } from "@/lib/utils"
import { uploadMultipleMediaAction } from "./action"

interface FormValues {
  files: FileList
}

interface UploadMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  setToggleUpload?: React.Dispatch<React.SetStateAction<boolean>>
  toggleUpload?: boolean
}

const UploadMedia: React.FunctionComponent<UploadMediaProps> = (props) => {
  const { toggleUpload, setToggleUpload } = props

  const [loading, setLoading] = React.useState<boolean>(false)
  const [previewImages, setPreviewImages] = React.useState<string[]>([])

  const t = useI18n()
  const ts = useScopedI18n("media")

  const form = useForm<FormValues>()
  const watchedFiles = form.watch("files")

  React.useEffect(() => {
    if (watchedFiles instanceof FileList) {
      const imagePreviews: string[] = []

      ;(async () => {
        for (const file of watchedFiles) {
          const reader = new FileReader()
          await new Promise((resolve) => {
            reader.onloadend = () => {
              imagePreviews.push(reader.result as string)
              resolve(null)
            }
            reader.readAsDataURL(file)
          })
        }
        setPreviewImages(imagePreviews.slice(0, 5))
      })()
    } else {
      setPreviewImages([])
    }
  }, [watchedFiles])

  const onSubmit = async (values: FormValues) => {
    setLoading(true)

    const filesArray = Array.from(values.files)

    const { data, error } = await uploadMultipleMediaAction(filesArray)

    if (data) {
      setToggleUpload && setToggleUpload((prev) => !prev)
      setPreviewImages([])
      form.reset()
      toast({ variant: "success", description: ts("upload_success") })
    } else if (error) {
      console.log(error)
      toast({ variant: "danger", description: ts("upload_failed") })
    }

    setLoading(false)
  }

  return (
    <div className={toggleUpload === true ? "flex" : "hidden"}>
      <div className="flex-1 space-y-4">
        <div aria-label="media-upload" className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 md:mx-64"
            >
              <DropZone
                className={cn(previewImages.length > 0 && "hidden")}
                {...form.register("files")}
              />
              {previewImages.length > 0 && (
                <div className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-border/30 bg-background/5 p-10">
                  <div className="grid grid-flow-row grid-cols-2 grid-rows-1 gap-2 md:grid-cols-6 md:grid-rows-1">
                    {previewImages.map((preview, index) => (
                      <img
                        className="h-24 w-full cursor-pointer overflow-hidden rounded-lg object-cover md:h-48"
                        key={index}
                        src={preview}
                        alt={`Selected ${index + 1}`}
                      />
                    ))}
                    {watchedFiles && watchedFiles.length > 5 && (
                      <div className="flex h-24 w-full items-center justify-center rounded-lg bg-foreground/20 md:h-48">
                        +{watchedFiles.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </Form>
          <div className="align-center flex justify-center">
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              aria-label="Submit"
              loading={loading}
            >
              {t("submit")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadMedia
