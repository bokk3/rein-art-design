import { ContactMessageManagement } from "../../../components/admin/contact-message-management";
import { Breadcrumb } from "../../../components/admin/breadcrumb";
import { AuthGuard } from "../../../components/admin/auth-guard";

export default function AdminMessagesPage() {
  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Contact Messages' }]} />
        <ContactMessageManagement />
      </div>
    </AuthGuard>
  );
}