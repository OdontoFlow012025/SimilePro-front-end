"use client";

import React, { useState, useEffect } from "react";
import MetricsCards from "./MetricsCards";
import RevenueChart from "./RevenueChart";
import ProceduresChart from "./ProceduresChart";
import { api } from "@/services/api";

export default function ReportsDashboard({ dict }: { dict: any }) {
  const [clinics, setClinics] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // Identify if we're querying the entire network or a single clinic 
  const isRede = selectedFilter === "all";
  const clinicaId = isRede ? "" : selectedFilter;

  useEffect(() => {
    // Fetch clinics belonging to the same network to populate the dropdown
    api.clinics.getNetworkClinics()
      .then(data => {
        if (Array.isArray(data)) {
          setClinics(data);
        }
      })
      .catch(err => console.error("Error fetching network clinics:", err));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111518] dark:text-white mb-2">
            {dict?.reports?.title || "Relatórios BI"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {dict?.reports?.subtitle || "Análise avançada e indicadores de performance da clínica."}
          </p>
        </div>
        
        {/* Global Filters */}
        <div className="flex items-center gap-3">
          <select 
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 font-bold focus:border-blue-500 block px-4 py-2.5"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">Rede Completa (Todas as Unidades)</option>
            {clinics.map(c => (
              <option key={c.id} value={c.id}>
                {c.nomeFantasia} {c.matrizId ? "" : "(Matriz)"}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-4 focus:ring-gray-100 font-bold rounded-lg text-sm px-4 py-2.5 transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Exportar
          </button>
        </div>
      </div>

      <MetricsCards dict={dict} clinicaId={clinicaId} isRede={isRede} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart dict={dict} clinicaId={clinicaId} isRede={isRede} />
        </div>
        <div className="lg:col-span-1">
          <ProceduresChart dict={dict} clinicaId={clinicaId} isRede={isRede} />
        </div>
      </div>
    </div>
  );
}
