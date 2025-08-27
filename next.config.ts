import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin()

const disableCsp =
  process.env.NEXT_PUBLIC_DISABLE_CSP === '1' ||
  process.env.VERCEL_ENV !== 'production'

const PROD_CSP = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://cdn.tldraw.com",
  "font-src 'self' data: https://fonts.gstatic.com https://cdn.tldraw.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "script-src 'self'", // sin inline/eval en prod
  "connect-src 'self' https://cdn.tldraw.com",
  "worker-src 'self' blob:",
  "media-src 'self' blob:",
].join('; ')

export default withNextIntl({
  async headers() {
    if (disableCsp) return []
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: PROD_CSP }],
      },
    ]
  },
})
