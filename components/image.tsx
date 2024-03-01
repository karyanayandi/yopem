import * as React from "react"
import NextImage, { type ImageProps } from "next/image"

const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63)

const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`

const Image: React.FunctionComponent<ImageProps> = (props) => {
  const {
    src,
    alt,
    sizes = `(max-width: 768px) 100px, (max-width: 1200px) 200px, 300px`,
    loading = "lazy",
    className,
    placeholder = "blur",
    onClick,
    fill = true,
  } = props
  return (
    <NextImage
      src={src}
      alt={alt}
      loading={loading}
      placeholder={placeholder}
      blurDataURL={rgbDataURL(218, 218, 218)}
      className={className}
      quality={70}
      onClick={onClick}
      sizes={sizes}
      fill={fill}
    />
  )
}

export default Image
