import { LanguageSettings } from '@/components/admin/language-settings';
import { SettingsSidebar } from '@/components/admin/settings-sidebar';
import { Breadcrumb } from '@/components/admin/breadcrumb';
import { AuthGuard } from '@/components/admin/auth-guard';

export default function AdminSettingsPage() {
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
              { label: 'Languages & Localization', href: '/admin/settings' }
          ]} 
        />
        
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Languages & Localization</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage languages, translations, and localization settings.
          </p>
        </div>

            <LanguageSettings />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
