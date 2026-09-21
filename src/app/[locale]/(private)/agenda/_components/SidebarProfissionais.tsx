'use client';

import { AgendamentoViewDTO } from '@/types/agendamento';

interface SidebarProfissionaisProps {
  profissionais: { id: number; nome: string; especialidade: string; avatarUrl?: string }[];
  todosDentistas: { id: number; nome: string; especialidade: string; }[];
  selectedProfessionalId: number | null;
  onSelectProfessional: (id: number | null) => void;
}

export default function SidebarProfissionais({ profissionais, todosDentistas, selectedProfessionalId, onSelectProfessional }: SidebarProfissionaisProps) {
  return (
    <div className="w-full lg:w-72 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700/80 p-5 flex flex-col gap-6 overflow-y-auto">
      <div className="relative">
        <select 
          value={selectedProfessionalId || ''}
          onChange={(e) => onSelectProfessional(e.target.value ? Number(e.target.value) : null)}
          className="w-full pl-3 pr-8 py-2 text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white appearance-none font-medium cursor-pointer"
        >
          <option value="">Filtrar profissional...</option>
          {todosDentistas.map(d => (
            <option key={d.id} value={d.id}>
              {d.nome} - {d.especialidade}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          DENTISTAS ({profissionais.length})
        </h3>
        <div className="space-y-2">
          {profissionais.map(prof => {
            const isSelected = selectedProfessionalId === prof.id;
            return (
              <button
                key={prof.id}
                onClick={() => onSelectProfessional(isSelected ? null : prof.id)}
                className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  isSelected 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-500 dark:ring-indigo-400' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                }`}
              >
                <div className="relative">
                  {prof.avatarUrl ? (
                    <img src={prof.avatarUrl} alt={prof.nome} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm">
                      {prof.nome.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  {/* Status Indicator */}
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white dark:border-gray-800 rounded-full ${isSelected ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
                </div>
                <div className="overflow-hidden">
                  <p className={`text-sm font-semibold truncate ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-gray-900 dark:text-white'}`}>
                    {prof.nome}
                  </p>
                  <p className={`text-xs truncate ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {prof.especialidade}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
