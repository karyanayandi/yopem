import { NextResponse, type NextRequest } from "next/server"

import env from "@/env.mjs"
import { getSession } from "@/lib/auth/utils"
import { db } from "@/lib/db"
import { medias } from "@/lib/db/schema/media"
import { uploadImageToR2 } from "@/lib/r2"
import { cuid, slugifyFile, uniqueCharacter } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const { session } = await getSession()

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 403 })
    }

    const formData = await request.formData()

    const files = formData.getAll("file") as Blob[]

    if (files.length === 0) {
      return NextResponse.json("At least one file is required.", {
        status: 400,
      })
    }

    const defaultFileType = "image/webp"
    const defaultFileExtension = "webp"

    const uploadedFiles = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      //@ts-ignore
      const [fileName, _fileType] = file?.name.split(".") || []

      const uniqueFileName = `${slugifyFile(
        fileName,
      )}_${uniqueCharacter()}.${defaultFileExtension}`

      await uploadImageToR2({
        file: buffer,
        fileName: uniqueFileName,
        contentType: defaultFileType,
      })

      const data = await db.insert(medias).values({
        id: cuid(),
        name: uniqueFileName,
        url: "https://" + env.R2_DOMAIN + "/" + uniqueFileName,
        type: defaultFileType,
        authorId: session.user.id,
      })
      uploadedFiles.push(data)
    }

    return NextResponse.json(uploadedFiles, { status: 200 })
  } catch (error) {
    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}

export const runtime = "edge"
