'use client'

import type React from 'react'
import { exportToBlob, getSnapshot } from '@tldraw/tldraw'
import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { Toolbar } from '@/components/commons/toolbar'
import { toast } from 'sonner'
import { SaveIndicator } from '@/components/commons/save-indicator'
import { LangSwitcher } from '@/components/commons/lang-switcher'
import { ThemeSwitcher } from '@/components/commons/theme-switcher'
import { CommandBar } from '@/components/commons/command-bar'
import { AccessibilityAnnouncer } from '@/components/commons/accessibility-announcer'
import { SkipLink } from '@/components/commons/skip-link'
import { Onboarding } from '@/components/commons/onboarding'

import { generateFlowFromText } from '@/modules/editor/presentation/ai/videtz-generate'
import { useTheme } from '@/hooks/use-theme'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { downloadBlob } from '@/hooks/use-download-blob'
import { useTldrawAutosave } from '@/hooks/use-tldraw-autosave'
import { useOnboarding } from '@/hooks/use-onboarding'

import { ArrowLeft, FileText, Command } from 'lucide-react'
import {
  Tldraw,
  type Editor,
  createShapeId,
  type TLShapeId,
} from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { applyFlowTemplate } from '@/modules/editor/presentation/templates/flow'
import { applyMindMapTemplate } from '@/modules/editor/presentation/templates/mindmap'

type SaveStatus = 'saved' | 'saving' | 'error'
type Locale = 'en' | 'es'
type ThemeMode =
  | 'light'
  | 'dark'
  | 'high-contrast'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'

type CreateShapeInput = Parameters<Editor['createShapes']>[0][number]

