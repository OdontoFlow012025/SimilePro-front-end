"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">dentistry</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#111518] dark:text-white">OdontoFlow</h1>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto pr-2">
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue-500 text-white font-medium">
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </Link>
          
          <div className="pt-2 pb-1 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Operacional</div>
          
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">calendar_month</span> Agenda Clínica
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">person</span> Pacientes
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">description</span> Prontuários
          </Link>
          
          <div className="pt-2 pb-1 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Administrativo</div>
          
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">payments</span> Financeiro
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">inventory_2</span> Estoque
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">analytics</span> Relatórios BI
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">groups</span> Equipe
          </Link>
          
          <div className="pt-2 pb-1 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sistema</div>
          
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">settings</span> Configurações
          </Link>
        </nav>
        
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
          <div className="flex items-center gap-3 mb-4">
             {/* Using a generic avatar placeholder or initial since we don't have the user image handy yet */}
            <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
               AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-gray-900 dark:text-white">Admin</p>
              <p className="text-xs text-gray-500 truncate">Administrador</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
            <span className="material-symbols-outlined text-sm">logout</span> Sair
          </button>
        </div>
      </div>
    </aside>
  );
}
