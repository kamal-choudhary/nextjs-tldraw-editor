import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

import CustomSharePanel from './CustomSharePanel'

export default function Editor() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        components={{
          SharePanel: CustomSharePanel
        }}
      />
    </div>
  )
}
