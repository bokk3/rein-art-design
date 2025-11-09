import { BusinessSettings } from '@/components/admin/business-settings';
import { SettingsSidebar } from '@/components/admin/settings-sidebar';
import { Breadcrumb } from '@/components/admin/breadcrumb';
import { AuthGuard } from '@/components/admin/auth-guard';

export default function AdminBusinessSettingsPage() {
  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8 p-6 animate-fade-in">
          <SettingsSidebar />
          
          <div className="flex-1 min-w-0 space-y-8">
          <Breadcrumb 
            items={[
              { label: 'Admin', href: '/admin' },
              { label: 'Settings', href: '/admin/settings' },
              { label: 'Business Information', href: '/admin/settings/business' }
            ]} 
          />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Information</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage company details, contact information, and business hours.
            </p>
          </div>

          <BusinessSettings />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

