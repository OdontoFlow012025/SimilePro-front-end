"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type MenuItem = {
  label: string;
  href?: string;
  icon?: string;
  section?: string;
  isHeader?: boolean;
  children?: MenuItem[];
};

const getMenuItems = (dict: any): MenuItem[] => [
  { label: dict?.dashboard?.sidebar?.dashboard || "Dashboard", href: "/dashboard", icon: "dashboard", section: "Main" },
  
  { 
    label: dict?.dashboard?.sidebar?.attendance || "Atendimento", 
    icon: "medical_services",
    children: [
      { label: dict?.dashboard?.sidebar?.schedule || "Agendamento", href: "/agenda", icon: "calendar_month" },
      { label: dict?.dashboard?.sidebar?.reception || "Recepção", href: "/recepcao", icon: "concierge" },
      { label: dict?.dashboard?.sidebar?.patients || "Pacientes", href: "/pacientes", icon: "person" },
      { label: dict?.dashboard?.sidebar?.triage || "Triagem", href: "/triagem", icon: "medical_services" },
      { label: dict?.dashboard?.sidebar?.medicalCare || "Atendimento Médico", href: "/atendimento", icon: "stethoscope" },
    ]
  },

  { 
    label: dict?.dashboard?.sidebar?.administrative || "Administrativo", 
    icon: "admin_panel_settings",
    children: [
      { label: dict?.dashboard?.sidebar?.financial || "Financeiro", href: "/financeiro", icon: "payments" },
      { label: dict?.dashboard?.sidebar?.inventory || "Estoque", href: "/estoque", icon: "inventory_2" },
      { label: dict?.dashboard?.sidebar?.reports || "Relatórios BI", href: "/relatorios", icon: "analytics" },
      { label: dict?.dashboard?.sidebar?.team || "Equipe", href: "/equipe", icon: "groups" },
    ]
  },

  { label: dict?.dashboard?.sidebar?.system || "Sistema", isHeader: true },
  { label: dict?.dashboard?.sidebar?.settings || "Configurações", href: "/configuracoes", icon: "settings" },
];

const getSystemItems = (dict: any): MenuItem[] => [
  { label: dict?.dashboard?.sidebar?.system || "Sistema", isHeader: true },
  { label: dict?.dashboard?.sidebar?.settings || "Configurações", href: "/configuracoes", icon: "settings" },
];

export default function Sidebar({ dictionary, locale }: { dictionary: any; locale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  // Filter out system items from main menu for separate rendering
  const ALL_ITEMS = getMenuItems(dictionary);
  const MENU_ITEMS = ALL_ITEMS.filter(item => item.section !== 'System' && item.label !== (dictionary?.dashboard?.sidebar?.settings || "Configurações") && item.label !== (dictionary?.dashboard?.sidebar?.system || "Sistema"));
  const SYSTEM_ITEMS = getSystemItems(dictionary);

  
  // State for expanded menus, default empty or check current path to auto-expand
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    if (expandedMenus.includes(label)) {
      setExpandedMenus(expandedMenus.filter(item => item !== label));
    } else {
      setExpandedMenus([...expandedMenus, label]);
    }
  };

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.refresh();
    router.push("/login"); 
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    
    // Check if path matches exactly or starts with href (ignoring locale prefix)
    // Matches: /agenda, /pt-BR/agenda, /en/agenda
    // Does not match: /agendamento
    const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^(\\/[^\\/]+)?${escapedHref}(/|$)`);
    
    return !!pathname.match(regex);
  };

  // Helper to check if any child is active to auto-expand or highlight parent
  const isChildActive = (children: MenuItem[]) => {
    return children.some(child => child.href && isActive(child.href));
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
                 <div key={index} className="pt-4 pb-1 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                   {item.label}
                 </div>
               );
            }

            if (item.children) {
                const isExpanded = expandedMenus.includes(item.label) || isChildActive(item.children);
                const hasActiveChild = isChildActive(item.children);
                const isOpen = expandedMenus.includes(item.label);

                return (
                    <div key={index} className="space-y-1">
                        <button
                            onClick={() => toggleMenu(item.label)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors font-medium
                                ${hasActiveChild ? 'text-blue-600 bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`material-symbols-outlined ${!hasActiveChild ? 'text-gray-500' : ''}`}>{item.icon}</span>
                                {item.label}
                            </div>
                            <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                                expand_more
                            </span>
                        </button>
                        
                        {isOpen && (
                            <div className="pl-4 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 ml-6">
                                {item.children.map((child, cIndex) => {
                                    const active = isActive(child.href);
                                    const hrefWithLocale = child.href ? `/${locale}${child.href}` : '#';
                                    return (
                                        <Link 
                                            key={cIndex}
                                            href={hrefWithLocale}
                                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm font-medium border
                                              ${active 
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/30' 
                                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'}
                                            `}
                                        >
                                           <span className="material-symbols-outlined text-[18px]">{child.icon}</span>
                                           {child.label}
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )
            }

            const active = isActive(item.href);
            const hrefWithLocale = item.href ? `/${locale}${item.href}` : '#';
            
            return (
              <Link 
                key={index} 
                href={hrefWithLocale} 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium border
                  ${active 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/30' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <span className={`material-symbols-outlined ${!active ? 'text-gray-500' : ''}`}>{item.icon}</span> 
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        {/* System Menu Area */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
           <div className="mb-2">
              {SYSTEM_ITEMS.map((item, index) => {
                 if (item.isHeader) {
                    return (
                        <div key={index} className="pb-1 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {item.label}
                        </div>
                    );
                 }
                 const active = isActive(item.href);
                 return (
                    <Link 
                        key={index} 
                        href={item.href || '#'} 
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium border
                        ${active 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/30' 
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        <span className={`material-symbols-outlined ${!active ? 'text-gray-500' : ''}`}>{item.icon}</span> 
                        {item.label}
                    </Link>
                 );
              })}
           </div>

           {/* User Profile */}
           <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
             <div className="flex items-center gap-3 mb-4 mt-2">
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
      </div>
    </aside>
  );
}
