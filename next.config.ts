import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",

              "img-src 'self' data: blob: https://cdn.tldraw.com",

              "font-src 'self' data: https://cdn.tldraw.com https://fonts.gstatic.com",

              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",

              "connect-src 'self' ws: wss: https://cdn.tldraw.com",

              "media-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
