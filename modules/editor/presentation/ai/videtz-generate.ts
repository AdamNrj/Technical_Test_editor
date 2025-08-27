// modules/editor/presentation/ai/videtz-generate.ts
import { type Editor, createShapeId } from '@tldraw/tldraw'

type CreateShapesArg = Parameters<Editor['createShapes']>[0]

export function generateFlowFromText(editor: Editor, input: string) {
  const edges = input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const [a, b] = pair.split('->').map((s) => s.trim())
      return a && b ? ([a, b] as const) : null
    })
    .filter(Boolean) as Array<readonly [string, string]>

  if (edges.length === 0) return

  const nodes = [...new Set(edges.flat())]

  const GAP = 260
  const W = 220
  const H = 110
  const COLS = Math.max(1, Math.ceil(Math.sqrt(nodes.length)))

  const nodeRecords = nodes.map((name, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    const x = col * GAP
    const y = row * GAP
    return {
      name,
      rec: {
        id: createShapeId(),
        type: 'geo' as const,
        x,
        y,
        props: { geo: 'rectangle', w: W, h: H },
      },
    }
  })

  const nodeMap = new Map<string, (typeof nodeRecords)[number]['rec']>()
  for (const n of nodeRecords) nodeMap.set(n.name, n.rec)

  const centerOf = (r: {
    x: number
    y: number
    props: { w: number; h: number }
  }) => ({
    x: r.x + r.props.w / 2,
    y: r.y + r.props.h / 2,
  })

  const arrowRecords = edges.map(([a, b]) => {
    const A = nodeMap.get(a)!
    const B = nodeMap.get(b)!
    const s = centerOf(A)
    const e = centerOf(B)
    return {
      id: createShapeId(),
      type: 'arrow' as const,
      x: 0,
      y: 0,
      props: {
        start: { x: s.x, y: s.y },
        end: { x: e.x, y: e.y },
        bend: 0,
        arrowheadStart: 'none',
        arrowheadEnd: 'arrow',
      },
    }
  })

  const shapes: CreateShapesArg = [
    ...nodeRecords.map((n) => n.rec),
    ...arrowRecords,
  ]

  editor.createShapes(shapes)
  editor.select(nodeRecords.at(-1)!.rec.id)
}
