import { StateNode, TLTextShape, toRichText } from 'tldraw'

const OFFSET = 12

export const VIDEXT_TOOL_ID = 'vidext'

export class VidextTool extends StateNode {
  static override id = VIDEXT_TOOL_ID

  override onEnter() {
    this.editor.setCursor({ type: 'cross', rotation: 0 })
  }

  override onPointerDown() {
    const { currentPagePoint } = this.editor.inputs

    this.editor.createShape<TLTextShape>({
      type: 'text',
      x: currentPagePoint.x - OFFSET,
      y: currentPagePoint.y - OFFSET,
      props: {
        richText: toRichText('Vidext Technologies S.L.')
      }
    })
  }
}
