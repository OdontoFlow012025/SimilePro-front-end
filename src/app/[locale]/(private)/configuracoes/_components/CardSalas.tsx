'use client';
import { LayoutGrid, Plus } from 'lucide-react';

interface CardSalasProps {
  salas: any[];
  isAdmin: boolean;
  dict: any;
}

export default function CardSalas({ salas, isAdmin, dict }: CardSalasProps) {
  const displaySalas = salas?.slice(0, 3) || [];
  const s = dict.settings.rooms;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full transition-all ${!isAdmin && 'opacity-90'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-pink-50 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h2>
        </div>
        <button 
          disabled={!isAdmin}
          className={`flex items-center gap-1 text-sm font-medium transition-colors ${isAdmin ? 'text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300' : 'text-gray-400 cursor-not-allowed'}`}
        >
          <Plus className="w-4 h-4" /> {s.add}
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{s.subtitle}</p>
      
      <div className="space-y-3 flex-1 overflow-y-auto">
        {displaySalas.length === 0 && (
           <p className="text-sm text-gray-500 text-center py-4">{s.notFound}</p>
        )}
        {displaySalas.map((sala, idx) => (
          <div key={sala.id || idx} className="p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between mb-2">
               <p className="text-sm font-semibold text-gray-900 dark:text-white">{sala.nome}</p>
               <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${sala.status === 'INATIVA' ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'}`}>
                 {sala.status === 'INATIVA' ? s.inactive : s.active}
               </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {sala.equipamentos?.length > 0 ? sala.equipamentos.join(', ') : s.noEquip}
            </p>
          </div>
        ))}
      </div>
      
      {salas?.length > 3 && (
        <button className="mt-4 text-xs font-medium text-gray-500 hover:text-pink-600 transition-colors w-full text-center">
          {s.seeAll.replace('{count}', salas.length.toString())}
        </button>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            disabled={!isAdmin}
            className={`w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500 ${!isAdmin && 'cursor-not-allowed opacity-70'}`} 
            defaultChecked 
          />
          <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{s.cleaning}</span>
        </label>
      </div>
    </div>
  );
}
