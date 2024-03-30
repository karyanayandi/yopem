/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    adsbygoogle: any
    gtag: any
    dataLayer: any
  }

  declare module NodeJS {
    interface Process extends NodeJS.Process {
      browser?: string
    }
  }
}
