'use client';
import { Stethoscope, Plus } from 'lucide-react';

interface CardServicosProps {
  procedimentos: any[];
  isAdmin: boolean;
  dict: any;
}

export default function CardServicos({ procedimentos, isAdmin, dict }: CardServicosProps) {
  const displayProcedures = procedimentos.slice(0, 3);
  const s = dict.settings.services;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full transition-all ${!isAdmin && 'opacity-90'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h2>
        </div>
        <button 
          disabled={!isAdmin}
          className={`flex items-center gap-1 text-sm font-medium transition-colors ${isAdmin ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300' : 'text-gray-400 cursor-not-allowed'}`}
        >
          <Plus className="w-4 h-4" /> {s.add}
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{s.subtitle}</p>
      
      <div className="space-y-3 flex-1 overflow-y-auto">
        {displayProcedures.length === 0 && (
           <p className="text-sm text-gray-500 text-center py-4">{s.notFound}</p>
        )}
        {displayProcedures.map((proc, idx) => (
          <div key={proc.id || idx} className="flex flex-col p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
               <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">{proc.nome || proc.name || s.service}</p>
               <p className="text-sm font-bold text-gray-900 dark:text-white">
                 {dict.locale === 'en' ? '$' : 'R$'} {parseFloat(proc.valorPadrao || proc.price || 0).toFixed(2).replace('.', dict.locale === 'en' ? '.' : ',')}
               </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{proc.categoria || proc.category || s.general}</p>
          </div>
        ))}
      </div>
      
      {procedimentos.length > 3 && (
        <button className="mt-4 text-xs font-medium text-gray-500 hover:text-emerald-600 transition-colors w-full text-center">
          {s.seeAll.replace('{count}', procedimentos.length.toString())}
        </button>
      )}
    </div>
  );
}
