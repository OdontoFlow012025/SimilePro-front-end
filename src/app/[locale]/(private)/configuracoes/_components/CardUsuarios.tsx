'use client';
import { Users, Plus } from 'lucide-react';

interface CardUsuariosProps {
  usuarios: any[];
  isAdmin: boolean;
  dict: any;
}

export default function CardUsuarios({ usuarios, isAdmin, dict }: CardUsuariosProps) {
  const displayUsers = usuarios.slice(0, 3);
  const s = dict.settings.users;

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full transition-all ${!isAdmin && 'opacity-90'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h2>
        </div>
        <button 
          disabled={!isAdmin}
          className={`flex items-center gap-1 text-sm font-medium transition-colors ${isAdmin ? 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300' : 'text-gray-400 cursor-not-allowed'}`}
        >
          <Plus className="w-4 h-4" /> {s.add}
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{s.subtitle}</p>
      
      <div className="space-y-3 flex-1 overflow-y-auto">
        {displayUsers.length === 0 && (
           <p className="text-sm text-gray-500 text-center py-4">{s.notFound}</p>
        )}
        {displayUsers.map((user, idx) => (
          <div key={user.id || idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-3">
              {user.usuario?.avatarUrl ? (
                <img src={user.usuario.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                  {getInitials(user.usuario?.nome || user.usuario?.name || user.usuario?.nomeCompleto || '??')}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">{user.usuario?.nome || user.usuario?.name || user.usuario?.nomeCompleto || s.noName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{(user.cargo || user.usuario?.tipoUsuario || s.employee).replace('_', ' ')}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${user.ativo === false ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
              {user.ativo === false ? s.inactive : s.active}
            </span>
          </div>
        ))}
      </div>
      
      {usuarios.length > 3 && (
        <button className="mt-4 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors w-full text-center">
          {s.seeAll.replace('{count}', usuarios.length.toString())}
        </button>
      )}
    </div>
  );
}