export default function EditorPage() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const docId = searchParams.get('id') ?? 'main'

  const tEditor = useTranslations('Editor')
  const tToolbar = useTranslations('Toolbar')
  const tSave = useTranslations('SaveStatus')
  const tCmd = useTranslations('CommandBar')
  const tTheme = useTranslations('Theme')
  const tOnb = useTranslations('Onboarding')

  const [canExport, setCanExport] = useState(false)
  const [documentTitle, setDocumentTitle] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const { theme, changeTheme } = useTheme()

  const { open, step, setStep, dontShowAgain, setDontShowAgain, close } =
    useOnboarding()

  const { onMount, isLoading, saveState, editorRef } = useTldrawAutosave(docId)
  type Step = { title: string; desc: string }
  const steps = (tOnb.raw('steps') as Step[]) ?? []

  const saveStatus: SaveStatus =
    saveState === 'saving'
      ? 'saving'
      : saveState === 'error'
      ? 'error'
      : 'saved'

  function navigateToLocale(next: Locale) {
    const parts = pathname.split('/')
    const newPath = '/' + [next, ...parts.slice(2)].filter(Boolean).join('/')
    router.push(newPath || `/${next}`)
  }

  function safeTitle(): string {
    const t = documentTitle?.trim()
    return t && t.length > 0 ? t : 'document-1'
  }

  function themeKeyFor(
    mode: ThemeMode
  ):
    | 'light'
    | 'dark'
    | 'highContrast'
    | 'protanopia'
    | 'deuteranopia'
    | 'tritanopia' {
    switch (mode) {
      case 'light':
        return 'light'
      case 'dark':
        return 'dark'
      case 'high-contrast':
        return 'highContrast'
      case 'protanopia':
        return 'protanopia'
      case 'deuteranopia':
        return 'deuteranopia'
      case 'tritanopia':
        return 'tritanopia'
    }
  }

  function withEditor(fn: (e: Editor) => void) {
    const e = editorRef.current
    if (e) fn(e)
  }

  function handleOnbNext() {
    const isLast = step >= steps.length
    if (!isLast) setStep(step + 1)
    else close()
  }
  function handleOnbSkip() {
    close()
  }

  function handleModifyShape() {
    withEditor((editor) => {
      const selected = [...editor.getSelectedShapeIds()]
      if (selected.length === 0) {
        const id: TLShapeId = createShapeId()
        const rect = {
          id,
          type: 'geo',
          x: 200,
          y: 200,
          props: { geo: 'rectangle' },
        } as unknown as CreateShapeInput
        editor.createShapes([rect])
        editor.select(id)
        setAnnouncement(
          locale === 'en' ? 'Rectangle created' : 'Rectángulo creado'
        )
        return
      }
      const dx = 24 - Math.random() * 48
      const dy = 24 - Math.random() * 48
      editor.nudgeShapes(selected, { x: dx, y: dy })
      setAnnouncement(locale === 'en' ? 'Shape modified' : 'Figura modificada')
    })
  }

  async function handleExportPng() {
    const editor = editorRef.current
    if (!editor) return

    const ids = Array.from(editor.getCurrentPageShapeIds())
    if (ids.length === 0) {
      toast.info(tEditor('nothingToExport'))
      return
    }

    const blob = await exportToBlob({
      editor,
      ids,
      format: 'png',
      opts: { background: true, scale: 2 },
    })

    const filename = `${safeTitle()}.png`
    downloadBlob(blob, filename)
    setAnnouncement(tEditor('exported'))
    toast.success(tEditor('exported'), { description: filename })
  }

  async function handleExportSvg() {
    const editor = editorRef.current
    if (!editor) return

    const ids = Array.from(editor.getCurrentPageShapeIds())
    if (ids.length === 0) {
      toast.info(tEditor('nothingToExport'))
      return
    }

    const blob = await exportToBlob({
      editor,
      ids,
      format: 'svg',
      opts: { background: true, scale: 1 },
    })

    const filename = `${safeTitle()}.svg`
    downloadBlob(blob, filename)
    setAnnouncement(tEditor('exported'))
    toast.success(tEditor('exported'), { description: filename })
  }

  function handleExportJson() {
    const editor = editorRef.current
    if (!editor) return

    const ids = Array.from(editor.getCurrentPageShapeIds())
    if (ids.length === 0) {
      toast.info(tEditor('nothingToExport'))
      return
    }

    const snap = getSnapshot(editor.store)
    const blob = new Blob([JSON.stringify(snap, null, 2)], {
      type: 'application/json',
    })

    const filename = `${safeTitle()}.json`
    downloadBlob(blob, filename)
    setAnnouncement(tEditor('exported'))
    toast.success(tEditor('exported'), { description: filename })
  }

  function handleNewFlowTemplate() {
    const editor = editorRef.current
    if (!editor) return
    applyFlowTemplate(editor)
    toast(tEditor('flowTemplate'))
  }

  function handleNewMindMapTemplate() {
    const editor = editorRef.current
    if (!editor) return
    applyMindMapTemplate(editor)
    toast(tEditor('mindMapTemplate'))
  }

  function handleGenerateVidetz() {
    const editor = editorRef.current
    if (!editor) return
    const input = window.prompt(
      'Escribe relaciones "A -> B" separadas por comas',
      'Start -> Validate, Validate -> Save, Save -> Finish'
    )
    if (!input) return
    generateFlowFromText(editor, input)
  }
  function handleAutoOrganize() {
    withEditor((editor) => {
      const shapes = editor.getCurrentPageShapes()
      const gap = 120
      let col = 0
      let row = 0
      const cols = 5
      for (const s of shapes) {
        const targetX = col * gap
        const targetY = row * gap
        const dx = targetX - s.x
        const dy = targetY - s.y
        editor.nudgeShapes([s.id], { x: dx, y: dy })
        col++
        if (col >= cols) {
          col = 0
          row++
        }
      }
      setAnnouncement(
        locale === 'en' ? 'Elements organized' : 'Elementos organizados'
      )
    })
  }

  const handleSave = () => {
    setAnnouncement(tSave('saved'))
    toast.success(tSave('saved'))
  }

  const handleUndo = () => {
    withEditor((editor) => {
      editor.undo()
      setAnnouncement(locale === 'en' ? 'Undo' : 'Deshacer')
    })
  }

  const handleRedo = () => {
    withEditor((editor) => {
      editor.redo()
      setAnnouncement(locale === 'en' ? 'Redo' : 'Rehacer')
    })
  }

  const handleZoomIn = () => {
    withEditor((editor) => {
      editor.zoomIn()
    })
    const newZoom = Math.min(zoomLevel + 25, 500)
    setZoomLevel(newZoom)
    setAnnouncement(`${locale === 'en' ? 'Zoom:' : 'Zoom:'} ${newZoom}%`)
  }

  const handleZoomOut = () => {
    withEditor((editor) => {
      editor.zoomOut()
    })
    const newZoom = Math.max(zoomLevel - 25, 25)
    setZoomLevel(newZoom)
    setAnnouncement(`${locale === 'en' ? 'Zoom:' : 'Zoom:'} ${newZoom}%`)
  }

  const handleResetView = () => {
    withEditor((editor) => {
      editor.resetZoom()
      editor.setCamera({ x: 0, y: 0, z: 1 })
    })
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
    setAnnouncement(
      `${tTheme('changeTheme')}: ${tTheme(themeKeyFor(nextTheme))}`
    )
  }

  const handleToggleLanguage = () => {
    const next = locale === 'en' ? 'es' : 'en'
    const parts = pathname.split('/')
    const newPath = '/' + [next, ...parts.slice(2)].filter(Boolean).join('/')
    router.push(newPath || `/${next}`)
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
  }

  useEffect(() => {
    if (isLoading) return
    const e = editorRef.current
    if (!e) return

    const compute = () => {
      setCanExport(e.getCurrentPageShapeIds().size > 0)
    }

    compute()
    const unsub = e.store.listen(() => compute(), { scope: 'document' })
    return () => unsub()
  }, [editorRef, isLoading])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Onboarding
        open={open}
        step={step}
        steps={steps}
        dontShowAgain={dontShowAgain}
        onNext={handleOnbNext}
        onSkip={handleOnbSkip}
        onToggleDontShowAgain={() => setDontShowAgain(!dontShowAgain)}
      />
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
            {/* Left Section */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Link href={`/${locale}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 btn-hover-effect cursor-pointer"
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
              {/* Toolbar (desktop) */}
              <Toolbar
                onModifyShape={handleModifyShape}
                onAutoOrganize={handleAutoOrganize}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetView={handleResetView}
                onSave={handleSave}
                onExportPng={handleExportPng}
                onExportSvg={handleExportSvg}
                onExportJson={handleExportJson}
                onGenerateVidetz={handleGenerateVidetz}
                onNewFlowTemplate={handleNewFlowTemplate}
                onNewMindMapTemplate={handleNewMindMapTemplate}
                translations={{
                  modifyShape: tEditor('modifyShape'),
                  autoOrganize: tEditor('autoOrganize'),
                  undo: tEditor('undo'),
                  redo: tEditor('redo'),
                  zoomIn: tEditor('zoomIn'),
                  zoomOut: tEditor('zoomOut'),
                  resetView: tEditor('resetView'),
                  save: tEditor('save'),
                  exportPng: tToolbar('exportPng'),
                  exportSvg: tToolbar('exportSvg'),
                  exportJson: tToolbar('exportJson'),
                  generateVidetz: tToolbar('generateVidetz'),
                  newFromTemplate: tEditor('newFromTemplate'),
                  flowTemplate: tEditor('flowTemplate'),
                  mindMapTemplate: tEditor('mindMapTemplate'),
                }}
              />
            </div>

            {/* Right Section - Save + Lang/Theme */}
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

              <LangSwitcher
                currentLang={locale}
                onLanguageChange={(l: Locale) => navigateToLocale(l)}
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

          {/* Mobile Toolbar */}
          <div className="lg:hidden mt-3 pt-3 border-t border-border">
            {/* Toolbar (mobile) */}
            <Toolbar
              onModifyShape={handleModifyShape}
              onAutoOrganize={handleAutoOrganize}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onResetView={handleResetView}
              onSave={handleSave}
              onExportPng={handleExportPng}
              onExportSvg={handleExportSvg}
              onExportJson={handleExportJson}
              onGenerateVidetz={handleGenerateVidetz}
              onNewFlowTemplate={handleNewFlowTemplate}
              onNewMindMapTemplate={handleNewMindMapTemplate}
              translations={{
                modifyShape: tEditor('modifyShape'),
                autoOrganize: tEditor('autoOrganize'),
                undo: tEditor('undo'),
                redo: tEditor('redo'),
                zoomIn: tEditor('zoomIn'),
                zoomOut: tEditor('zoomOut'),
                resetView: tEditor('resetView'),
                save: tEditor('save'),
                exportPng: tToolbar('exportPng'),
                exportSvg: tToolbar('exportSvg'),
                exportJson: tToolbar('exportJson'),
                generateVidetz: tToolbar('generateVidetz'),
                newFromTemplate: tEditor('newFromTemplate'),
                flowTemplate: tEditor('flowTemplate'),
                mindMapTemplate: tEditor('mindMapTemplate'),
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
        <Card
          className="flex-1 border-border bg-card relative overflow-hidden min-h-0 shadow-sm"
          role="application"
          aria-label={locale === 'en' ? 'Drawing canvas' : 'Lienzo de dibujo'}
        >
          <div className="absolute inset-0" id="canvas-area">
            {isLoading ? (
              <div className="absolute inset-0 grid place-items-center bg-background/60 z-20">
                <div className="rounded-md px-4 py-2 bg-card border animate-pulse text-sm">
                  {tEditor('loadingDocument')}
                </div>
              </div>
            ) : (
              <Tldraw onMount={onMount} />
            )}
          </div>
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
            <Separator orientation="vertical" className="h-4" />
            <SaveIndicator
              status={saveStatus}
              translations={{
                saved: tSave('saved'),
                saving: tSave('saving'),
                error: tSave('error'),
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
