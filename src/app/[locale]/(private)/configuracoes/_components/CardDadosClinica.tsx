'use client';
import { Building, Edit2, UploadCloud } from 'lucide-react';

interface CardDadosClinicaProps {
  clinica: any;
  isAdmin: boolean;
  dict: any;
}

export default function CardDadosClinica({ clinica, isAdmin, dict }: CardDadosClinicaProps) {
  const isEditingEnabled = isAdmin;
  const s = dict.settings.clinicData;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all ${!isAdmin && 'opacity-90'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <Building className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h2>
        </div>
        <button 
          disabled={!isEditingEnabled}
          className={`flex items-center gap-1 text-sm font-medium transition-colors ${isEditingEnabled ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' : 'text-gray-400 cursor-not-allowed'}`}
        >
          <Edit2 className="w-4 h-4" /> {s.editAll}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Identidade Visual */}
        <div className="space-y-3">
           <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{s.visualIdentity}</label>
           <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
             <div className="w-16 h-16 rounded-lg bg-green-100/50 flex items-center justify-center text-green-700 border border-green-200 overflow-hidden">
                {clinica?.logoUrl ? (
                  <img src={clinica.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-xs text-center leading-tight">{s.noLogo}</span>
                )}
             </div>
             <div>
               <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">{clinica?.logoUrl ? s.currentLogo : s.noImage}</p>
               <button 
                 disabled={!isEditingEnabled}
                 className={`text-xs flex items-center gap-1 mt-1 font-medium hover:underline ${isEditingEnabled ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 cursor-not-allowed'}`}
               >
                 <UploadCloud className="w-3 h-3" /> {s.changeLogo}
               </button>
             </div>
           </div>
        </div>

        {/* Informações Gerais */}
        <div className="space-y-4">
           <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{s.generalInfo}</label>
           <div className="space-y-3">
             <div>
               <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.clinicName}</p>
               <input 
                 type="text" 
                 readOnly 
                 value={clinica?.name || clinica?.nomeFantasia || '---'} 
                 className="w-full text-sm font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-200 dark:border-gray-700 pb-1 focus:outline-none" 
               />
             </div>
             <div>
               <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.cnpj}</p>
               <input 
                 type="text" 
                 readOnly 
                 value={clinica?.document || clinica?.cnpj || '---'} 
                 className="w-full text-sm font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-200 dark:border-gray-700 pb-1 focus:outline-none" 
               />
             </div>
           </div>
        </div>

        {/* Contato e Endereço */}
        <div className="space-y-4">
           <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{s.contactAddress}</label>
           <div className="space-y-3">
             <div>
               <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.mainPhone}</p>
               <input 
                 type="text" 
                 readOnly 
                 value={clinica?.phone || clinica?.telefone || '---'} 
                 className="w-full text-sm font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-200 dark:border-gray-700 pb-1 focus:outline-none" 
               />
             </div>
             <div>
               <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.fullAddress}</p>
               <input 
                 type="text" 
                 readOnly 
                 value={clinica?.address || clinica?.enderecoCompleto || '---'} 
                 className="w-full text-sm font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-200 dark:border-gray-700 pb-1 focus:outline-none truncate" 
               />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
