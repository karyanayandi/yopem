/* eslint-disable no-useless-escape */

import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs"
import LocalizedFormat from "dayjs/plugin/localizedFormat"
import { customAlphabet } from "nanoid"
import Resizer from "react-image-file-resizer"
import { twMerge } from "tailwind-merge"

export function getValidChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter((child) =>
    React.isValidElement(child),
  ) as React.ReactElement[]
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const uniqueCharacter = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyz",
  5,
)

export const cuid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  40,
)

export const resizeImage = (file: Blob): Promise<Blob> =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1280,
      720,
      "webp",
      70,
      0,
      (uri) => {
        resolve(uri as Blob)
      },
      "file",
    )
  })

export function slugify(text: string) {
  return text
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\_/g, "-") // Replace _ with -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/\-$/g, "") // Remove trailing -
}

export function slugifyFile(text: string) {
  return text
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-.]+/g, "") // Remove all non-word chars execpt dots
    .replace(/\_/g, "-") // Replace _ with -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/\-$/g, "") // Remove trailing -
}

export function getProtocol() {
  if (process.env.APP_ENV === "development") {
    return "http://"
  }

  return "https://"
}

export const getDomainWithoutSubdomain = (url: string) => {
  const urlParts = new URL(url).hostname.split(".")

  return urlParts
    .slice(0)
    .slice(-(urlParts.length === 4 ? 3 : 2))
    .join(".")
}

export const formatDate = (data: string | null, format: string) => {
  dayjs.extend(LocalizedFormat)

  return dayjs(data).format(format)
}

export const copyToClipboard = (value: string) => {
  void navigator.clipboard.writeText(value)
}

export const trimText = (text: string, maxLength: number): string => {
  const strippedText = text.replace(/(<([^>]+)>)/gi, "")

  if (strippedText.length <= maxLength) {
    return strippedText
  }

  return strippedText.substring(0, maxLength)
}

export const splitReactNodes = (elements: React.ReactNode[]) => {
  const splitIndex = Math.ceil(elements.length / 2)
  return {
    firstContent: elements.slice(0, splitIndex),
    secondContent: elements.slice(splitIndex),
  }
}
