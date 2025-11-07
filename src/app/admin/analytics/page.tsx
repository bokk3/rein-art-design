import { AnalyticsDashboard } from '../../../components/admin/analytics-dashboard'
import { Breadcrumb } from '../../../components/admin/breadcrumb'
import { AuthGuard } from '../../../components/admin/auth-guard'

export default function AdminAnalyticsPage() {
  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <Breadcrumb items={[{ label: 'Analytics' }]} />
        <AnalyticsDashboard />
      </div>
    </AuthGuard>
  )
}

