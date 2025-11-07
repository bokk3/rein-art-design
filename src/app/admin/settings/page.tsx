import { EmailSettings } from '@/components/admin/email-settings';
import { ThemeSettings } from '@/components/admin/theme-settings';
import { LanguageSettings } from '@/components/admin/language-settings';
import { Breadcrumb } from '@/components/admin/breadcrumb';
import { AuthGuard } from '@/components/admin/auth-guard';

export default function AdminSettingsPage() {
  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto space-y-8 p-6 animate-fade-in">
        <Breadcrumb 
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Settings', href: '/admin/settings' }
          ]} 
        />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your system configuration and preferences.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Languages & Localization
            </h2>
            <LanguageSettings />
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Appearance & Theme
            </h2>
            <ThemeSettings />
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Email Configuration
            </h2>
            <EmailSettings />
          </section>
        </div>
      </div>
    </AuthGuard>
  );
}