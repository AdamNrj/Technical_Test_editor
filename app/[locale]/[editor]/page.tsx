'use client'

import type React from 'react'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Toolbar } from '@/components/commons/toolbar'
import { SaveIndicator } from '@/components/commons/save-indicator'
import { LangSwitcher } from '@/components/commons/lang-switcher'
import { ThemeSwitcher } from '@/components/commons/theme-switcher'
import { CommandBar } from '@/components/commons/command-bar'
import { AccessibilityAnnouncer } from '@/components/commons/accessibility-announcer'
import { SkipLink } from '@/components/commons/skip-link'
import { useTheme } from '@/hooks/use-theme'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { ArrowLeft, Palette, FileText, Command } from 'lucide-react'

type SaveStatus = 'saved' | 'saving' | 'error'
type Locale = 'en' | 'es'
type ThemeMode =
  | 'light'
  | 'dark'
  | 'high-contrast'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'

export default function EditorPage() {
  // i18n (usa el locale real de next-intl)
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const tEditor = useTranslations('Editor')
  const tSave = useTranslations('SaveStatus')
  const tCmd = useTranslations('CommandBar')
  const tTheme = useTranslations('Theme')

  // estado UI
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const [documentTitle, setDocumentTitle] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const { theme, changeTheme } = useTheme()

  // helper: cambiar idioma navegando (reemplaza el prefijo /en o /es)
  function navigateToLocale(next: Locale) {
    const parts = pathname.split('/')
    // parts[0] = "", parts[1] = locale actual
    const newPath = '/' + [next, ...parts.slice(2)].filter(Boolean).join('/')
    router.push(newPath || `/${next}`)
  }

  // helper: traducir modo de tema a key de Theme.*
  function themeKeyFor(
    mode: ThemeMode
  ):
    | 'light'
    | 'dark'
    | 'highContrast'
    | 'protanopia'
    | 'deuteranopia'
    | 'tritanopia' {
    if (mode === 'high-contrast') return 'highContrast'
    return mode as never
  }

  const handleSave = () => {
    setSaveStatus('saving')
    setAnnouncement(tSave('saving'))
    setTimeout(() => {
      setSaveStatus('saved')
      setAnnouncement(tSave('saved'))
    }, 1000)
  }

  const handleModifyShape = () => {
    setSaveStatus('saving')
    setAnnouncement(
      locale === 'en' ? 'Modifying shape...' : 'Modificando figura...'
    )
    setTimeout(() => {
      setSaveStatus('saved')
      setAnnouncement(locale === 'en' ? 'Shape modified' : 'Figura modificada')
    }, 2000)
  }

  const handleAutoOrganize = () => {
    setSaveStatus('saving')
    setAnnouncement(
      locale === 'en'
        ? 'Auto-organizing elements...'
        : 'Auto-organizando elementos...'
    )
    setTimeout(() => {
      setSaveStatus('saved')
      setAnnouncement(
        locale === 'en' ? 'Elements organized' : 'Elementos organizados'
      )
    }, 1500)
  }

  const handleUndo = () => {
    setAnnouncement(
      locale === 'en' ? 'Undoing last action' : 'Deshaciendo última acción'
    )
  }

  const handleRedo = () => {
    setAnnouncement(
      locale === 'en' ? 'Redoing last action' : 'Rehaciendo última acción'
    )
  }

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 25, 500)
    setZoomLevel(newZoom)
    setAnnouncement(`${locale === 'en' ? 'Zoom:' : 'Zoom:'} ${newZoom}%`)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 25, 25)
    setZoomLevel(newZoom)
    setAnnouncement(`${locale === 'en' ? 'Zoom:' : 'Zoom:'} ${newZoom}%`)
  }

  const handleResetView = () => {
    setZoomLevel(100)
    setAnnouncement(
      locale === 'en' ? 'View reset to 100%' : 'Vista restablecida al 100%'
    )
  }

  const handleToggleTheme = () => {
    const modes: ThemeMode[] = [
      'light',
      'dark',
      'high-contrast',
      'protanopia',
      'deuteranopia',
      'tritanopia',
    ]
    const currentIndex = modes.indexOf(theme as ThemeMode)
    const nextTheme = modes[(currentIndex + 1) % modes.length]
    changeTheme(nextTheme)
    const key = themeKeyFor(nextTheme)
    // Mensaje accesible: "Change theme: Dark"
    setAnnouncement(`${tTheme('changeTheme')}: ${tTheme(key as never)}`)
  }

  const handleToggleLanguage = () => {
    const next = locale === 'en' ? 'es' : 'en'
    navigateToLocale(next)
    setAnnouncement(
      next === 'en'
        ? 'Language changed to English'
        : 'Idioma cambiado a Español'
    )
  }

  useKeyboardShortcuts({
    onModifyShape: handleModifyShape,
    onAutoOrganize: handleAutoOrganize,
    onToggleTheme: handleToggleTheme,
    onToggleLanguage: handleToggleLanguage,
    onSave: handleSave,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onResetView: handleResetView,
    onOpenCommandBar: () => setIsCommandBarOpen(true),
  })

  const handleDocumentTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDocumentTitle(e.target.value)
    setSaveStatus('saving')
    setTimeout(() => setSaveStatus('saved'), 1000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SkipLink href="#main-content">
        {locale === 'en'
          ? 'Skip to main content'
          : 'Saltar al contenido principal'}
      </SkipLink>
      <SkipLink href="#canvas-area">
        {locale === 'en' ? 'Skip to canvas' : 'Saltar al lienzo'}
      </SkipLink>

      <AccessibilityAnnouncer message={announcement} />

      <CommandBar
        isOpen={isCommandBarOpen}
        onClose={() => setIsCommandBarOpen(false)}
        onModifyShape={handleModifyShape}
        onAutoOrganize={handleAutoOrganize}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onSave={handleSave}
        onToggleTheme={handleToggleTheme}
        onToggleLanguage={handleToggleLanguage}
        translations={{
          searchPlaceholder: tCmd('searchPlaceholder'),
          modifyShape: tEditor('modifyShape'),
          autoOrganize: tEditor('autoOrganize'),
          undo: tEditor('undo'),
          redo: tEditor('redo'),
          zoomIn: tEditor('zoomIn'),
          zoomOut: tEditor('zoomOut'),
          resetView: tEditor('resetView'),
          save: tEditor('save'),
          toggleTheme: tEditor('toggleTheme'),
          toggleLanguage: tEditor('toggleLanguage'),
        }}
      />

      {/* Top Navigation Bar */}
      <header
        className="border-b border-border bg-card/50 backdrop-blur-sm"
        role="banner"
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section - Back button and Document Title */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 btn-hover-effect"
                  aria-label={
                    locale === 'en'
                      ? 'Go back to home page'
                      : 'Volver a la página principal'
                  }
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {locale === 'en' ? 'Back' : 'Volver'}
                  </span>
                </Button>
              </Link>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText
                  className="h-4 w-4 text-muted-foreground flex-shrink-0"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={documentTitle}
                  onChange={handleDocumentTitleChange}
                  placeholder={tEditor('documentTitle')}
                  className="bg-transparent border-none outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground flex-1 min-w-0 focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-2 py-1 transition-all duration-150"
                  aria-label={
                    locale === 'en' ? 'Document title' : 'Título del documento'
                  }
                  aria-describedby="title-help"
                />
                <span id="title-help" className="sr-only">
                  {locale === 'en'
                    ? 'Enter a title for your document. Changes are saved automatically.'
                    : 'Ingresa un título para tu documento. Los cambios se guardan automáticamente.'}
                </span>
              </div>
            </div>

            {/* Center Section - Toolbar */}
            <div className="hidden lg:flex">
              <Toolbar
                onModifyShape={handleModifyShape}
                onAutoOrganize={handleAutoOrganize}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetView={handleResetView}
                onSave={handleSave}
                translations={{
                  modifyShape: tEditor('modifyShape'),
                  autoOrganize: tEditor('autoOrganize'),
                  undo: tEditor('undo'),
                  redo: tEditor('redo'),
                  zoomIn: tEditor('zoomIn'),
                  zoomOut: tEditor('zoomOut'),
                  resetView: tEditor('resetView'),
                  save: tEditor('save'),
                }}
              />
            </div>

            {/* Right Section - Save Status and Controls */}
            <div
              className="flex items-center gap-3"
              role="group"
              aria-label={
                locale === 'en' ? 'Editor controls' : 'Controles del editor'
              }
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCommandBarOpen(true)}
                className="hidden md:flex items-center gap-2 btn-hover-effect"
                aria-label={
                  locale === 'en'
                    ? 'Open command bar (Ctrl+K)'
                    : 'Abrir barra de comandos (Ctrl+K)'
                }
              >
                <Command className="h-4 w-4" />
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
                  ⌘K
                </kbd>
              </Button>

              <SaveIndicator
                status={saveStatus}
                translations={{
                  saved: tSave('saved'),
                  saving: tSave('saving'),
                  error: tSave('error'),
                }}
              />

              <Separator orientation="vertical" className="h-6" />

              {/* LangSwitcher: pasar el locale real y navegar al cambiar */}
              <LangSwitcher
                currentLang={locale}
                onLanguageChange={(l: Locale) => navigateToLocale(l)}
              />
              {/* ThemeSwitcher: pasar labels traducidos */}
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

          {/* Mobile Toolbar */}
          <div className="lg:hidden mt-3 pt-3 border-t border-border">
            <Toolbar
              onModifyShape={handleModifyShape}
              onAutoOrganize={handleAutoOrganize}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onResetView={handleResetView}
              onSave={handleSave}
              translations={{
                modifyShape: tEditor('modifyShape'),
                autoOrganize: tEditor('autoOrganize'),
                undo: tEditor('undo'),
                redo: tEditor('redo'),
                zoomIn: tEditor('zoomIn'),
                zoomOut: tEditor('zoomOut'),
                resetView: tEditor('resetView'),
                save: tEditor('save'),
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Editor Area */}
      <main
        className="flex-1 p-4 gap-4 flex flex-col"
        id="main-content"
        role="main"
      >
        {/* Canvas Container */}
        <Card
          className="flex-1 border-border bg-card relative overflow-hidden min-h-0 shadow-sm"
          role="application"
          aria-label={locale === 'en' ? 'Drawing canvas' : 'Lienzo de dibujo'}
        >
          {/* Canvas Placeholder - This is where tldraw will be integrated */}
          <div
            className="absolute inset-4 bg-background rounded-lg border-2 border-dashed border-border flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-150"
            id="canvas-area"
            tabIndex={0}
            role="img"
            aria-label={
              locale === 'en'
                ? 'Canvas area for drawing and editing diagrams'
                : 'Área del lienzo para dibujar y editar diagramas'
            }
          >
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Palette className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {locale === 'en' ? 'Canvas Area' : 'Área del Lienzo'}
              </h3>
              <p className="text-muted-foreground max-w-md mb-4">
                {locale === 'en'
                  ? 'This is where the tldraw canvas will be integrated. The area takes up 80% of the viewport height for optimal drawing space.'
                  : 'Aquí es donde se integrará el lienzo de tldraw. El área ocupa el 80% de la altura de la ventana para un espacio de dibujo óptimo.'}
              </p>
              <div className="mt-4 flex gap-2 justify-center flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleModifyShape}
                  className="bg-transparent btn-hover-effect"
                  aria-describedby="modify-shortcut"
                >
                  {tEditor('modifyShape')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAutoOrganize}
                  className="bg-transparent btn-hover-effect"
                  aria-describedby="organize-shortcut"
                >
                  {tEditor('autoOrganize')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCommandBarOpen(true)}
                  className="bg-transparent btn-hover-effect"
                >
                  <Command className="h-4 w-4 mr-2" />
                  {tCmd('commandBar')}
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas Grid Overlay (Optional) */}
          <div
            className="absolute inset-4 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
            aria-hidden="true"
          />
        </Card>

        {/* Status Bar */}
        <div
          className="flex items-center justify-between text-xs text-muted-foreground bg-card px-4 py-2 rounded-lg border border-border shadow-sm"
          role="status"
          aria-label={locale === 'en' ? 'Editor status' : 'Estado del editor'}
        >
          <div className="flex items-center gap-4">
            <span>{locale === 'en' ? 'Ready' : 'Listo'}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>
              {locale === 'en' ? 'Zoom:' : 'Zoom:'} {zoomLevel}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              {locale === 'en' ? 'Theme:' : 'Tema:'}{' '}
              {tTheme(themeKeyFor(theme as ThemeMode))}
            </span>
          </div>
        </div>

        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer hover:text-foreground transition-colors">
            {locale === 'en' ? 'Keyboard Shortcuts' : 'Atajos de Teclado'}
          </summary>
          <div className="mt-2 p-3 bg-card rounded border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">
                  Ctrl+K
                </kbd>{' '}
                {tCmd('commandBar')}
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">
                  Ctrl+S
                </kbd>{' '}
                {tEditor('save')}
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">
                  Ctrl+Z
                </kbd>{' '}
                {tEditor('undo')}
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">
                  Ctrl+Y
                </kbd>{' '}
                {tEditor('redo')}
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">
                  Ctrl+M
                </kbd>{' '}
                {tEditor('modifyShape')}
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">
                  Ctrl+Shift+O
                </kbd>{' '}
                {tEditor('autoOrganize')}
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">
                  Ctrl++
                </kbd>{' '}
                {tEditor('zoomIn')}
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">
                  Ctrl+-
                </kbd>{' '}
                {tEditor('zoomOut')}
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">
                  Ctrl+0
                </kbd>{' '}
                {tEditor('resetView')}
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">
                  Ctrl+Shift+T
                </kbd>{' '}
                {tEditor('toggleTheme')}
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">
                  Ctrl+Shift+L
                </kbd>{' '}
                {tEditor('toggleLanguage')}
              </div>
            </div>
          </div>
        </details>
      </main>
    </div>
  )
}
