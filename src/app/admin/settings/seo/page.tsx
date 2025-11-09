import { SettingsSidebar } from '@/components/admin/settings-sidebar';
import { Breadcrumb } from '@/components/admin/breadcrumb';
import { AuthGuard } from '@/components/admin/auth-guard';

export default function AdminSEOSettingsPage() {
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
              { label: 'SEO & Meta Settings', href: '/admin/settings/seo' }
            ]} 
          />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SEO & Meta Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Configure meta tags, Open Graph, and SEO settings.
            </p>
          </div>

          <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-8">
            <p className="text-gray-600 dark:text-gray-400">
              SEO settings coming soon. This will include meta tags, Open Graph settings, Twitter cards, sitemap configuration, and more.
            </p>
          </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

