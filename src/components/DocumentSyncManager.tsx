import { useState, useEffect } from 'react'
import { getSnapshot, loadSnapshot, useEditor } from 'tldraw'
import { Loader, CheckCircle, AlertTriangle, FileText } from 'lucide-react'
import { trpc } from '@/utils/trpc'

export default function DocumentSyncManager() {
  const editor = useEditor()

  const [saveStatus, setSaveStatus] = useState<
    'loading' | 'ready' | 'saving' | 'saved' | 'error'
  >('loading')

  const { data: loadedDocument, isError } = trpc.document.load.useQuery()

  useEffect(() => {
    if (isError) {
      setSaveStatus('error')
    }
  }, [isError])

  const { mutate: saveDocument } = trpc.document.save.useMutation({
    onMutate: () => {
      setSaveStatus('saving')
    },
    onSuccess: () => {
      setSaveStatus('saved')
    },
    onError: () => {
      setSaveStatus('error')
    }
  })

  useEffect(() => {
    if (!editor || !loadedDocument) return

    try {
      loadSnapshot(editor.store, loadedDocument.document)
      setSaveStatus('ready')
    } catch (error) {
      console.error('Error loading document:', error)
      setSaveStatus('error')
    }
  }, [loadedDocument])

  useEffect(() => {
    let isInitialLoad = true
    let autoSaveTimer: ReturnType<typeof setTimeout> | null = null

    const unsubscribe = editor.store.listen(
      () => {
        if (isInitialLoad) {
          isInitialLoad = false
          return
        }

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
  }, [])

  const renderStatusText = () => {
    switch (saveStatus) {
      case 'loading':
        return (
          <div className='flex items-center text-gray-500'>
            <Loader className='mr-2 h-4 w-4 animate-spin' />
            Loading document...
          </div>
        )
      case 'ready':
        return (
          <div className='flex items-center text-gray-600'>
            <FileText className='mr-2 h-4 w-4' />
            Ready to edit
          </div>
        )
      case 'saving':
        return (
          <div className='flex items-center text-blue-500'>
            <Loader className='mr-2 h-4 w-4 animate-spin' />
            Saving changes...
          </div>
        )
      case 'saved':
        return (
          <div className='flex items-center text-green-600'>
            <CheckCircle className='mr-2 h-4 w-4' />
            All changes saved
          </div>
        )
      case 'error':
        return (
          <div className='flex items-center text-red-600'>
            <AlertTriangle className='mr-2 h-4 w-4' />
            Error loading or saving document
          </div>
        )
      default:
        return <span className='text-gray-400'>Unknown status</span>
    }
  }

  return (
    <div
      className='rounded-md shadow-sm p-2 w-60 bg-white text-base m-2'
      style={{ pointerEvents: 'all' }}
    >
      {renderStatusText()}
    </div>
  )
}
