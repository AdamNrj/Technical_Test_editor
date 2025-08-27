import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const isDev = process.env.NODE_ENV !== 'production'
const isPreview =
  !!process.env.VERCEL && process.env.VERCEL_ENV !== 'production'

const csp = [
  "default-src 'self'",
  `script-src 'self' ${isDev ? "'unsafe-eval'" : ''} 'unsafe-inline' ${
    isPreview ? 'https://vercel.live' : ''
  }`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://cdn.tldraw.com",
  "font-src 'self' data: https://cdn.tldraw.com https://fonts.gstatic.com",
  `connect-src 'self' ws: wss: https://cdn.tldraw.com ${
    isPreview ? 'https://vercel.live wss://vercel.live' : ''
  }`,
  "object-src 'none'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
].join('; ')

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
