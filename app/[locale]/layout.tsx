import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { Toaster } from '@/components/ui/sonner'
import { getMessages } from 'next-intl/server'
import { Space_Grotesk } from 'next/font/google'
import { TrpcProvider } from '@/modules/editor/presentation/store/client'
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
  generator: 'manuel.app',
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

  const messages = await getMessages({ locale })

  return (
    <html lang={locale}>
      <body className={`font-sans ${spaceGrotesk.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TrpcProvider>{children}</TrpcProvider>
          <Toaster richColors position="top-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
