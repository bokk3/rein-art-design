import { AdminNavigation } from '../../components/admin/admin-navigation'
import { AdminLayoutWrapper } from '../../components/admin/admin-layout-wrapper'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLayoutWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminNavigation />
        <main>{children}</main>
      </div>
    </AdminLayoutWrapper>
  )
}