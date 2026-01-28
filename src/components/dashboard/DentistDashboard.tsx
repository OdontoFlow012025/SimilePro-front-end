"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { useRouter } from "next/navigation";

interface DentistDashboardProps {
  locale: string;
}

export default function DentistDashboard({ locale }: DentistDashboardProps) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.refresh();
    router.push(`/${locale}/login`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">OdontoFlow (Dentista)</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="rounded-lg border-4 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center h-96">
             <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Área do Dentista</h2>
             <p className="mt-2 text-gray-500 dark:text-gray-400">
               Funcionalidades específicas para dentistas serão implementadas aqui.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
}
