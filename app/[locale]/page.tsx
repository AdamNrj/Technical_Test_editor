'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LangSwitcher } from '@/components/commons/lang-switcher'
import { ThemeSwitcher } from '@/components/commons/theme-switcher'
import { useTheme } from '@/hooks/use-theme'
import { ArrowRight, Zap, Palette, Globe } from 'lucide-react'

type Locale = 'en' | 'es'

export default function HomePage() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const { theme, changeTheme } = useTheme()

  const tHome = useTranslations('HomePage')
  const tTheme = useTranslations('Theme')

  function navigateToLocale(next: Locale) {
    const parts = pathname.split('/')
    const newPath = '/' + [next, ...parts.slice(2)].filter(Boolean).join('/')
    router.push(newPath || `/${next}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Palette className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                {tHome('title')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <LangSwitcher
                currentLang={locale}
                onLanguageChange={navigateToLocale}
              />
              <ThemeSwitcher
                currentTheme={theme}
                onThemeChange={changeTheme}
                translations={{
                  light: tTheme('light'),
                  dark: tTheme('dark'),
                  highContrast: tTheme('highContrast'),
                  protanopia: tTheme('protanopia'),
                  deuteranopia: tTheme('deuteranopia'),
                  tritanopia: tTheme('tritanopia'),
                  changeTheme: tTheme('changeTheme'),
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              {tHome('title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {tHome('subtitle')}
            </p>

            <Link href={`/${locale}/editor`}>
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              >
                {tHome('openEditor')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="group p-6 border-border bg-card text-card-foreground hover:bg-accent/10 hover:shadow-lg transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-ring">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {' '}
                {tHome('featureFastTitle')}{' '}
              </h3>
              <p className="text-muted-foreground">
                {' '}
                {tHome('featureFastDesc')}{' '}
              </p>
            </Card>

            <Card className="group p-6 border-border bg-card text-card-foreground hover:bg-accent/10 hover:shadow-lg transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-ring">
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 mx-auto">
                <Palette className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {' '}
                {tHome('featureModernTitle')}{' '}
              </h3>
              <p className="text-muted-foreground">
                {' '}
                {tHome('featureModernDesc')}{' '}
              </p>
            </Card>

            <Card className="group p-6 border-border bg-card text-card-foreground hover:bg-accent/10 hover:shadow-lg transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-ring">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {' '}
                {tHome('featureAccessibleTitle')}{' '}
              </h3>
              <p className="text-muted-foreground">
                {' '}
                {tHome('featureAccessibleDesc')}{' '}
              </p>
            </Card>
          </div>

          {/* CTA */}
          <div className="rounded-2xl p-8 border border-border bg-muted/40 text-foreground">
            <h2 className="text-2xl font-semibold mb-4">{tHome('ctaTitle')}</h2>
            <p className="text-muted-foreground mb-6">{tHome('ctaDesc')}</p>
            <Link href={`/${locale}/editor`}>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl bg-background hover:bg-accent/10 cursor-pointer"
              >
                {tHome('openEditor')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">{tHome('footerNote')}</p>
        </div>
      </footer>
    </div>
  )
}
