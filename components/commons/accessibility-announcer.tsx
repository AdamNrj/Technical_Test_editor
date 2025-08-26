'use client'

import { useEffect, useState } from 'react'

interface AccessibilityAnnouncerProps {
  message: string
  priority?: 'polite' | 'assertive'
}

export function AccessibilityAnnouncer({
  message,
  priority = 'polite',
}: AccessibilityAnnouncerProps) {
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (message) {
      setAnnouncement('')
      const timer = setTimeout(() => setAnnouncement(message), 100)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      aria-label="Status announcements"
    >
      {announcement}
    </div>
  )
}
