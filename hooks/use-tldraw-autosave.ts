'use client'

import { useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import { trpc } from '@/modules/editor/presentation/store/client'
import type { Editor, TLStoreSnapshot } from '@tldraw/tldraw'

const SaveInput = z.object({
  id: z.string(),
  store: z.unknown(), // snapshot serializable
  updatedAt: z.number(),
})
export type SaveState = 'idle' | 'saving' | 'error'

export function useTldrawAutosave(docId: string) {
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const editorRef = useRef<Editor | null>(null)

  const { data, isLoading } = trpc.document.get.useQuery({ id: docId })
  const saveMutation = trpc.document.save.useMutation({
    onMutate: () => setSaveState('saving'),
    onSuccess: () => setSaveState('idle'),
    onError: () => setSaveState('error'),
  })

  const debouncedSave = useMemo(() => {
    let t: ReturnType<typeof setTimeout> | undefined
    return (payload: unknown) => {
      if (t) clearTimeout(t)
      t = setTimeout(() => saveMutation.mutate(SaveInput.parse(payload)), 500)
    }
  }, [saveMutation])

  function onMount(editor: Editor) {
    editorRef.current = editor

    // Cargar snapshot si existía
    if (data?.store) {
      editor.store.loadSnapshot(data.store as TLStoreSnapshot)
    }

    // Escuchar cambios del documento (no usamos el parámetro para evitar warning)
    const unsub = editor.store.listen(
      () => {
        const snapshot = editor.store.getSnapshot()
        debouncedSave({
          id: docId,
          store: snapshot,
          updatedAt: Date.now(),
        })
      },
      { scope: 'document' }
    )

    return () => unsub()
  }

  return { onMount, isLoading, saveState, editorRef }
}
