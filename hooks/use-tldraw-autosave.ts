// hooks/use-tldraw-autosave.ts
'use client'

import { useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import { trpc } from '@/modules/editor/presentation/store/client'
import {
  type Editor,
  type TLStoreSnapshot,
  getSnapshot,
  loadSnapshot,
} from '@tldraw/tldraw'

// (Opcional) Si quieres inspeccionar en DevTools, descomenta estas líneas.
// declare global {
//   interface Window {
//     __lastSnapshot?: TLStoreSnapshot
//     __lastSaveError?: unknown
//   }
// }

const SaveInput = z.object({
  id: z.string(),
  store: z.unknown(),
  updatedAt: z.number(),
})

export type SaveState = 'idle' | 'saving' | 'error'

export function useTldrawAutosave(docId: string) {
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const editorRef = useRef<Editor | null>(null)

  // Carga inicial del documento
  const {
    data,
    isLoading,
    error: queryError,
  } = trpc.document.get.useQuery({ id: docId })

  // Mutación de guardado (autosave)
  const saveMutation = trpc.document.save.useMutation({
    onMutate: () => setSaveState('saving'),
    onSuccess: () => setSaveState('idle'),
    onError: () => {
      setSaveState('error')
      // if (process.env.NODE_ENV !== 'production') window.__lastSaveError = err
    },
  })

  // Debounce para no saturar el backend
  const debouncedSave = useMemo(() => {
    let t: ReturnType<typeof setTimeout> | undefined
    return (payload: unknown) => {
      if (t) clearTimeout(t)
      t = setTimeout(() => {
        const p = SaveInput.parse(payload)
        saveMutation.mutate(p)
      }, 500)
    }
  }, [saveMutation])

  // Se inyecta al montar <Tldraw onMount={onMount} />
  function onMount(editor: Editor) {
    editorRef.current = editor

    // Cargar snapshot si existe
    if (data?.store) {
      loadSnapshot(editor.store, data.store as TLStoreSnapshot)
    }

    // Escuchar cambios del documento y guardar
    const unsub = editor.store.listen(
      () => {
        const snapshot = getSnapshot(editor.store)
        debouncedSave({ id: docId, store: snapshot, updatedAt: Date.now() })
        // if (process.env.NODE_ENV !== 'production') window.__lastSnapshot = snapshot
      },
      { scope: 'document' }
    )

    return () => unsub()
  }

  if (queryError && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error('[autosave] query error', queryError)
  }

  return { onMount, isLoading, saveState, editorRef }
}
