"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const getMenuItems = (dict: any) => [
  { label: dict?.dashboard?.sidebar?.dashboard || "Dashboard", href: "/dashboard", icon: "dashboard", section: "Main" },
  
  { label: dict?.dashboard?.sidebar?.operational || "Operacional", isHeader: true },
  { label: dict?.dashboard?.sidebar?.schedule || "Agenda Clínica", href: "/agenda", icon: "calendar_month" },
  { label: dict?.dashboard?.sidebar?.patients || "Pacientes", href: "/pacientes", icon: "person" },
  { label: dict?.dashboard?.sidebar?.records || "Prontuários", href: "/prontuarios", icon: "description" },

  { label: dict?.dashboard?.sidebar?.administrative || "Administrativo", isHeader: true },
  { label: dict?.dashboard?.sidebar?.financial || "Financeiro", href: "/financeiro", icon: "payments" },
  { label: dict?.dashboard?.sidebar?.inventory || "Estoque", href: "/estoque", icon: "inventory_2" },
  { label: dict?.dashboard?.sidebar?.reports || "Relatórios BI", href: "/relatorios", icon: "analytics" },
  { label: dict?.dashboard?.sidebar?.team || "Equipe", href: "/equipe", icon: "groups" },

  { label: dict?.dashboard?.sidebar?.system || "Sistema", isHeader: true },
  { label: dict?.dashboard?.sidebar?.settings || "Configurações", href: "/configuracoes", icon: "settings" },
];

export default function Sidebar({ dictionary }: { dictionary: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const MENU_ITEMS = getMenuItems(dictionary);

  const handleLogout = () => {
    // Clear cookie
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.refresh(); // Refresh to trigger middleware/page logic
    router.push("/login"); // Fallback redirect
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    return pathname.startsWith(href) && href !== '/dashboard';
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">dentistry</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#111518] dark:text-white">OdontoFlow</h1>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto pr-2">
          {MENU_ITEMS.map((item, index) => {
            if (item.isHeader) {
               return (
                 <div key={index} className="pt-2 pb-1 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                   {item.label}
                 </div>
               );
            }

            const active = isActive(item.href);
            
            return (
              <Link 
                key={index} 
                href={item.href || '#'} 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium
                  ${active 
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <span className={`material-symbols-outlined ${!active ? 'text-gray-500' : ''}`}>{item.icon}</span> 
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
          <div className="flex items-center gap-3 mb-4">
             {/* Using a generic avatar placeholder or initial since we don't have the user image handy yet */}
            <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
               AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-gray-900 dark:text-white">Admin</p>
              <p className="text-xs text-gray-500 truncate">{dictionary?.dashboard?.sidebar?.role || "Administrador"}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">logout</span> {dictionary?.dashboard?.sidebar?.logout || "Sair"}
          </button>
        </div>
      </div>
    </aside>
  );
}
