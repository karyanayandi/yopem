import { resizeImage } from "@/lib/utils"

export async function uploadMultipleMediaAction(datas: Blob[]) {
  const formData = new FormData()
  for (const file of datas) {
    const resizedImage = await resizeImage(file)
    formData.append("file", resizedImage)
  }

  try {
    const response = await fetch("/api/media/images", {
      method: "POST",
      body: formData,
    })

    if (response.status === 200) {
      const uploadedFiles = await response.json()
      return { data: uploadedFiles, error: null }
    } else {
      console.error("Upload failed")
      return { data: null, error: response }
    }
  } catch (error) {
    console.error("Upload failed", error)
    return { data: null, error }
  }
}
