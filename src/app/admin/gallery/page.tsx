import { Metadata } from 'next'
import { GalleryManagement } from '@/components/admin/gallery-management'
import { AuthGuard } from '@/components/admin/auth-guard'

export const metadata: Metadata = {
  title: 'Gallery Management - Admin',
  description: 'Manage media library and image gallery'
}

export default function GalleryPage() {
  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            Gallery Management
          </h1>
        </div>

        <GalleryManagement />
      </div>
    </AuthGuard>
  )
}