import { TranslationManagement } from '@/components/admin/translation-management'
import { AuthGuard } from '@/components/admin/auth-guard'
import { Breadcrumb } from '@/components/admin/breadcrumb'

export default function AdminTranslationsPage() {
  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Breadcrumb 
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Translations', href: '/admin/translations' }
          ]} 
        />
        <TranslationManagement />
      </div>
    </AuthGuard>
  )
}

