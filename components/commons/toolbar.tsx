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
  ImageDown,
  FileCode2,
  FileJson,
  Wand2,
  Workflow,
} from 'lucide-react'

interface ToolbarProps {
  disabledExports?: boolean
  onModifyShape: () => void
  onAutoOrganize: () => void
  onUndo?: () => void
  onRedo?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onResetView?: () => void
  onSave?: () => void
  onExportPng?: () => void
  onExportSvg?: () => void
  onExportJson?: () => void
  onGenerateVidetz?: () => void
  onNewFlowTemplate?: () => void
  onNewMindMapTemplate?: () => void
  translations: {
    modifyShape: string
    autoOrganize: string
    undo?: string
    redo?: string
    zoomIn?: string
    zoomOut?: string
    resetView?: string
    save?: string
    exportPng?: string
    exportSvg?: string
    exportJson?: string
    generateVidetz?: string
    newFromTemplate?: string
    flowTemplate?: string
    mindMapTemplate?: string
  }
}

export function Toolbar({
  disabledExports,
  onModifyShape,
  onAutoOrganize,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onResetView,
  onSave,
  onExportPng,
  onExportSvg,
  onExportJson,
  onGenerateVidetz,
  onNewFlowTemplate,
  onNewMindMapTemplate,
  translations: t,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-1 p-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-sm">
      {/* Edit */}
      <Button
        variant="outline"
        size="sm"
        onClick={onModifyShape}
        className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-all duration-150 bg-transparent btn-hover-effect"
        aria-label={t.modifyShape}
      >
        <Edit3 className="h-4 w-4" />
        <span className="hidden sm:inline">{t.modifyShape}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onAutoOrganize}
        className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-all duration-150 bg-transparent btn-hover-effect"
        aria-label={t.autoOrganize}
      >
        <Shuffle className="h-4 w-4" />
        <span className="hidden sm:inline">{t.autoOrganize}</span>
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Undo / Redo */}
      {onUndo && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          className="hover:bg-accent hover:text-accent-foreground transition-all duration-150 btn-hover-effect"
          aria-label={t.undo || 'Undo'}
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
          aria-label={t.redo || 'Redo'}
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      )}

      {(onUndo || onRedo) && (
        <Separator orientation="vertical" className="h-6 mx-1" />
      )}

      {/* Zoom / Reset */}
      {onZoomIn && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="hover:bg-accent hover:text-accent-foreground transition-all duration-150 btn-hover-effect"
          aria-label={t.zoomIn || 'Zoom In'}
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
          aria-label={t.zoomOut || 'Zoom Out'}
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
          aria-label={t.resetView || 'Reset View'}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}

      {(onZoomIn || onZoomOut || onResetView) && (
        <Separator orientation="vertical" className="h-6 mx-1" />
      )}

      {/* Export */}
      {onExportPng && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onExportPng}
          disabled={disabledExports}
          aria-disabled={disabledExports}
          className="hover:bg-accent hover:text-accent-foreground transition-all duration-150 btn-hover-effect"
          aria-label={t.exportPng || 'Export PNG'}
          title={disabledExports ? 'Nothing to export' : ''}
        >
          <ImageDown className="h-4 w-4" />
        </Button>
      )}
      {onExportSvg && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onExportSvg}
          disabled={disabledExports}
          aria-disabled={disabledExports}
          className="hover:bg-accent hover:text-accent-foreground transition-all duration-150 btn-hover-effect"
          aria-label={t.exportSvg || 'Export SVG'}
          title={disabledExports ? 'Nothing to export' : ''}
        >
          <FileCode2 className="h-4 w-4" />
        </Button>
      )}
      {onExportJson && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onExportJson}
          disabled={disabledExports}
          aria-disabled={disabledExports}
          className="hover:bg-accent hover:text-accent-foreground transition-all duration-150 btn-hover-effect"
          aria-label={t.exportJson || 'Export JSON'}
          title={disabledExports ? 'Nothing to export' : ''}
        >
          <FileJson className="h-4 w-4" />
        </Button>
      )}

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Templates */}
      {onNewFlowTemplate && (
        <Button
          variant="outline"
          size="sm"
          onClick={onNewFlowTemplate}
          className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-all duration-150 bg-transparent btn-hover-effect"
          aria-label={t.flowTemplate || 'Flowchart'}
        >
          <Workflow className="h-4 w-4" />
          <span className="hidden sm:inline">
            {t.flowTemplate || 'Flowchart'}
          </span>
        </Button>
      )}
      {onNewMindMapTemplate && (
        <Button
          variant="outline"
          size="sm"
          onClick={onNewMindMapTemplate}
          className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-all duration-150 bg-transparent btn-hover-effect"
          aria-label={t.mindMapTemplate || 'Mind map'}
        >
          <Workflow className="h-4 w-4" />
          <span className="hidden sm:inline">
            {t.mindMapTemplate || 'Mind map'}
          </span>
        </Button>
      )}

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Generate (Videtz) */}
      {onGenerateVidetz && (
        <Button
          variant="outline"
          size="sm"
          onClick={onGenerateVidetz}
          className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-all duration-150 bg-transparent btn-hover-effect"
          aria-label={t.generateVidetz || 'Generate'}
        >
          <Wand2 className="h-4 w-4" />
          <span className="hidden sm:inline">
            {t.generateVidetz || 'Generate'}
          </span>
        </Button>
      )}

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Save */}
      {onSave && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="hover:bg-accent hover:text-accent-foreground transition-all duration-150 btn-hover-effect"
          aria-label={t.save || 'Save'}
        >
          <Save className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
