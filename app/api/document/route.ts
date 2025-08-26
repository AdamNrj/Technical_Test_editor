import { NextResponse } from 'next/server'
import { DocumentSchema } from '@/modules/editor/domain/core/entity'
import {
  getDocument,
  saveDocument,
} from '@/modules/editor/presentation/store/doc-store'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id') ?? 'main'
  const doc = await getDocument(id)
  return NextResponse.json(doc)
}

export async function POST(req: Request) {
  const json = await req.json()
  const parsed = DocumentSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.format() },
      { status: 400 }
    )
  }
  const saved = await saveDocument(parsed.data)
  return NextResponse.json({ ok: true, updatedAt: saved.updatedAt })
}
