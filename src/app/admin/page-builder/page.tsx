import { PageBuilderManagement } from '@/components/admin/page-builder-management'
import { AuthGuard } from '@/components/admin/auth-guard'

export default function PageBuilderPage() {
  return (
    <AuthGuard>
      <PageBuilderManagement />
    </AuthGuard>
  )
}