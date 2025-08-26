'use client'

import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

type Language = 'en' | 'es'

interface LangSwitcherProps {
  currentLang: Language
  onLanguageChange: (lang: Language) => void
}

export function LangSwitcher({
  currentLang,
  onLanguageChange,
}: LangSwitcherProps) {
  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'es' : 'en'
    onLanguageChange(newLang)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label={`Switch to ${currentLang === 'en' ? 'Spanish' : 'English'}`}
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium uppercase">
        {currentLang === 'en' ? 'ES' : 'EN'}
      </span>
    </Button>
  )
}
