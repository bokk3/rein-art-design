import { AdminDashboard } from "../../components/admin-dashboard";
import { AuthGuard } from "../../components/admin/auth-guard";

export default function AdminPage() {
  return (
    <AuthGuard requireAuth={false} redirect={false}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <AdminDashboard />
      </div>
    </AuthGuard>
  );
}