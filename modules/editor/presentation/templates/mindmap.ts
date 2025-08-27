import { type Editor, createShapeId } from '@tldraw/tldraw'

type CreateShapesArg = Parameters<Editor['createShapes']>[0]

function makeCircle(x: number, y: number, r = 90) {
  const w = r * 2
  const h = r * 2
  return {
    id: createShapeId(),
    type: 'geo' as const,
    x,
    y,
    props: { geo: 'ellipse', w, h },
  }
}

function makeBox(x: number, y: number, w = 220, h = 100) {
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
  from: ReturnType<typeof makeCircle> | ReturnType<typeof makeBox>,
  to: ReturnType<typeof makeCircle> | ReturnType<typeof makeBox>
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

export function applyMindMapTemplate(editor: Editor) {
  const center = makeCircle(0, 0, 110)

  const RADIUS = 420
  const BRANCH_W = 240
  const BRANCH_H = 110

  const angles = [0, 60, 120, 180, 240, 300].map((a) => (a * Math.PI) / 180)

  const C = centerOf(center)

  const branches = angles.map((theta) => {
    const cx = C.cx + RADIUS * Math.cos(theta)
    const cy = C.cy + RADIUS * Math.sin(theta)

    const x = cx - BRANCH_W / 2
    const y = cy - BRANCH_H / 2

    return makeBox(x, y, BRANCH_W, BRANCH_H)
  })

  const arrows = branches.map((branch) => makeArrowPoint(center, branch))

  const shapes: CreateShapesArg = [center, ...branches, ...arrows]
  editor.createShapes(shapes)
  editor.select(center.id)
}
