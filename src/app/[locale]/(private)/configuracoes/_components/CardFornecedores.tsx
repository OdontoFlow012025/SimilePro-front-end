'use client';
import { useState, useEffect } from 'react';
import { Truck, Plus } from 'lucide-react';
import { configuracaoService } from '@/services/configuracaoService';

interface CardFornecedoresProps {
  configuracaoGeral: any;
  categorias: any[];
  isAdmin: boolean;
  dict: any;
}

export default function CardFornecedores({ configuracaoGeral, categorias, isAdmin, dict }: CardFornecedoresProps) {
  const [loading, setLoading] = useState(false);
  const s = dict.settings.suppliers;

  const displayCategorias = categorias && categorias.length > 0 ? categorias : [
    { id: '1', nome: s.disposables },
    { id: '2', nome: s.medicalEquip },
    { id: '3', nome: s.maintenance },
  ];

  const [fornecedoresConfig, setFornecedoresConfig] = useState({
    prazoPagtoFornecedorDias: configuracaoGeral?.prazoPagtoFornecedorDias || 30,
    exigirNFFornecedor: configuracaoGeral?.exigirNFFornecedor ?? true
  });

  useEffect(() => {
    if (configuracaoGeral) {
      setFornecedoresConfig({
        prazoPagtoFornecedorDias: configuracaoGeral.prazoPagtoFornecedorDias || 30,
        exigirNFFornecedor: configuracaoGeral.exigirNFFornecedor ?? true
      });
    }
  }, [configuracaoGeral]);

  const handleUpdate = async (key: keyof typeof fornecedoresConfig, value: any) => {
    if (!isAdmin) return;
    setLoading(true);
    const oldVal = fornecedoresConfig[key];
    setFornecedoresConfig(prev => ({ ...prev, [key]: value }));
    try {
      await configuracaoService.updateConfiguracoesGerais({ [key]: value });
    } catch (e) {
      setFornecedoresConfig(prev => ({ ...prev, [key]: oldVal }));
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
            <Truck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h2>
        </div>
      </div>
      
      <div className="space-y-6 flex-1">
        
        {/* Categorias de Fornecedores */}
        <div>
          <div className="flex items-center justify-between mb-3">
             <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{s.categories}</label>
             <button 
               disabled={!isAdmin}
               className={`text-xs font-medium flex items-center gap-1 transition-colors ${isAdmin ? 'text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300' : 'text-gray-400 cursor-not-allowed'}`}
             >
               <Plus className="w-3 h-3" /> {s.add}
             </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {displayCategorias.map((cat, idx) => (
              <span key={cat.id || idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600">
                {cat.nome}
              </span>
            ))}
          </div>
        </div>

        {/* Prazos e Regras */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
           <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{s.paymentTerms}</label>
           
           <div className="flex items-center justify-between">
             <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.defaultTerm}</p>
             <input 
               type="number" 
               disabled={!isAdmin}
               value={fornecedoresConfig.prazoPagtoFornecedorDias}
               onBlur={(e) => handleUpdate('prazoPagtoFornecedorDias', parseInt(e.target.value))}
               onChange={(e) => setFornecedoresConfig(prev => ({...prev, prazoPagtoFornecedorDias: parseInt(e.target.value)}))}
               className={`w-20 text-sm text-center rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 ${!isAdmin && 'cursor-not-allowed opacity-70'}`}
             />
           </div>

           <div className="flex items-center justify-between">
             <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.requireInvoice}</p>
             <button 
               disabled={!isAdmin}
               onClick={() => handleUpdate('exigirNFFornecedor', !fornecedoresConfig.exigirNFFornecedor)}
               className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!isAdmin && 'cursor-not-allowed opacity-70'} ${fornecedoresConfig.exigirNFFornecedor ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-600'}`}
             >
               <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${fornecedoresConfig.exigirNFFornecedor ? 'translate-x-4' : 'translate-x-0'}`} />
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
