'use client'

import { Fragment } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import clsx from 'clsx'

type Step = { title: string; desc: string }

interface OnboardingProps {
  open: boolean
  step: number
  steps: Step[]
  dontShowAgain: boolean
  onNext: () => void
  onSkip: () => void
  onToggleDontShowAgain: () => void
}

export function Onboarding({
  open,
  step,
  steps,
  dontShowAgain,
  onNext,
  onSkip,
  onToggleDontShowAgain,
}: OnboardingProps) {
  const t = useTranslations('Onboarding')
  if (!open) return null

  const isLast = step >= steps.length
  const current = steps[step] as Step | undefined

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[10000]"
      role="dialog"
      aria-modal="true"
      aria-label="Onboarding"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative z-[81] w-[min(680px,92vw)] rounded-2xl border border-border bg-card shadow-xl p-6 md:p-8">
        {/* Close (skip) */}
        <button
          onClick={onSkip}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent"
          aria-label={t('skip')}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Mascot */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={clsx(
              'mascot h-12 w-12 rounded-full grid place-items-center',
              'bg-gradient-to-br from-primary/20 to-secondary/20 border border-border'
            )}
            aria-hidden="true"
          >
            {/* simple emoji + anim */}
            <span className="text-2xl motion-safe:animate-bounce">🤖</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('hello')}</p>
            <h2 className="text-xl font-semibold text-foreground">
              {t('welcome')}
            </h2>
          </div>
        </div>

        {/* Body */}
        <p className="text-sm text-muted-foreground mb-4">{t('intro')}</p>

        {/* Step content */}
        {!isLast ? (
          <Fragment>
            <div className="rounded-lg border border-dashed border-border p-4 bg-background/50">
              <h3 className="text-base font-semibold">{current?.title}</h3>
              <p className="text-sm text-muted-foreground">{current?.desc}</p>
            </div>

            {/* Progress */}
            <div className="mt-4 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-muted-foreground select-none">
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={dontShowAgain}
                  onChange={onToggleDontShowAgain}
                />
                {t('dontShowAgain')}
              </label>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={onSkip}>
                  {t('skip')}
                </Button>
                <Button onClick={onNext}>
                  {step === 0 ? t('start') : t('next')}
                </Button>
              </div>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className="rounded-lg border border-dashed border-border p-4 bg-background/50 text-center">
              <h3 className="text-base font-semibold">{t('cta')}</h3>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-muted-foreground select-none">
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={dontShowAgain}
                  onChange={onToggleDontShowAgain}
                />
                {t('dontShowAgain')}
              </label>
              <Button onClick={onSkip}>{t('done')}</Button>
            </div>
          </Fragment>
        )}
      </div>

      <style jsx>{`
        .mascot {
          animation: glow 3s ease-in-out infinite;
        }
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 0px rgba(0, 0, 0, 0.1);
            transform: translateY(0);
          }
          50% {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
            transform: translateY(-2px);
          }
        }
      `}</style>
    </div>
  )
}
