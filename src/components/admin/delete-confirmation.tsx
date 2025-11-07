'use client'

import { Button } from '@/components/ui/button'
import { useT } from '@/hooks/use-t'

interface DeleteConfirmationProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function DeleteConfirmation({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  loading = false 
}: DeleteConfirmationProps) {
  const { t } = useT()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            {t('button.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? t('button.deleting') : t('button.delete')}
          </Button>
        </div>
      </div>
    </div>
  )
}