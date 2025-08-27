// mindmap.ts
import { type Editor, createShapeId } from '@tldraw/tldraw'

type CreateShapesInput = Parameters<Editor['createShapes']>[0]
type CreateShape = CreateShapesInput[number]

export function applyMindMapTemplate(editor: Editor) {
  const center = { name: 'Topic', x: 0, y: 0 }
  const branches = [
    { name: 'Idea A', x: -300, y: -150 },
    { name: 'Idea B', x: 300, y: -150 },
    { name: 'Idea C', x: -300, y: 150 },
    { name: 'Idea D', x: 300, y: 150 },
  ]

  const centerGeo = createShapeId()
  const centerTxt = createShapeId()
  const shapes: CreateShape[] = [
    {
      id: centerGeo,
      type: 'geo',
      x: center.x,
      y: center.y,
      props: { geo: 'ellipse', w: 220, h: 100 },
    },
    {
      id: centerTxt,
      type: 'text',
      x: center.x + 110,
      y: center.y + 50,
      props: { text: center.name, autoSize: true, size: 'm', align: 'middle' },
    },
  ]

  const branchIds: string[] = []
  for (const b of branches) {
    const geoId = createShapeId()
    const txtId = createShapeId()
    branchIds.push(geoId)
    shapes.push(
      {
        id: geoId,
        type: 'geo',
        x: b.x,
        y: b.y,
        props: { geo: 'rounded-rectangle', w: 200, h: 80 },
      },
      {
        id: txtId,
        type: 'text',
        x: b.x + 100,
        y: b.y + 40,
        props: { text: b.name, autoSize: true, size: 'm', align: 'middle' },
      }
    )
  }

  editor.createShapes(shapes as CreateShapesInput)

  const arrows: CreateShape[] = branchIds.map((id) => ({
    id: createShapeId(),
    type: 'arrow',
    x: 0,
    y: 0,
    props: {
      start: {
        type: 'binding',
        boundShapeId: centerGeo,
        normalizedAnchor: { x: 0.5, y: 0.5 },
      },
      end: {
        type: 'binding',
        boundShapeId: id,
        normalizedAnchor: { x: 0.5, y: 0.5 },
      },
    },
  }))

  editor.createShapes(arrows as CreateShapesInput)
}
