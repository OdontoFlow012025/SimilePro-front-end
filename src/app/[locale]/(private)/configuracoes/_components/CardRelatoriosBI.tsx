'use client';
import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { configuracaoService } from '@/services/configuracaoService';

interface CardRelatoriosBIProps {
  configuracaoGeral: any;
  isAdmin: boolean;
  dict: any;
}

export default function CardRelatoriosBI({ configuracaoGeral, isAdmin, dict }: CardRelatoriosBIProps) {
  const [loading, setLoading] = useState(false);
  const s = dict.settings.bi;

  const [bi, setBi] = useState({
    acessoDadosFinanceiros: configuracaoGeral?.acessoDadosFinanceiros ?? true,
    filtroPeriodoPadrao: configuracaoGeral?.filtroPeriodoPadrao || '30d'
  });

  useEffect(() => {
    if (configuracaoGeral) {
      setBi({
        acessoDadosFinanceiros: configuracaoGeral.acessoDadosFinanceiros ?? true,
        filtroPeriodoPadrao: configuracaoGeral.filtroPeriodoPadrao || '30d'
      });
    }
  }, [configuracaoGeral]);

  const handleToggle = async (key: keyof typeof bi, value: any) => {
    if (!isAdmin) return;
    setLoading(true);
    const oldVal = bi[key];
    setBi(prev => ({ ...prev, [key]: value }));
    try {
      await configuracaoService.updateConfiguracoesGerais({ [key]: value });
    } catch (e) {
      setBi(prev => ({ ...prev, [key]: oldVal }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full relative transition-all ${!isAdmin && 'opacity-90'}`}>
      {loading && (
         <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
         </div>
      )}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400">
          <BarChart3 className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h2>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{s.subtitle}</p>
      
      <div className="space-y-6 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{s.financialData}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.financialDesc}</p>
          </div>
          <button 
            disabled={!isAdmin}
            onClick={() => handleToggle('acessoDadosFinanceiros', !bi.acessoDadosFinanceiros)}
            className={`mt-1 relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!isAdmin && 'cursor-not-allowed opacity-70'} ${bi.acessoDadosFinanceiros ? 'bg-cyan-600' : 'bg-gray-200 dark:bg-gray-600'}`}
          >
            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${bi.acessoDadosFinanceiros ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{s.defaultWindow}</p>
          <select 
            disabled={!isAdmin}
            value={bi.filtroPeriodoPadrao}
            onChange={(e) => handleToggle('filtroPeriodoPadrao', e.target.value)}
            className={`w-full text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${!isAdmin && 'cursor-not-allowed opacity-70'}`}
          >
            <option value="7d">{s.days7}</option>
            <option value="30d">{s.days30}</option>
            <option value="90d">{s.days90}</option>
            <option value="365d">{s.days365}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
