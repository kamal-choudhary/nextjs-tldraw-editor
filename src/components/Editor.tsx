import {
  Tldraw,
  TLUiOverrides,
  TLComponents,
  useTools,
  useIsToolSelected,
  DefaultToolbar,
  DefaultToolbarContent,
  TldrawUiMenuItem,
  DefaultKeyboardShortcutsDialog,
  DefaultKeyboardShortcutsDialogContent,
  TLUiAssetUrlOverrides
} from 'tldraw'
import 'tldraw/tldraw.css'

import DocumentSyncManager from './DocumentSyncManager'
import { VidextTool, VIDEXT_TOOL_ID } from './VidextTool'

const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    tools.vidext = {
      id: VIDEXT_TOOL_ID,
      icon: 'vidext-icon',
      label: 'VidExt',
      kbd: 's',
      onSelect: () => {
        editor.setCurrentTool(VIDEXT_TOOL_ID)
      }
    }
    return tools
  }
}

const components: TLComponents = {
  SharePanel: DocumentSyncManager,
  Toolbar: (props) => {
    const tools = useTools()
    const isStickerSelected = useIsToolSelected(tools[VIDEXT_TOOL_ID])

    return (
      <DefaultToolbar {...props}>
        <TldrawUiMenuItem
          {...tools[VIDEXT_TOOL_ID]}
          isSelected={isStickerSelected}
        />
        <DefaultToolbarContent />
      </DefaultToolbar>
    )
  },
  KeyboardShortcutsDialog: (props) => {
    const tools = useTools()
    return (
      <DefaultKeyboardShortcutsDialog {...props}>
        <DefaultKeyboardShortcutsDialogContent />
        <TldrawUiMenuItem {...tools[VIDEXT_TOOL_ID]} />
      </DefaultKeyboardShortcutsDialog>
    )
  }
}

export const customAssetUrls: TLUiAssetUrlOverrides = {
  icons: {
    'vidext-icon': '/vidext-logo.svg'
  }
}

const customTools = [VidextTool]

export default function Editor() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        tools={customTools}
        overrides={uiOverrides}
        components={components}
        assetUrls={customAssetUrls}
      />
    </div>
  )
}
