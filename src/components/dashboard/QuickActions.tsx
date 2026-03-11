"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function QuickActions({ dictionary }: { dictionary: any }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'pt-BR';
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
        <span className="material-symbols-outlined text-blue-500">rocket_launch</span> {dictionary?.dashboard?.quickActions?.title || "Ações Rápidas"}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <Link href={`/${locale}/agenda`} className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-green-600 hover:bg-green-50/30 transition-all group cursor-pointer">
          <span className="material-symbols-outlined text-green-600 text-3xl group-hover:scale-110 transition-transform">event_available</span>
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{dictionary?.dashboard?.quickActions?.newAppointment || "Novo Agendamento"}</span>
        </Link>
        <Link href={`/${locale}/agenda`} className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-green-600 hover:bg-green-50/30 transition-all group cursor-pointer">
          <span className="material-symbols-outlined text-green-600 text-3xl group-hover:scale-110 transition-transform">how_to_reg</span>
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{dictionary?.dashboard?.quickActions?.checkin || "Check-in Paciente"}</span>
        </Link>
        <Link href={`/${locale}/financeiro`} className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-blue-500 hover:bg-blue-50/30 transition-all group cursor-pointer">
          <span className="material-symbols-outlined text-blue-500 text-3xl group-hover:scale-110 transition-transform">add_card</span>
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{dictionary?.dashboard?.quickActions?.expense || "Lançar Despesa"}</span>
        </Link>
        <Link href={`/${locale}/relatorios`} className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-blue-500 hover:bg-blue-50/30 transition-all group cursor-pointer">
          <span className="material-symbols-outlined text-blue-500 text-3xl group-hover:scale-110 transition-transform">analytics</span>
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{dictionary?.dashboard?.quickActions?.report || "Relatórios BI"}</span>
        </Link>
      </div>
    </section>
  );
}
