"use client";

import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 py-4 border-b border-gray-200 dark:border-gray-800">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Visão Geral da Clínica</h2>
        <p className="text-sm text-gray-500">Monitoramento integrado: Administrativo e Operacional.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
          <span className="material-symbols-outlined text-blue-500 text-lg">location_on</span>
          <select className="bg-transparent border-none text-sm font-medium focus:ring-0 dark:text-white cursor-pointer outline-none">
            <option>Unidade Centro</option>
            <option>Unidade Jardins</option>
            <option>Unidade Norte</option>
          </select>
        </div>
        
        <ThemeToggle />
        
        <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 relative hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>
      </div>
    </header>
  );
}
