'use client'

import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

type SaveStatus = 'saved' | 'saving' | 'error'

interface SaveIndicatorProps {
  status: SaveStatus
  translations: {
    saved: string
    saving: string
    error: string
  }
}

export function SaveIndicator({ status, translations }: SaveIndicatorProps) {
  const getStatusConfig = (status: SaveStatus) => {
    switch (status) {
      case 'saved':
        return {
          variant: 'default' as const,
          icon: CheckCircle,
          text: translations.saved,
          className:
            'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
        }
      case 'saving':
        return {
          variant: 'secondary' as const,
          icon: Loader2,
          text: translations.saving,
          className:
            'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
        }
      case 'error':
        return {
          variant: 'destructive' as const,
          icon: AlertCircle,
          text: translations.error,
          className:
            'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-1.5 px-3 py-1.5 transition-all duration-200 ${config.className}`}
      role="status"
      aria-live="polite"
    >
      <Icon
        className={`h-3.5 w-3.5 ${status === 'saving' ? 'animate-spin' : ''}`}
        aria-hidden="true"
      />
      <span className="text-xs font-medium">{config.text}</span>
    </Badge>
  )
}
