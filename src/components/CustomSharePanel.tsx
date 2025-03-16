import { useState, useEffect } from 'react'
import { getSnapshot, loadSnapshot, useEditor } from 'tldraw'
import { trpc } from '@/utils/trpc'

export default function CustomSharePanel() {
  const editor = useEditor()
  const [saveStatus, setSaveStatus] = useState<
    'loading' | 'ready' | 'saving' | 'saved'
  >('loading')

  const {
    data: loadedDocument,
    isLoading,
    isError
  } = trpc.document.load.useQuery()

  const { mutate: saveDocument } = trpc.document.save.useMutation({
    onMutate: () => {
      setSaveStatus('saving')
    },
    onSuccess: () => {
      setSaveStatus('saved')
    },
    onError: () => {
      setSaveStatus('ready')
    }
  })

  useEffect(() => {
    if (!editor || !loadedDocument || isLoading) return

    try {
      loadSnapshot(editor.store, loadedDocument.document)
      setSaveStatus('ready')
    } catch (error) {
      console.error('Error loading drawing:', error)
    }
  }, [editor, loadedDocument, isLoading])

  useEffect(() => {
    let autoSaveTimer: ReturnType<typeof setTimeout> | null = null

    const unsubscribe = editor.store.listen(
      () => {
        if (autoSaveTimer) clearTimeout(autoSaveTimer)
        setSaveStatus('saving')

        autoSaveTimer = setTimeout(() => {
          const { document } = getSnapshot(editor.store)

          saveDocument({
            document
          })
        }, 1000)
      },
      { scope: 'document', source: 'user' }
    )

    return () => {
      unsubscribe()
      if (autoSaveTimer) clearTimeout(autoSaveTimer)
    }
  }, [editor, saveDocument])

  return (
    <div
      className='rounded-md shadow-sm p-2 w-60 bg-white text-base m-2'
      style={{ pointerEvents: 'all' }}
    >
      {isLoading ? (
        <p className='text-gray-600'>Loading...</p>
      ) : isError ? (
        <p>Error loading</p>
      ) : (
        <div className='flex flex-col justify-center gap-2'>
          {saveStatus === 'saving' ? (
            <p className='text-blue-600'>Saving...</p>
          ) : saveStatus === 'saved' ? (
            <p className='text-green-600'>Saved!</p>
          ) : (
            <p className='text-gray-600'>Ready</p>
          )}
        </div>
      )}
    </div>
  )
}
