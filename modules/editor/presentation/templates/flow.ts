// flow.ts
import { type Editor, createShapeId } from '@tldraw/tldraw'

type CreateShapesInput = Parameters<Editor['createShapes']>[0]
type CreateShape = CreateShapesInput[number]

export function applyFlowTemplate(editor: Editor) {
  const nodes = [
    { name: 'Start', x: 0, y: 0 },
    { name: 'Validate', x: 260, y: 0 },
    { name: 'Save', x: 520, y: 0 },
    { name: 'Finish', x: 780, y: 0 },
  ]

  const nodeShapes: CreateShape[] = []
  const nodeIds: string[] = []

  for (const n of nodes) {
    const geoId = createShapeId()
    const textId = createShapeId()
    nodeIds.push(geoId)

    nodeShapes.push(
      {
        id: geoId,
        type: 'geo',
        x: n.x,
        y: n.y,
        props: { geo: 'rectangle', w: 200, h: 80 },
      },
      {
        id: textId,
        type: 'text',
        x: n.x + 100,
        y: n.y + 40,
        props: { text: n.name, autoSize: true, size: 'm', align: 'middle' },
      }
    )
  }

  editor.createShapes(nodeShapes as CreateShapesInput)

  const arrowShapes: CreateShape[] = []
  for (let i = 0; i < nodeIds.length - 1; i++) {
    arrowShapes.push({
      id: createShapeId(),
      type: 'arrow',
      x: 0,
      y: 0,
      props: {
        start: {
          type: 'binding',
          boundShapeId: nodeIds[i],
          normalizedAnchor: { x: 0.5, y: 0.5 },
        },
        end: {
          type: 'binding',
          boundShapeId: nodeIds[i + 1],
          normalizedAnchor: { x: 0.5, y: 0.5 },
        },
      },
    })
  }

  editor.createShapes(arrowShapes as CreateShapesInput)
}
