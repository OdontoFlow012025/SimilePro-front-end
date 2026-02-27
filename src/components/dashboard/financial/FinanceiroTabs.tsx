"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  
  const [activeTab, setActiveTab] = useState<TabType>(tabParam || "geral");

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Update URL without full refresh to support bookmarking/redirects
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    router.push(`/${locale}/financeiro?${params.toString()}`, { scroll: false });
  };

  const tabs = [
    { id: "geral", label: "Geral", icon: "payments" },
    { id: "pacientes", label: "Pacientes", icon: "person" },
    { id: "convenios", label: "Convênios", icon: "account_balance" },
    { id: "estoque", label: "Estoque e NFs", icon: "inventory_2" },
  ] as const;

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
