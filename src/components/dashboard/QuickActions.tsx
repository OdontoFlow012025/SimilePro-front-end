"use client";

export default function QuickActions() {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
        <span className="material-symbols-outlined text-blue-500">rocket_launch</span> Ações Rápidas
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-green-600 hover:bg-green-50/30 transition-all group cursor-pointer">
          <span className="material-symbols-outlined text-green-600 text-3xl group-hover:scale-110 transition-transform">event_available</span>
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Novo Agendamento</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-green-600 hover:bg-green-50/30 transition-all group cursor-pointer">
          <span className="material-symbols-outlined text-green-600 text-3xl group-hover:scale-110 transition-transform">how_to_reg</span>
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Check-in Paciente</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-blue-500 hover:bg-blue-50/30 transition-all group cursor-pointer">
          <span className="material-symbols-outlined text-blue-500 text-3xl group-hover:scale-110 transition-transform">add_card</span>
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Lançar Despesa</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-blue-500 hover:bg-blue-50/30 transition-all group cursor-pointer">
          <span className="material-symbols-outlined text-blue-500 text-3xl group-hover:scale-110 transition-transform">description</span>
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Gerar DRE</span>
        </button>
      </div>
    </section>
  );
}
