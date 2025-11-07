import { ProjectManagement } from '@/components/admin/project-management'
import { Breadcrumb } from '@/components/admin/breadcrumb'
import { AuthGuard } from '@/components/admin/auth-guard'

export default function AdminProjectsPage() {
  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Projects' }]} />
        <ProjectManagement />
      </div>
    </AuthGuard>
  )
}