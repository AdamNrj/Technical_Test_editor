import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { Toaster } from '@/components/ui/sonner'
import { getMessages } from 'next-intl/server'
import { Space_Grotesk } from 'next/font/google'
import { TrpcProvider } from '@/modules/editor/presentation/store/client'
import { headers } from 'next/headers'

import '../globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Visual Editor - Modern Diagram Creation',
  description:
    'Create and edit diagrams with our modern visual editor based on tldraw',
  generator: 'v0.app',
}

function isLocale(input: string): input is Locale {
  return (routing.locales as readonly string[]).includes(input)
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()
  const locale: Locale = rawLocale
  const hdrs = headers()
  const nonce = (await hdrs).get('x-nonce') ?? ''

  const isDev = process.env.NODE_ENV !== 'production'
  const isVercel = !!process.env.VERCEL
  const isPreview = isVercel && process.env.VERCEL_ENV !== 'production'
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' ${
      isDev ? "'unsafe-eval' 'unsafe-inline'" : ''
    } ${isPreview ? 'https://vercel.live' : ''}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://cdn.tldraw.com",
    "font-src 'self' data: https://cdn.tldraw.com https://fonts.gstatic.com",
    `connect-src 'self' ws: wss: https://cdn.tldraw.com ${
      isPreview ? 'https://vercel.live wss://vercel.live' : ''
    }`,
    "media-src 'self' blob:",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
  ].join('; ')

  const messages = await getMessages({ locale })

  return (
    <html lang={locale}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
      </head>
      <body className={`font-sans ${spaceGrotesk.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TrpcProvider>{children}</TrpcProvider>
          <Toaster richColors position="top-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
