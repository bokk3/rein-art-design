'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export function ExportSettings() {
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleExport = async () => {
    setIsExporting(true)
    setExportStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/admin/export-settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to export' }))
        throw new Error(errorData.error || 'Failed to export settings')
      }

      // Get the blob from the response
      const blob = await response.blob()
      
      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rein-art-export-${new Date().toISOString().split('T')[0]}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setExportStatus('success')
      setTimeout(() => setExportStatus('idle'), 3000)
    } catch (error) {
      console.error('Export error:', error)
      setExportStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred')
      setTimeout(() => {
        setExportStatus('idle')
        setErrorMessage('')
      }, 5000)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-[#181818] rounded-lg border border-gray-200 dark:border-gray-700/50 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Export Settings & Data
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Download a complete backup of all settings, configurations, page builder layouts, and uploaded images as a ZIP file.
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-500 mb-4 space-y-1">
            <p><strong>Includes:</strong></p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>All site settings (SEO, social, business, theme, email)</li>
              <li>Languages and translations</li>
              <li>Page builder components (homepage layout)</li>
              <li>Component translations</li>
              <li>Social media integrations</li>
              <li>User roles and permissions</li>
              <li>All uploaded images and thumbnails</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export All Settings
            </>
          )}
        </Button>

        {exportStatus === 'success' && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
            <CheckCircle2 className="h-4 w-4" />
            <span>Export successful! Check your downloads.</span>
          </div>
        )}

        {exportStatus === 'error' && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{errorMessage || 'Export failed'}</span>
          </div>
        )}
      </div>
    </div>
  )
}

