import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

import "dotenv/config"

function getProtocol() {
  if (process.env.APP_ENV === "development") {
    return "http://"
  }
  return "https://"
}

const env = createEnv({
  server: {
    APP_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DATABASE_URL: z.string().min(1),
    DATABASE_AUTH_TOKEN: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_REDIRECT_URL: z.string().min(1),
    R2_REGION: z.string().min(1),
    R2_ACCOUNT_ID: z.string().min(1),
    R2_ACCESS_KEY: z.string().min(1),
    R2_SECRET_KEY: z.string().min(1),
    R2_DOMAIN: z.string().min(1),
    R2_BUCKET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_SITE_URL: z.string().min(1),
    NEXT_PUBLIC_API: z.string().min(1),
    NEXT_PUBLIC_SITE_TITLE: z.string().min(1),
    NEXT_PUBLIC_SITE_DESCRIPTION: z.string().min(1),
    NEXT_PUBLIC_LOGO_URL: z.string().min(1),
    NEXT_PUBLIC_LOGO_OG_URL: z.string().min(1),
    NEXT_PUBLIC_LOGO_OG_WIDTH: z.string().min(1),
    NEXT_PUBLIC_LOGO_OG_HEIGHT: z.string().min(1),
    NEXT_PUBLIC_FACEBOOK_USERNAME: z.string().min(1),
    NEXT_PUBLIC_INSTAGRAM_USERNAME: z.string().min(1),
    NEXT_PUBLIC_TIKTOK_USERNAME: z.string().min(1),
    NEXT_PUBLIC_WHATSAPP_CHANNEL_USERNAME: z.string().min(1),
    NEXT_PUBLIC_X_USERNAME: z.string().min(1),
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1),
    NEXT_PUBLIC_ADSENSE_CLIENT_ID: z.string().min(1),
  },
  runtimeEnv: {
    APP_ENV: process.env.APP_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL,
    NEXT_PUBLIC_SITE_URL: getProtocol() + process.env.NEXT_PUBLIC_DOMAIN,
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
    NEXT_PUBLIC_SITE_TITLE: process.env.NEXT_PUBLIC_SITE_TITLE,
    NEXT_PUBLIC_SITE_DESCRIPTION: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
    NEXT_PUBLIC_LOGO_URL: process.env.NEXT_PUBLIC_LOGO_OG_URL,
    NEXT_PUBLIC_LOGO_OG_URL: process.env.NEXT_PUBLIC_LOGO_OG_URL,
    NEXT_PUBLIC_LOGO_OG_WIDTH: process.env.NEXT_PUBLIC_LOGO_OG_WIDTH,
    NEXT_PUBLIC_LOGO_OG_HEIGHT: process.env.NEXT_PUBLIC_LOGO_OG_HEIGHT,
    NEXT_PUBLIC_FACEBOOK_USERNAME: process.env.NEXT_PUBLIC_FACEBOOK_USERNAME,
    NEXT_PUBLIC_INSTAGRAM_USERNAME: process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME,
    NEXT_PUBLIC_TIKTOK_USERNAME: process.env.NEXT_PUBLIC_TIKTOK_USERNAME,
    NEXT_PUBLIC_WHATSAPP_CHANNEL_USERNAME:
      process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_USERNAME,
    NEXT_PUBLIC_X_USERNAME: process.env.NEXT_PUBLIC_X_USERNAME,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_ADSENSE_CLIENT_ID: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
    R2_REGION: process.env.R2_REGION,
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY: process.env.R2_ACCESS_KEY,
    R2_SECRET_KEY: process.env.R2_SECRET_KEY,
    R2_DOMAIN: process.env.R2_DOMAIN,
    R2_BUCKET: process.env.R2_BUCKET,
  },
})

export default env
