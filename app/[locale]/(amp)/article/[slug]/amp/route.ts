//TODO:
// 1. translate
// 2. change font

import { notFound } from "next/navigation"
import type { NextRequest } from "next/server"

import env from "@/env.mjs"
import { api } from "@/lib/trpc/server"
import {
  convertArticleContentToAMP,
  sanitizeMetaDataAMP,
} from "@/lib/utils/amp"
import type { LanguageType } from "@/lib/validation/language"
import { generateAMPJsonLdSchema } from "./json-ld"
import { basecolor, htmlStyle } from "./style"

export async function GET(
  _req: NextRequest,
  params: { params: { slug: string; locale: LanguageType } },
) {
  const { slug, locale } = params.params

  const article = await api.article.bySlug(slug)

  if (!article) {
    return notFound()
  }

  const adsBelowHeader = await api.ad.byPosition("article_below_header_amp")
  const adsSingleArticleAbove = await api.ad.byPosition(
    "single_article_above_content_amp",
  )
  const adsSingleArticleBelow = await api.ad.byPosition(
    "single_article_below_content_amp",
  )
  const adsSingleArticleInline = await api.ad.byPosition(
    "single_article_middle_content_amp",
  )

  const htmlcontent = await convertArticleContentToAMP(article)
  //@ts-expect-error FIX: handle drizzle send null data
  const { newsArticle, breadcrumbList } = generateAMPJsonLdSchema(article!)

  const ampScript = `
  <script type="application/json">
    "light-mode"
  </script>
</amp-state>
<amp-state id="darkModeSwitcherClass">
  <script type="application/json">
    "amp-dark-mode-container light-mode"
  </script>
</amp-state>
<amp-script layout="container" script="dark-mode-script">
<div class="amp-dark-mode-container">
  <button id="dark-mode-switcher-light"  class="amp-dark-mode-button">
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" aria-label="Dark Theme"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
  </button>
  <button id="dark-mode-switcher-dark"  class="amp-dark-mode-button">
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" aria-label="light-theme" class="amp-light-icon"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
  </button>
</div>
</amp-script>
<script id="dark-mode-script" type="text/plain" target="amp-script">
const lightButton = document.getElementById('dark-mode-switcher-light');
const darkButton = document.getElementById('dark-mode-switcher-dark');
lightButton.addEventListener('click', () => {
 AMP.setState({ darkClass: 'dark-mode'}); 
});
darkButton.addEventListener('click', () => {
 AMP.setState({ darkClass: 'light-mode'}); 
});

</script>
`

  const ampBoilerplateStyle = `<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>`

  const adsBelowHeaderHtml = adsBelowHeader?.map((ad) => {
    return `
      <div class="amp-ad-header">
        <amp-ad
          width="100vw"
          height="320"
          type="adsense"
          data-ad-client="${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}"
          data-ad-slot="${ad.content}"
          data-auto-format="rspv"
          data-full-width=""
        >
          <div overflow></div>
        </amp-ad>
      </div>
    `
  })

  const adsSingleArticleAboveHtml = adsSingleArticleAbove?.map((ad) => {
    return `
    <div class="amp-ad-content">
      <amp-ad
        width="100vw"
        height="320"
        type="adsense"
        data-ad-client="${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}"
        data-ad-slot="${ad.content}"
        data-auto-format="rspv"
        data-full-width=""
        ><div overflow></div
      ></amp-ad>
    </div>`
  })

  const adsSingleArticleBelowHtml = adsSingleArticleBelow?.map((ad) => {
    return `<div class="amp-ad-content">
      <amp-ad
        width="100vw"
        height="320"
        type="adsense"
        data-ad-client="${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}"
        data-ad-slot="${ad.content}"
        data-auto-format="rspv"
        data-full-width=""
        ><div overflow></div
      ></amp-ad>
    </div>`
  })

  const adsSingleArticleInlineHtml = adsSingleArticleInline?.map((ad) => {
    return ` 
    <div class="amp-ad-content">
      <amp-ad
        width="100vw"
        height="320"
        type="adsense"
        data-ad-client="${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}"
        data-ad-slot="${ad.content}"
        data-auto-format="rspv"
        data-full-width=""
        ><div overflow></div
      ></amp-ad>
    </div>`
  })

  const ampShare = `
    <div class="amp-share-container">
      <div class="amp-share-title">
        <span>Share</span>
      </div>
      <div class="amp-share-button-container">
        <a
          target="_blank"
          rel="noopener noreferrer"
          title=""
          class="amp-share-button"
          href="https://facebook.com/sharer/sharer.php?u=${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}/amp"
        >
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
            ></path>
          </svg>
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          title=""
          class="amp-share-button"
          href="https://twitter.com/intent/tweet/?text=${encodeURI(
            article?.metaDescription!,
          )}&amp;url=${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}/amp"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 2H1L9.26086 13.0145L1.44995 21.9999H4.09998L10.4883 14.651L16 22H23L14.3917 10.5223L21.8001 2H19.1501L13.1643 8.88578L8 2ZM17 20L5 4H7L19 20H17Z"
            ></path>
          </svg>
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          title=""
          class="amp-share-button"
          href="whatsapp://send?text=${encodeURI(
            article.title,
          )}${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}/amp"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 448 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
            ></path>
          </svg>
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          title="${article.title}"
          class="amp-share-button"
          href="mailto:?subject=${encodeURI(
            article.title,
          )};body=${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}/amp"
        >
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
        </a>
      </div>
    </div>
  `

  const ampComment = `
    <div class="amp-comment-action">
      <a
        aria-label="Leave a comment"
        href="${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}#comment"
      >
        Leave a comment
      </a>
    </div>
  `

  const ampLayout = `
      <!doctype html>
        <html amp lang="en">
        <head>
        <meta charset="utf-8" />
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script
          async
          custom-element="amp-script"
          src="https://cdn.ampproject.org/v0/amp-script-0.1.js"
        ></script>
        <script
          async
          custom-element="amp-youtube"
          src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js"
        ></script>
        <script
          async
          custom-element="amp-ad"
          src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"
        ></script>
        <script
          async
          custom-element="amp-twitter"
          src="https://cdn.ampproject.org/v0/amp-twitter-0.1.js"
        ></script>
        <script
          async
          custom-element="amp-auto-ads"
          src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
        ></script>
        <script
          async
          custom-element="amp-bind"
          src="https://cdn.ampproject.org/v0/amp-bind-0.1.js"
        ></script>
        <meta
          name="amp-script-src"
          content="sha384-HLjhGFoQL5ruBX6qnMC1eyKy-QVvXvGLwT0Pe55bKhv3Ov21f0S15eWC0gwkcxHg"
        />
        <title>${article.title}</title>
        <link
          rel="canonical"
          href="${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}/"
        />
        <meta
          name="viewport"
          content="width=device-width,minimum-scale=1,initial-scale=1"
        />
        <meta property="og:title" content="${article.title}" />
        <meta name="twitter:title" content="${article.title}" />
        <meta
          name="description"
          content="${sanitizeMetaDataAMP(article?.metaDescription!)}"
        />
        <meta
          property="og:description"
          content="${sanitizeMetaDataAMP(article?.metaDescription!)}"
        />
        <meta
          name="twitter:description"
          content="${sanitizeMetaDataAMP(article?.metaDescription!)}"
        />
        <meta property="og:site_name" content="${env.NEXT_PUBLIC_SITE_URL}" />
        <meta property="og:locale" content="${locale}" />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content="${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}"
        />
        <meta
          name="twitter:url"
          content="${env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}"
        />
        <meta property="og:image" content="${article.featuredImage.url}" />
        <meta name="twitter:image" content="${article.featuredImage.url}" />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content="${article.authors[0].name!}" />
        ${article.topics
          .map(
            (topic) => `
        <meta property="article:tag" content="${topic.title}">
        `,
          )
          .join("")}
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icon/favicon-16x16.png"
        />
        <link
          rel="preload"
          fetchpriority="high"
          as="image"
          href="${article.featuredImage.url}"
        />
        <link rel="dns-prefetch" href="${env.NEXT_PUBLIC_SITE_URL}" />
        <link rel="dns-prefetch" href="https://cdn.ampproject.org" />
        <link rel="dns-prefetch" href="https://secure.gravatar.com" />
        ${ampBoilerplateStyle}
        <style amp-custom>
           ${basecolor}
          ${htmlStyle}
        </style>
        <script type="application/ld+json">
          ${JSON.stringify(newsArticle)}
        </script>
        <script type="application/ld+json">
          ${JSON.stringify(breadcrumbList)}
        </script>
      </head>
      <body>
        <amp-auto-ads
          class="amp-ad-content"
          type="adsense"
          data-ad-client="${env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}"
          data-auto-format="rspv"
          data-full-width=""
        >
          <div overflow></div>
        </amp-auto-ads>
        <div id="amp-dark-mode-wrapper" class="ligth-mode" [class]="darkClass">
          <header id="#top" class="amp-header-container">
            <div class="amp-container">
              <a class="amp-logo" href="/">
                <svg
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="100px"
                  height="18px"
                  viewBox="0 0 269.24211200914885 60"
                >
                  <g
                    data-v-423bf9ae=""
                    id="e3161886-057c-4c4e-8d5a-491bdaf2581f"
                    fill="currentColor"
                    transform="matrix(6.315789473684211,0,0,6.315789473684211,-1.7684221471610897,-48.56842189086112)"
                  >
                    <path
                      d="M1.79 12.96L1.79 12.96L1.79 12.96Q1.64 12.61 1.46 12.18L1.46 12.18L1.46 12.18Q1.29 11.75 1.10 11.19L1.10 11.19L1.10 11.19Q0.91 10.63 0.71 9.91L0.71 9.91L0.71 9.91Q0.50 9.18 0.28 8.25L0.28 8.25L0.28 8.25Q0.48 8.05 0.81 7.90L0.81 7.90L0.81 7.90Q1.13 7.76 1.53 7.76L1.53 7.76L1.53 7.76Q2.02 7.76 2.34 7.96L2.34 7.96L2.34 7.96Q2.66 8.16 2.81 8.72L2.81 8.72L3.92 12.57L3.98 12.57L3.98 12.57Q4.14 12.10 4.30 11.54L4.30 11.54L4.30 11.54Q4.47 10.98 4.62 10.38L4.62 10.38L4.62 10.38Q4.77 9.79 4.91 9.19L4.91 9.19L4.91 9.19Q5.04 8.60 5.14 8.02L5.14 8.02L5.14 8.02Q5.64 7.76 6.24 7.76L6.24 7.76L6.24 7.76Q6.73 7.76 7.06 7.97L7.06 7.97L7.06 7.97Q7.38 8.18 7.38 8.69L7.38 8.69L7.38 8.69Q7.38 9.07 7.28 9.57L7.28 9.57L7.28 9.57Q7.18 10.07 7.02 10.63L7.02 10.63L7.02 10.63Q6.86 11.19 6.64 11.78L6.64 11.78L6.64 11.78Q6.43 12.38 6.19 12.95L6.19 12.95L6.19 12.95Q5.95 13.52 5.70 14.04L5.70 14.04L5.70 14.04Q5.45 14.55 5.21 14.95L5.21 14.95L5.21 14.95Q4.82 15.64 4.48 16.07L4.48 16.07L4.48 16.07Q4.14 16.51 3.84 16.75L3.84 16.75L3.84 16.75Q3.53 17.00 3.22 17.09L3.22 17.09L3.22 17.09Q2.91 17.18 2.58 17.18L2.58 17.18L2.58 17.18Q1.99 17.18 1.62 16.83L1.62 16.83L1.62 16.83Q1.26 16.48 1.19 15.92L1.19 15.92L1.19 15.92Q1.64 15.57 2.09 15.14L2.09 15.14L2.09 15.14Q2.53 14.71 2.90 14.27L2.90 14.27L2.90 14.27Q2.66 14.20 2.39 13.94L2.39 13.94L2.39 13.94Q2.11 13.68 1.79 12.96ZM15.48 11.30L15.48 11.30L15.48 11.30Q15.48 12.17 15.22 12.85L15.22 12.85L15.22 12.85Q14.95 13.52 14.47 13.99L14.47 13.99L14.47 13.99Q13.99 14.45 13.31 14.69L13.31 14.69L13.31 14.69Q12.64 14.92 11.82 14.92L11.82 14.92L11.82 14.92Q10.99 14.92 10.32 14.67L10.32 14.67L10.32 14.67Q9.65 14.42 9.16 13.95L9.16 13.95L9.16 13.95Q8.68 13.48 8.41 12.81L8.41 12.81L8.41 12.81Q8.15 12.14 8.15 11.30L8.15 11.30L8.15 11.30Q8.15 10.47 8.41 9.80L8.41 9.80L8.41 9.80Q8.68 9.13 9.16 8.66L9.16 8.66L9.16 8.66Q9.65 8.19 10.32 7.94L10.32 7.94L10.32 7.94Q10.99 7.69 11.82 7.69L11.82 7.69L11.82 7.69Q12.64 7.69 13.31 7.95L13.31 7.95L13.31 7.95Q13.99 8.20 14.47 8.67L14.47 8.67L14.47 8.67Q14.95 9.14 15.22 9.81L15.22 9.81L15.22 9.81Q15.48 10.49 15.48 11.30ZM10.58 11.30L10.58 11.30L10.58 11.30Q10.58 12.15 10.91 12.61L10.91 12.61L10.91 12.61Q11.24 13.06 11.83 13.06L11.83 13.06L11.83 13.06Q12.42 13.06 12.73 12.60L12.73 12.60L12.73 12.60Q13.05 12.14 13.05 11.30L13.05 11.30L13.05 11.30Q13.05 10.46 12.73 10.00L12.73 10.00L12.73 10.00Q12.40 9.55 11.82 9.55L11.82 9.55L11.82 9.55Q11.23 9.55 10.91 10.00L10.91 10.00L10.91 10.00Q10.58 10.46 10.58 11.30ZM19.77 7.69L19.77 7.69L19.77 7.69Q20.61 7.69 21.33 7.90L21.33 7.90L21.33 7.90Q22.05 8.12 22.57 8.57L22.57 8.57L22.57 8.57Q23.09 9.02 23.38 9.70L23.38 9.70L23.38 9.70Q23.67 10.37 23.67 11.31L23.67 11.31L23.67 11.31Q23.67 12.21 23.42 12.88L23.42 12.88L23.42 12.88Q23.17 13.55 22.71 14.01L22.71 14.01L22.71 14.01Q22.25 14.46 21.60 14.69L21.60 14.69L21.60 14.69Q20.94 14.91 20.15 14.91L20.15 14.91L20.15 14.91Q19.54 14.91 19.03 14.73L19.03 14.73L19.03 17.05L19.03 17.05Q18.89 17.09 18.58 17.14L18.58 17.14L18.58 17.14Q18.27 17.19 17.95 17.19L17.95 17.19L17.95 17.19Q17.64 17.19 17.39 17.15L17.39 17.15L17.39 17.15Q17.15 17.11 16.98 16.98L16.98 16.98L16.98 16.98Q16.81 16.86 16.73 16.64L16.73 16.64L16.73 16.64Q16.65 16.42 16.65 16.07L16.65 16.07L16.65 9.35L16.65 9.35Q16.65 8.97 16.81 8.74L16.81 8.74L16.81 8.74Q16.97 8.50 17.25 8.30L17.25 8.30L17.25 8.30Q17.68 8.02 18.33 7.85L18.33 7.85L18.33 7.85Q18.97 7.69 19.77 7.69ZM19.80 13.03L19.80 13.03L19.80 13.03Q21.24 13.03 21.24 11.31L21.24 11.31L21.24 11.31Q21.24 10.42 20.88 9.98L20.88 9.98L20.88 9.98Q20.52 9.55 19.85 9.55L19.85 9.55L19.85 9.55Q19.59 9.55 19.38 9.61L19.38 9.61L19.38 9.61Q19.17 9.67 19.01 9.76L19.01 9.76L19.01 12.84L19.01 12.84Q19.18 12.92 19.38 12.98L19.38 12.98L19.38 12.98Q19.57 13.03 19.80 13.03ZM28.43 14.92L28.43 14.92L28.43 14.92Q27.61 14.92 26.90 14.69L26.90 14.69L26.90 14.69Q26.19 14.46 25.67 14.00L25.67 14.00L25.67 14.00Q25.14 13.54 24.84 12.84L24.84 12.84L24.84 12.84Q24.54 12.14 24.54 11.20L24.54 11.20L24.54 11.20Q24.54 10.28 24.84 9.61L24.84 9.61L24.84 9.61Q25.14 8.95 25.63 8.52L25.63 8.52L25.63 8.52Q26.12 8.09 26.75 7.89L26.75 7.89L26.75 7.89Q27.38 7.69 28.04 7.69L28.04 7.69L28.04 7.69Q28.78 7.69 29.39 7.91L29.39 7.91L29.39 7.91Q30.00 8.13 30.44 8.53L30.44 8.53L30.44 8.53Q30.88 8.92 31.13 9.46L31.13 9.46L31.13 9.46Q31.37 10.01 31.37 10.65L31.37 10.65L31.37 10.65Q31.37 11.13 31.11 11.38L31.11 11.38L31.11 11.38Q30.84 11.63 30.37 11.70L30.37 11.70L26.91 12.22L26.91 12.22Q27.06 12.68 27.54 12.92L27.54 12.92L27.54 12.92Q28.01 13.15 28.63 13.15L28.63 13.15L28.63 13.15Q29.20 13.15 29.71 13.00L29.71 13.00L29.71 13.00Q30.23 12.85 30.55 12.66L30.55 12.66L30.55 12.66Q30.77 12.80 30.93 13.05L30.93 13.05L30.93 13.05Q31.08 13.30 31.08 13.58L31.08 13.58L31.08 13.58Q31.08 14.21 30.49 14.52L30.49 14.52L30.49 14.52Q30.04 14.76 29.48 14.84L29.48 14.84L29.48 14.84Q28.92 14.92 28.43 14.92ZM28.04 9.42L28.04 9.42L28.04 9.42Q27.71 9.42 27.46 9.53L27.46 9.53L27.46 9.53Q27.22 9.65 27.06 9.82L27.06 9.82L27.06 9.82Q26.91 10.00 26.83 10.21L26.83 10.21L26.83 10.21Q26.75 10.43 26.74 10.65L26.74 10.65L29.13 10.26L29.13 10.26Q29.09 9.98 28.83 9.70L28.83 9.70L28.83 9.70Q28.56 9.42 28.04 9.42ZM35.78 7.69L35.78 7.69L35.78 7.69Q36.36 7.69 36.91 7.85L36.91 7.85L36.91 7.85Q37.46 8.01 37.87 8.33L37.87 8.33L37.87 8.33Q38.29 8.05 38.81 7.87L38.81 7.87L38.81 7.87Q39.34 7.69 40.08 7.69L40.08 7.69L40.08 7.69Q40.61 7.69 41.13 7.83L41.13 7.83L41.13 7.83Q41.64 7.97 42.03 8.27L42.03 8.27L42.03 8.27Q42.43 8.57 42.67 9.07L42.67 9.07L42.67 9.07Q42.91 9.56 42.91 10.28L42.91 10.28L42.91 14.69L42.91 14.69Q42.77 14.73 42.47 14.77L42.47 14.77L42.47 14.77Q42.17 14.81 41.85 14.81L41.85 14.81L41.85 14.81Q41.54 14.81 41.29 14.77L41.29 14.77L41.29 14.77Q41.05 14.73 40.88 14.60L40.88 14.60L40.88 14.60Q40.71 14.48 40.62 14.26L40.62 14.26L40.62 14.26Q40.53 14.04 40.53 13.69L40.53 13.69L40.53 10.35L40.53 10.35Q40.53 9.93 40.29 9.74L40.29 9.74L40.29 9.74Q40.05 9.55 39.65 9.55L39.65 9.55L39.65 9.55Q39.45 9.55 39.23 9.64L39.23 9.64L39.23 9.64Q39.00 9.73 38.89 9.83L38.89 9.83L38.89 9.83Q38.91 9.88 38.91 9.93L38.91 9.93L38.91 9.93Q38.91 9.98 38.91 10.02L38.91 10.02L38.91 14.69L38.91 14.69Q38.75 14.73 38.45 14.77L38.45 14.77L38.45 14.77Q38.15 14.81 37.84 14.81L37.84 14.81L37.84 14.81Q37.53 14.81 37.29 14.77L37.29 14.77L37.29 14.77Q37.04 14.73 36.88 14.60L36.88 14.60L36.88 14.60Q36.71 14.48 36.62 14.26L36.62 14.26L36.62 14.26Q36.53 14.04 36.53 13.69L36.53 13.69L36.53 10.35L36.53 10.35Q36.53 9.93 36.27 9.74L36.27 9.74L36.27 9.74Q36.01 9.55 35.64 9.55L35.64 9.55L35.64 9.55Q35.39 9.55 35.21 9.63L35.21 9.63L35.21 9.63Q35.03 9.70 34.90 9.77L34.90 9.77L34.90 14.69L34.90 14.69Q34.76 14.73 34.46 14.77L34.46 14.77L34.46 14.77Q34.16 14.81 33.84 14.81L33.84 14.81L33.84 14.81Q33.53 14.81 33.29 14.77L33.29 14.77L33.29 14.77Q33.04 14.73 32.87 14.60L32.87 14.60L32.87 14.60Q32.70 14.48 32.61 14.26L32.61 14.26L32.61 14.26Q32.52 14.04 32.52 13.69L32.52 13.69L32.52 9.46L32.52 9.46Q32.52 9.09 32.68 8.86L32.68 8.86L32.68 8.86Q32.84 8.64 33.12 8.44L33.12 8.44L33.12 8.44Q33.60 8.11 34.31 7.90L34.31 7.90L34.31 7.90Q35.01 7.69 35.78 7.69Z"
                    ></path>
                  </g>
                </svg>
              </a>
              <div>
              <amp-state id="darkClass">
              ${ampScript}
              </div>
            </div>
          </header>
          ${adsBelowHeaderHtml.join("")}
          <main>
            <article class="amp-article">
              <header class="amp-article-header">
                <h1 class="amp-article-title">${article.title}</h1>
                <div class="amp-author-container">
                  <div class="amp-author">
                      <a href="${env.NEXT_PUBLIC_SITE_URL}/artice/user/${article.authors[0].username!}"
                        >${article.authors[0].name!}</a
                      >
                  </div>
                </div>
              </header>
              <figure class="amp-article-image">
                <amp-img
                  noloading
                  data-hero
                  src="${article.featuredImage.url}"
                  width="600"
                  height="340"
                  layout="responsive"
                  alt="${article.title}"
                ></amp-img>
              </figure>
              ${adsSingleArticleAboveHtml.join("")}
              <section class="amp-article-content">
                ${htmlcontent.firstCleanHtml}
                ${adsSingleArticleInlineHtml.join("")}
                ${htmlcontent.secondCleanHtml}
              </section>
              ${adsSingleArticleBelowHtml.join("")}
                <div class="amp-topic-list">
                  ${article.topics
                    .map((topic) => {
                      return `<a href="${env.NEXT_PUBLIC_SITE_URL}/article/topic/${topic.slug}" rel="topics tag">${topic.title}</a>`
                    })
                    .join(" ")}
                </div>
            ${ampShare}
            ${ampComment}
            </article>
          </main>
          <footer class="amp-footer-container">
            <div class="amp-footer-copy">
              &copy; ${JSON.stringify(new Date().getFullYear())} ${env.NEXT_PUBLIC_SITE_TITLE}
            </div>
          </footer>
        </div>
      </body>
    </html>`

  return new Response(ampLayout, {
    headers: { "content-type": "text/html" },
  })
}
