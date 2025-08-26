'use client'

import { Button } from '@/components/ui/button'
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
} from 'lucide-react'

interface ToolbarProps {
  onModifyShape: () => void
  onAutoOrganize: () => void
  onUndo?: () => void
  onRedo?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onResetView?: () => void
  onSave?: () => void
  translations: {
    modifyShape: string
    autoOrganize: string
    undo?: string
    redo?: string
    zoomIn?: string
    zoomOut?: string
    resetView?: string
    save?: string
  }
}

export function Toolbar({
  onModifyShape,
  onAutoOrganize,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onResetView,
  onSave,
  translations,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-1 p-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-sm">
      <Button
        variant="outline"
        size="sm"
        onClick={onModifyShape}
        className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-all duration-150 bg-transparent btn-hover-effect"
        aria-label={translations.modifyShape}
      >
        <Edit3 className="h-4 w-4" />
        <span className="hidden sm:inline">{translations.modifyShape}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onAutoOrganize}
        className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-all duration-150 bg-transparent btn-hover-effect"
        aria-label={translations.autoOrganize}
      >
        <Shuffle className="h-4 w-4" />
        <span className="hidden sm:inline">{translations.autoOrganize}</span>
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {onUndo && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          className="hover:bg-accent hover:text-accent-foreground transition-all duration-150 btn-hover-effect"
          aria-label={translations.undo || 'Undo'}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
      )}

      {onRedo && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          className="hover:bg-accent hover:text-accent-foreground transition-all duration-150 btn-hover-effect"
          aria-label={translations.redo || 'Redo'}
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      )}

      {(onUndo || onRedo) && (
        <Separator orientation="vertical" className="h-6 mx-1" />
      )}

      {onZoomIn && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="hover:bg-accent hover:text-accent-foreground transition-all duration-150 btn-hover-effect"
          aria-label={translations.zoomIn || 'Zoom In'}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      )}

      {onZoomOut && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="hover:bg-accent hover:text-accent-foreground transition-all duration-150 btn-hover-effect"
          aria-label={translations.zoomOut || 'Zoom Out'}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      )}

      {onResetView && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetView}
          className="hover:bg-accent hover:text-accent-foreground transition-all duration-150 btn-hover-effect"
          aria-label={translations.resetView || 'Reset View'}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}

      {(onZoomIn || onZoomOut || onResetView) && (
        <Separator orientation="vertical" className="h-6 mx-1" />
      )}

      {onSave && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="hover:bg-accent hover:text-accent-foreground transition-all duration-150 btn-hover-effect"
          aria-label={translations.save || 'Save'}
        >
          <Save className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
