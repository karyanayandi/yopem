import withBundleAnalyzer from "@next/bundle-analyzer"
import million from "million/compiler"

const boolVals = {
  true: true,
  false: false,
}

const enableMillionJS =
  boolVals[process.env.ENABLE_MILLION_JS] ??
  process.env.APP_ENV === "production"

const plugins = [withBundleAnalyzer]

const securityHeaders = [
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Accept-Encoding", value: "gzip, compress, br" },
]

const config = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.yopem.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ]
  },
}

for (const plugin of plugins) {
  Object.assign(config, plugin(config))
}

const millionConfig = {
  auto: {
    threshold: 0.05,
    skip: [],
    auto: { rsc: true },
  },

  mute: true,
}

const getConfig = () => {
  if (enableMillionJS) {
    return million.next(config, millionConfig)
  }

  return config
}

export default getConfig
