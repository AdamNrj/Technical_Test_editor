'use client'

import { useEffect, useState } from 'react'

const KEY = 'vitexl_onboarding_closed_v1'

export function useOnboarding() {
  const [open, setOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const dismissed =
      typeof window !== 'undefined' && localStorage.getItem(KEY) === '1'
    if (!dismissed) setOpen(true)
  }, [])

  function close() {
    try {
      localStorage.setItem(KEY, '1')
    } catch {}
    setOpen(false)
  }

  function reset() {
    try {
      localStorage.removeItem(KEY)
    } catch {}
    setStep(0)
    setOpen(true)
  }

  function restart() {
    setStep(0)
    setOpen(true)
  }

  return {
    open,
    setOpen,
    step,
    setStep,
    dontShowAgain,
    setDontShowAgain,
    close,
    reset,
    restart,
  }
}
