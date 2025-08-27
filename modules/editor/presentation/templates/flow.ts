import { type Editor, createShapeId } from '@tldraw/tldraw'

type CreateShapesArg = Parameters<Editor['createShapes']>[0]

function makeBox(x: number, y: number, w = 200, h = 80) {
  return {
    id: createShapeId(),
    type: 'geo' as const,
    x,
    y,
    props: { geo: 'rectangle', w, h },
  }
}

function centerOf(box: {
  x: number
  y: number
  props: { w: number; h: number }
}) {
  return { cx: box.x + box.props.w / 2, cy: box.y + box.props.h / 2 }
}

function makeArrowPoint(
  from: ReturnType<typeof makeBox>,
  to: ReturnType<typeof makeBox>
) {
  const { cx: sx, cy: sy } = centerOf(from)
  const { cx: ex, cy: ey } = centerOf(to)

  return {
    id: createShapeId(),
    type: 'arrow' as const,
    x: 0,
    y: 0,
    props: {
      start: { x: sx, y: sy },
      end: { x: ex, y: ey },
      bend: 0,
      arrowheadStart: 'none',
      arrowheadEnd: 'arrow',
    },
  } as const
}

export function applyFlowTemplate(editor: Editor) {
  const gapX = 280
  const y = 120

  const start = makeBox(0, y)
  const validate = makeBox(gapX, y)
  const save = makeBox(gapX * 2, y)
  const finish = makeBox(gapX * 3, y)

  const arrows = [
    makeArrowPoint(start, validate),
    makeArrowPoint(validate, save),
    makeArrowPoint(save, finish),
  ]

  const shapes: CreateShapesArg = [start, validate, save, finish, ...arrows]
  editor.createShapes(shapes)
  editor.select(finish.id)
}
