'use client';
import { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';
import { configuracaoService } from '@/services/configuracaoService';

interface CardPortalPacienteProps {
  configuracaoGeral: any;
  isAdmin: boolean;
  dict: any;
}

export default function CardPortalPaciente({ configuracaoGeral, isAdmin, dict }: CardPortalPacienteProps) {
  const [loading, setLoading] = useState(false);
  const s = dict.settings.portal;

  const [portal, setPortal] = useState({
    portalAtivo: configuracaoGeral?.portalAtivo ?? true,
    permitePagamentoOnline: configuracaoGeral?.permitePagamentoOnline ?? true,
    visHistorico: configuracaoGeral?.visHistorico ?? false,
    acessoFaturasAbertas: configuracaoGeral?.acessoFaturasAbertas ?? true
  });

  useEffect(() => {
    if (configuracaoGeral) {
      setPortal({
        portalAtivo: configuracaoGeral.portalAtivo ?? true,
        permitePagamentoOnline: configuracaoGeral.permitePagamentoOnline ?? true,
        visHistorico: configuracaoGeral.visHistorico ?? false,
        acessoFaturasAbertas: configuracaoGeral.acessoFaturasAbertas ?? true
      });
    }
  }, [configuracaoGeral]);

  const handleToggle = async (key: keyof typeof portal) => {
    if (!isAdmin) return;
    setLoading(true);
    const newValue = !portal[key];
    setPortal(prev => ({ ...prev, [key]: newValue }));
    try {
      await configuracaoService.updateConfiguracoesGerais({ [key]: newValue });
    } catch (e) {
      setPortal(prev => ({ ...prev, [key]: !newValue }));
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
        <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400">
          <Smartphone className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h2>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{s.subtitle}</p>
      
      <div className="space-y-4 flex-1">
        
        {/* Toggle Principal */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.active}</p>
          <button 
            disabled={!isAdmin}
            onClick={() => handleToggle('portalAtivo')}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!isAdmin && 'cursor-not-allowed opacity-70'} ${portal.portalAtivo ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-600'}`}
          >
            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${portal.portalAtivo ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className={`space-y-4 transition-opacity duration-300 ${!portal.portalAtivo ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.onlinePayment}</p>
            <button 
              disabled={!isAdmin}
              onClick={() => handleToggle('permitePagamentoOnline')}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!isAdmin && 'cursor-not-allowed opacity-70'} ${portal.permitePagamentoOnline ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-600'}`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${portal.permitePagamentoOnline ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.clinicalHistory}</p>
            <button 
              disabled={!isAdmin}
              onClick={() => handleToggle('visHistorico')}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!isAdmin && 'cursor-not-allowed opacity-70'} ${portal.visHistorico ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-600'}`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${portal.visHistorico ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.openInvoices}</p>
            <button 
              disabled={!isAdmin}
              onClick={() => handleToggle('acessoFaturasAbertas')}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!isAdmin && 'cursor-not-allowed opacity-70'} ${portal.acessoFaturasAbertas ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-600'}`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${portal.acessoFaturasAbertas ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
