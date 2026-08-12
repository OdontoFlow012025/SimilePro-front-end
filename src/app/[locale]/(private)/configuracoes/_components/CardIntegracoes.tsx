'use client';
import { useState } from 'react';
import { Blocks, Plus, CheckCircle2, XCircle } from 'lucide-react';
import { configuracaoService } from '@/services/configuracaoService';

interface CardIntegracoesProps {
  integracoes: any[];
  isAdmin: boolean;
  dict: any;
}

export default function CardIntegracoes({ integracoes, isAdmin, dict }: CardIntegracoesProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const s = dict.settings.integrations;

  // Fallback mock para demonstração caso o banco não retorne integrações
  const mockIntegracoes = integracoes && integracoes.length > 0 ? integracoes : [
    { id: '1', nome: s.xray, type: 'IMAGE', status: 'ACTIVE' },
    { id: '2', nome: s.pagseguro, type: 'PAYMENT', status: 'INACTIVE' },
  ];

  const [activeList, setActiveList] = useState(mockIntegracoes);

  const toggleIntegration = async (id: string, currentStatus: string) => {
    if (!isAdmin) return;
    setLoadingId(id);
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
    try {
      // Simula chamada de API reativa
      await configuracaoService.updateConfiguracoesGerais({ integracoes: [{ id, status: newStatus }] } as any);
      setActiveList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full relative transition-all ${!isAdmin && 'opacity-90'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
            <Blocks className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h2>
        </div>
        <button 
          disabled={!isAdmin}
          className={`flex items-center gap-1 text-sm font-medium transition-colors ${isAdmin ? 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300' : 'text-gray-400 cursor-not-allowed'}`}
        >
          <Plus className="w-4 h-4" /> {s.add}
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{s.subtitle}</p>
      
      <div className="space-y-4 flex-1 overflow-y-auto relative">
        {activeList.map((intg, idx) => (
          <div key={intg.id || idx} className="relative flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            {loadingId === intg.id && (
               <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
               </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{intg.nome}</p>
              <div className="flex items-center gap-1 mt-1">
                {intg.status === 'ACTIVE' ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                ) : (
                  <XCircle className="w-3 h-3 text-gray-400" />
                )}
                <span className={`text-xs ${intg.status === 'ACTIVE' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {intg.status === 'ACTIVE' ? s.connected : s.disconnected}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {intg.status === 'ACTIVE' && (
                <button 
                  disabled={!isAdmin}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors ${isAdmin ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300' : 'text-gray-400 cursor-not-allowed'}`}
                >
                  {s.configure}
                </button>
              )}
              <button 
                disabled={!isAdmin}
                onClick={() => toggleIntegration(intg.id, intg.status)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${!isAdmin ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' : intg.status === 'ACTIVE' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200' : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-300'}`}
              >
                {intg.status === 'ACTIVE' ? s.disconnected : s.connect}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
