//@ts-expect-error
import Amperize from "amperize"
import sanitizeHtml from "sanitize-html"

import TransformContentAMP from "@/components/transform-content-amp"
import type { SelectArticle } from "@/lib/db/schema/article"
import { splitReactNodes } from "."

const allowedAMPTags = [
  "html",
  "body",
  "article",
  "section",
  "nav",
  "aside",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "h7",
  "header",
  "footer",
  "address",
  "p",
  "a",
  "amp-img",
  "img",
  "amp-iframe",
  "amp-youtube",
  "amp-twitter",
  "i-amphtml-sizer",
  "iframe",
  "blockquote",
  "figure",
  "table",
  "tbody",
  "tr",
  "td",
  "strong",
  "b",
  "i",
  "span",
  "div",
  "ul",
  "li",
  //... and other tags (used for sanitize-html)
]

const allowedAMPAttributes = {
  "*": [
    "itemid",
    "itemprop",
    "itemref",
    "amp-access",
    "amp-access-*",
    "i-amp-access-id",
    "data-*",
    "style",
    "href",
    "layout",
    "height",
    "width",
    "src",
  ],
  //... and other tags (used for sanitize-html)
}
const allowedAMPClasses = {
  span: ["ctaText", "postTitle"],
  //... and other tags (used for sanitize-html)
}
const convertToAMP = (htmlStr: string) =>
  new Promise<string>((resolve, reject) => {
    new Amperize().parse(htmlStr, (err: string | undefined, result: string) => {
      if (err) {
        return reject(new Error(err))
      }
      resolve(result)
    })
  })

export async function convertArticleContentToAMP(article: SelectArticle) {
  const { renderToString } = (await import("react-dom/server")).default
  const { Children } = (await import("react")).default

  const fullContentReact = TransformContentAMP({
    htmlInput: article?.content!,
    title: article?.title!,
  })
  const { firstContent, secondContent } = splitReactNodes(
    Children.toArray(fullContentReact),
  )
  const firstContentHtml = renderToString(firstContent)
  const secondContentHtml = renderToString(secondContent)
  const firstAmpHtml = await convertToAMP(firstContentHtml)
  const firstCleanHtml = sanitizeHtml(firstAmpHtml, {
    allowedTags: allowedAMPTags,
    allowedAttributes: allowedAMPAttributes,
    selfClosing: ["source", "track", "br"],
    allowedClasses: allowedAMPClasses,
    transformTags: {
      span: function (tagName, attribs) {
        if (Object.hasOwnProperty.call(attribs, "data-tweetid")) {
          return {
            tagName: "amp-twitter",
            attribs: {
              "data-tweetid": attribs["data-tweetid"],
              width: "376",
              height: "473",
              layout: "responsive",
            },
          }
        }
        return { tagName, attribs }
      },
    },
  })?.replace(/!important/g, "")
  const secondAmpHtml = await convertToAMP(secondContentHtml)
  const secondCleanHtml = sanitizeHtml(secondAmpHtml, {
    allowedTags: allowedAMPTags,
    allowedAttributes: allowedAMPAttributes,
    selfClosing: ["source", "track", "br"],
    allowedClasses: allowedAMPClasses,
    transformTags: {
      span: function (tagName, attribs) {
        if (Object.hasOwnProperty.call(attribs, "data-tweetid")) {
          return {
            tagName: "amp-twitter",
            attribs: {
              "data-tweetid": attribs["data-tweetid"],
              width: "376",
              height: "473",
              layout: "responsive",
            },
          }
        }
        return { tagName, attribs }
      },
    },
  })?.replace(/!important/g, "")

  return { firstCleanHtml, secondCleanHtml }
}

export function sanitizeMetaDataAMP(item: string) {
  return item.replace(/"/g, "'")
}
