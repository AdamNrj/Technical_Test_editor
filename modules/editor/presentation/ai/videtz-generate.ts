// videtz-generate.ts
import { type Editor, createShapeId, type TLShapeId } from '@tldraw/tldraw'
type CreateShapesInput = Parameters<Editor['createShapes']>[0]
type CreateShape = CreateShapesInput[number]

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

  const nodes = [...new Set(edges.flat())]

  const gap = 220
  const cols = Math.ceil(Math.sqrt(nodes.length))

  const nodeMap = new Map<
    string,
    { geoId: TLShapeId; textId: TLShapeId; x: number; y: number }
  >()

  nodes.forEach((name, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = col * gap
    const y = row * gap
    nodeMap.set(name, {
      geoId: createShapeId(),
      textId: createShapeId(),
      x,
      y,
    })
  })

  const nodeShapes = Array.from(nodeMap.entries()).flatMap<CreateShape>(
    ([name, n]) => [
      {
        id: n.geoId,
        type: 'geo',
        x: n.x,
        y: n.y,
        props: { geo: 'rectangle', w: 200, h: 80 },
      },
      {
        id: n.textId,
        type: 'text',
        x: n.x + 100,
        y: n.y + 40,
        props: { text: name, autoSize: true, size: 'm', align: 'middle' },
      },
    ]
  )
  editor.createShapes(nodeShapes as CreateShapesInput)

  const arrowShapes = edges.map<CreateShape>(([a, b]) => {
    const A = nodeMap.get(a)!
    const B = nodeMap.get(b)!
    return {
      id: createShapeId(),
      type: 'arrow',
      x: 0,
      y: 0,
      props: {
        start: {
          type: 'binding',
          boundShapeId: A.geoId,
          normalizedAnchor: { x: 0.5, y: 0.5 },
        },
        end: {
          type: 'binding',
          boundShapeId: B.geoId,
          normalizedAnchor: { x: 0.5, y: 0.5 },
        },
      },
    }
  })

  editor.createShapes(arrowShapes as CreateShapesInput)
}
