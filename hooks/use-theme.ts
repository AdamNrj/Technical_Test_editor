'use client'

import { useState, useEffect } from 'react'

type Theme =
  | 'light'
  | 'dark'
  | 'high-contrast'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement

    // Remove all theme classes
    root.classList.remove(
      'dark',
      'high-contrast',
      'protanopia',
      'deuteranopia',
      'tritanopia'
    )

    // Apply new theme class
    if (newTheme !== 'light') {
      root.classList.add(newTheme)
    }
  }

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return { theme, changeTheme }
}
