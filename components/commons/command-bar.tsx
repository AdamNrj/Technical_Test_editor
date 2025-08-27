'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Edit3,
  Shuffle,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Palette,
  Languages,
  Search,
} from 'lucide-react'

interface Command {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  action: () => void
  shortcut?: string
}

interface CommandBarProps {
  isOpen: boolean
  onClose: () => void
  onModifyShape: () => void
  onAutoOrganize: () => void
  onUndo?: () => void
  onRedo?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onResetView?: () => void
  onSave?: () => void
  onToggleTheme?: () => void
  onToggleLanguage?: () => void
  translations: {
    searchPlaceholder: string
    modifyShape: string
    autoOrganize: string
    undo?: string
    redo?: string
    zoomIn?: string
    zoomOut?: string
    resetView?: string
    save?: string
    toggleTheme?: string
    toggleLanguage?: string
  }
}

export function CommandBar({
  isOpen,
  onClose,
  onModifyShape,
  onAutoOrganize,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onResetView,
  onSave,
  onToggleTheme,
  onToggleLanguage,
  translations,
}: CommandBarProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands: Command[] = [
    {
      id: 'modify-shape',
      label: translations.modifyShape,
      description: 'Modify the selected shape',
      icon: <Edit3 className="h-4 w-4" />,
      action: onModifyShape,
      shortcut: 'Ctrl+M',
    },
    {
      id: 'auto-organize',
      label: translations.autoOrganize,
      description: 'Auto-organize all elements',
      icon: <Shuffle className="h-4 w-4" />,
      action: onAutoOrganize,
      shortcut: 'Ctrl+Shift+O',
    },
    ...(onUndo
      ? [
          {
            id: 'undo',
            label: translations.undo || 'Undo',
            description: 'Undo last action',
            icon: <Undo2 className="h-4 w-4" />,
            action: onUndo,
            shortcut: 'Ctrl+Z',
          },
        ]
      : []),
    ...(onRedo
      ? [
          {
            id: 'redo',
            label: translations.redo || 'Redo',
            description: 'Redo last action',
            icon: <Redo2 className="h-4 w-4" />,
            action: onRedo,
            shortcut: 'Ctrl+Y',
          },
        ]
      : []),
    ...(onZoomIn
      ? [
          {
            id: 'zoom-in',
            label: translations.zoomIn || 'Zoom In',
            description: 'Zoom into the canvas',
            icon: <ZoomIn className="h-4 w-4" />,
            action: onZoomIn,
            shortcut: 'Ctrl++',
          },
        ]
      : []),
    ...(onZoomOut
      ? [
          {
            id: 'zoom-out',
            label: translations.zoomOut || 'Zoom Out',
            description: 'Zoom out of the canvas',
            icon: <ZoomOut className="h-4 w-4" />,
            action: onZoomOut,
            shortcut: 'Ctrl+-',
          },
        ]
      : []),
    ...(onResetView
      ? [
          {
            id: 'reset-view',
            label: translations.resetView || 'Reset View',
            description: 'Reset canvas view to default',
            icon: <RotateCcw className="h-4 w-4" />,
            action: onResetView,
            shortcut: 'Ctrl+0',
          },
        ]
      : []),
    ...(onSave
      ? [
          {
            id: 'save',
            label: translations.save || 'Save',
            description: 'Save the current document',
            icon: <Save className="h-4 w-4" />,
            action: onSave,
            shortcut: 'Ctrl+S',
          },
        ]
      : []),
    ...(onToggleTheme
      ? [
          {
            id: 'toggle-theme',
            label: translations.toggleTheme || 'Toggle Theme',
            description: 'Switch between light and dark theme',
            icon: <Palette className="h-4 w-4" />,
            action: onToggleTheme,
            shortcut: 'Ctrl+Shift+T',
          },
        ]
      : []),
    ...(onToggleLanguage
      ? [
          {
            id: 'toggle-language',
            label: translations.toggleLanguage || 'Toggle Language',
            description: 'Switch between English and Spanish',
            icon: <Languages className="h-4 w-4" />,
            action: onToggleLanguage,
            shortcut: 'Ctrl+Shift+L',
          },
        ]
      : []),
  ]

  const filteredCommands = commands.filter(
    (command) =>
      command.label.toLowerCase().includes(search.toLowerCase()) ||
      (command.description &&
        command.description.toLowerCase().includes(search.toLowerCase()))
  )

  useEffect(() => {
    if (!isOpen) {
      setSearch('')
      setSelectedIndex(0)
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          Math.min(prev + 1, filteredCommands.length - 1)
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action()
          onClose()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onClose])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[20vh] z-[10000]">
      <Card className="w-full max-w-lg mx-4 shadow-2xl border-border/50">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={translations.searchPlaceholder}
              className="border-none bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>

          <Separator className="mb-2" />

          <div className="max-h-80 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No commands found
              </div>
            ) : (
              <div className="space-y-1">
                {filteredCommands.map((command, index) => (
                  <Button
                    key={command.id}
                    variant={index === selectedIndex ? 'secondary' : 'ghost'}
                    className="w-full justify-start h-auto p-3 text-left"
                    onClick={() => {
                      command.action()
                      onClose()
                    }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {command.icon}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{command.label}</div>
                        {command.description && (
                          <div className="text-sm text-muted-foreground truncate">
                            {command.description}
                          </div>
                        )}
                      </div>
                      {command.shortcut && (
                        <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                          {command.shortcut}
                        </kbd>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
