// hooks/use-keyboard-shortcuts.ts
'use client'

import { useEffect, useRef } from 'react'

export type KeyboardShortcuts = {
  onOpenCommandBar?: () => void
  onSave?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onModifyShape?: () => void
  onAutoOrganize?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onResetView?: () => void
  onToggleTheme?: () => void
  onToggleLanguage?: () => void
}

function isTextInput(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    (target as HTMLElement).isContentEditable
  )
}

export function useKeyboardShortcuts(handlers: KeyboardShortcuts) {
  const ref = useRef<KeyboardShortcuts>(handlers)
  useEffect(() => {
    ref.current = handlers
  }, [handlers])

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      // No interceptar cuando escribe en inputs/textarea sin modificadores
      if (isTextInput(e.target) && !e.metaKey && !e.ctrlKey) return

      const mod = e.metaKey || e.ctrlKey
      const shift = e.shiftKey
      const key = e.key.toLowerCase()
      const H = ref.current

      // Cmd/Ctrl + K → Command Bar
      if (mod && key === 'k') {
        e.preventDefault()
        H.onOpenCommandBar?.()
        return
      }
      // Cmd/Ctrl + S → Save
      if (mod && key === 's') {
        e.preventDefault()
        H.onSave?.()
        return
      }
      // Cmd/Ctrl + Z → Undo
      if (mod && !shift && key === 'z') {
        e.preventDefault()
        H.onUndo?.()
        return
      }
      // Cmd/Ctrl + Y  o  Cmd/Ctrl + Shift + Z → Redo
      if ((mod && key === 'y') || (mod && shift && key === 'z')) {
        e.preventDefault()
        H.onRedo?.()
        return
      }
      // Cmd/Ctrl + M → Modify shape
      if (mod && key === 'm') {
        e.preventDefault()
        H.onModifyShape?.()
        return
      }
      // Cmd/Ctrl + Shift + O → Auto-organize
      if (mod && shift && key === 'o') {
        e.preventDefault()
        H.onAutoOrganize?.()
        return
      }
      // Cmd/Ctrl + = / +  → Zoom In
      if (mod && (key === '=' || key === '+')) {
        e.preventDefault() // evita zoom del navegador
        H.onZoomIn?.()
        return
      }
      // Cmd/Ctrl + -  → Zoom Out
      if (mod && key === '-') {
        e.preventDefault()
        H.onZoomOut?.()
        return
      }
      // Cmd/Ctrl + 0 → Reset View
      if (mod && key === '0') {
        e.preventDefault()
        H.onResetView?.()
        return
      }
      // Cmd/Ctrl + Shift + T → Toggle Theme
      if (mod && shift && key === 't') {
        e.preventDefault()
        H.onToggleTheme?.()
        return
      }
      // Cmd/Ctrl + Shift + L → Toggle Language
      if (mod && shift && key === 'l') {
        e.preventDefault()
        H.onToggleLanguage?.()
        return
      }
    }

    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [])
}
