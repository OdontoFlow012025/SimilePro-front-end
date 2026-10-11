"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import AccountFlow from "./AccountFlow";
import InsuranceBilling from "./InsuranceBilling";
import InventoryStock from "./InventoryStock";
import PatientBills from "./PatientBills";

type TabType = "geral" | "pacientes" | "convenios" | "estoque";

interface Props {
  dictionary: any;
  locale: string;
}

export default function FinanceiroTabs({ dictionary, locale }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") as TabType;
  
  const [activeTab, setActiveTab] = useState<TabType>("geral");
  const [canViewStock, setCanViewStock] = useState(false);
  const [accessReady, setAccessReady] = useState(false);

  useEffect(() => {
    api.auth.me().then((user) => {
      const role = user?.tipoUsuario || user?.user?.tipoUsuario;
      setCanViewStock(role === "ADMIN_TOTAL" || role === "ADMIN_GERENCIAL");
    }).catch(console.error).finally(() => setAccessReady(true));
  }, []);

  useEffect(() => {
    if (!accessReady) return;
    const allowedTabs: TabType[] = canViewStock ? ["geral", "pacientes", "convenios", "estoque"] : ["geral", "pacientes", "convenios"];
    setActiveTab(tabParam && allowedTabs.includes(tabParam) ? tabParam : "geral");
  }, [tabParam, accessReady, canViewStock]);

  const handleTabChange = (tab: TabType) => {
    if (tab === "estoque" && !canViewStock) return;
    setActiveTab(tab);
    // Update URL without full refresh to support bookmarking/redirects
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    router.push(`/${locale}/financeiro?${params.toString()}`, { scroll: false });
  };

  const tabs = [
    { id: "geral", label: dictionary.financial?.tabs?.general || "Geral", icon: "payments" },
    { id: "pacientes", label: dictionary.financial?.tabs?.patients || "Pacientes", icon: "person" },
    { id: "convenios", label: dictionary.financial?.tabs?.insurances || "Convênios", icon: "account_balance" },
    ...(canViewStock ? [{ id: "estoque" as const, label: dictionary.financial?.tabs?.inventory || "Estoque", icon: "inventory_2" }] : []),
  ] as const;

  if (!accessReady) {
    return <div className="py-12 text-center text-gray-500">Carregando permissões…</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as TabType)}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 font-bold text-sm transition-all whitespace-nowrap
              ${activeTab === tab.id 
                ? "border-blue-600 text-blue-600 bg-blue-50/10" 
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}
            `}
          >
            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === "geral" && <AccountFlow dictionary={dictionary} />}
        {activeTab === "pacientes" && <PatientBills dictionary={dictionary} />}
        {activeTab === "convenios" && <InsuranceBilling dictionary={dictionary} />}
        {activeTab === "estoque" && <InventoryStock dictionary={dictionary} />}
      </div>
    </div>
  );
}
