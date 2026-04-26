declare module "next-pwa" {
  import type { NextConfig } from "next"

  interface PWAConfig {
    dest?: string
    disable?: boolean
    register?: boolean
    skipWaiting?: boolean
    sw?: string
    scope?: string
    publicExcludes?: string[]
    buildExcludes?: (string | RegExp)[]
    fallbacks?: {
      document?: string
      image?: string
      font?: string
      audio?: string
      video?: string
    }
  }

  function withPWAInit(config: PWAConfig): (nextConfig: NextConfig) => NextConfig

  export = withPWAInit
}
