'use client';
import { useState, useEffect } from 'react';
import { Settings, Moon } from 'lucide-react';
import { configuracaoService } from '@/services/configuracaoService';

interface CardPreferenciasProps {
  configuracaoGeral: any;
  isAdmin: boolean;
  dict: any;
}

export default function CardPreferencias({ configuracaoGeral, isAdmin, dict }: CardPreferenciasProps) {
  const [loading, setLoading] = useState(false);
  const s = dict.settings.preferences;

  const [prefs, setPrefs] = useState({
    temaSistema: configuracaoGeral?.temaSistema || 'system',
    notificarEmail: configuracaoGeral?.notificarEmail ?? true,
    backupAutomatico: configuracaoGeral?.backupAutomatico ?? true
  });

  useEffect(() => {
    if (configuracaoGeral) {
      setPrefs({
        temaSistema: configuracaoGeral.temaSistema || 'system',
        notificarEmail: configuracaoGeral.notificarEmail ?? true,
        backupAutomatico: configuracaoGeral.backupAutomatico ?? true
      });
    }
  }, [configuracaoGeral]);

  const handleToggle = async (key: keyof typeof prefs) => {
    if (!isAdmin) return;
    setLoading(true);
    const newValue = !prefs[key];
    setPrefs(prev => ({ ...prev, [key]: newValue }));
    
    try {
      await configuracaoService.updateConfiguracoesGerais({ [key]: newValue });
    } catch (e) {
      // Revert on error
      setPrefs(prev => ({ ...prev, [key]: !newValue }));
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
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
          <Settings className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h2>
      </div>
      
      <div className="space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{s.systemTheme}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.themeDesc}</p>
          </div>
          <select 
            disabled={!isAdmin}
            value={prefs.temaSistema}
            onChange={async (e) => {
              if (!isAdmin) return;
              setLoading(true);
              const val = e.target.value;
              setPrefs(prev => ({ ...prev, temaSistema: val }));
              await configuracaoService.updateConfiguracoesGerais({ temaSistema: val as any });
              setLoading(false);
            }}
            className={`text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${!isAdmin && 'cursor-not-allowed opacity-70'}`}
          >
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
            <option value="system">Sistema</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{s.emailNotif}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.emailDesc}</p>
          </div>
          <button 
            disabled={!isAdmin}
            onClick={() => handleToggle('notificarEmail')}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!isAdmin && 'cursor-not-allowed opacity-70'} ${prefs.notificarEmail ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'}`}
          >
            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prefs.notificarEmail ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{s.autoBackup}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.backupDesc}</p>
          </div>
          <button 
            disabled={!isAdmin}
            onClick={() => handleToggle('backupAutomatico')}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!isAdmin && 'cursor-not-allowed opacity-70'} ${prefs.backupAutomatico ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'}`}
          >
            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prefs.backupAutomatico ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
      
      <button 
        disabled={!isAdmin}
        className={`mt-6 w-full text-sm font-medium py-2 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors ${isAdmin ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' : 'text-gray-400 cursor-not-allowed bg-gray-50/50 dark:bg-gray-800/50'}`}
      >
        {s.export}
      </button>
    </div>
  );
}
