import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const isProdEnv = process.env.NODE_ENV === 'production'
const isVercelProd = process.env.VERCEL_ENV === 'production'

const PROD_CSP = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://cdn.tldraw.com",
  "font-src 'self' data: https://cdn.tldraw.com https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "script-src 'self'",
  "connect-src 'self' https://cdn.tldraw.com",
  "worker-src 'self' blob:",
  "media-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
].join('; ')

const PREVIEW_CSP = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://cdn.tldraw.com https://vercel.live",
  "font-src 'self' data: https://cdn.tldraw.com https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
  "connect-src 'self' ws: wss: https://cdn.tldraw.com https://vercel.live wss://vercel.live",
  "worker-src 'self' blob:",
  "media-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
].join('; ')

const nextConfig: NextConfig = {
  async headers() {
    if (!isProdEnv) return []
    const value = isVercelProd ? PROD_CSP : PREVIEW_CSP
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value }],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
