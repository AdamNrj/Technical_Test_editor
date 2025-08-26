// app/[locale]/layout.tsx
import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { getMessages } from 'next-intl/server'
import { Space_Grotesk } from 'next/font/google'

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

// Type guard para estrechar de string -> Locale
function isLocale(input: string): input is Locale {
  return (routing.locales as readonly string[]).includes(input)
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  // En Next 15, params es Promise
  params: Promise<{ locale: string }>
}>) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }
  // A partir de aquí, TS sabe que es "en" | "es"
  const locale: Locale = rawLocale

  const messages = await getMessages({ locale })

  return (
    <html lang={locale}>
      <body className={`font-sans ${spaceGrotesk.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
