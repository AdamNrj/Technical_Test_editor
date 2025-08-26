'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Monitor, Moon, Sun, Contrast, Eye } from 'lucide-react'

type Theme =
  | 'light'
  | 'dark'
  | 'high-contrast'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'

interface ThemeSwitcherProps {
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
  translations: {
    light: string
    dark: string
    highContrast: string
    protanopia: string
    deuteranopia: string
    tritanopia: string
    changeTheme: string
  }
}

export function ThemeSwitcher({
  currentTheme,
  onThemeChange,
  translations,
}: ThemeSwitcherProps) {
  const themes = [
    { value: 'light' as const, label: translations.light, icon: Sun },
    { value: 'dark' as const, label: translations.dark, icon: Moon },
    {
      value: 'high-contrast' as const,
      label: translations.highContrast,
      icon: Contrast,
    },
    { value: 'protanopia' as const, label: translations.protanopia, icon: Eye },
    {
      value: 'deuteranopia' as const,
      label: translations.deuteranopia,
      icon: Eye,
    },
    { value: 'tritanopia' as const, label: translations.tritanopia, icon: Eye },
  ]

  const currentThemeConfig = themes.find(
    (theme) => theme.value === currentTheme
  )
  const CurrentIcon = currentThemeConfig?.icon || Monitor

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label={translations.changeTheme}
        >
          <CurrentIcon className="h-4 w-4" />
          <span className="sr-only">{translations.changeTheme}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((theme) => {
          const Icon = theme.icon
          return (
            <DropdownMenuItem
              key={theme.value}
              onClick={() => onThemeChange(theme.value)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Icon className="h-4 w-4" />
              <span>{theme.label}</span>
              {currentTheme === theme.value && (
                <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
