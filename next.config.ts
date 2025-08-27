import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const isDev = process.env.NODE_ENV !== 'production'

const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "img-src 'self' data: blob: https://cdn.tldraw.com",
  "font-src 'self' data: https://cdn.tldraw.com https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tldraw.com",
  isDev
    ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
    : "script-src 'self'",
  "connect-src 'self' blob: ws: wss: https://cdn.tldraw.com",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
].join('; ')

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: cspDirectives }],
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
