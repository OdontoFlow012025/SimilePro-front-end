"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  dictionary: any;
}

export default function DashboardLayout({ children, dictionary, locale }: DashboardLayoutProps & { locale: string }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 font-sans">
      <Sidebar dictionary={dictionary} locale={locale} />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header dictionary={dictionary} />
        {children}
      </main>
    </div>
  );
}
