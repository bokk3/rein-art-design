import { Suspense } from "react";
import { AuthForm } from "../../components/auth-form";
import { AuthLoading } from "../../components/auth-loading";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-8 sm:p-10">
          <div className="mb-8 text-center">
            <Link 
              href="/" 
              className="text-3xl font-bold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Portfolio CMS
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Sign in to access the admin panel
            </p>
          </div>
          
          <Suspense fallback={<AuthLoading />}>
            <AuthForm />
          </Suspense>
          
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}